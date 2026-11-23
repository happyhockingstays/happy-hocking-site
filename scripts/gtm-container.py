#!/usr/bin/env python3
"""Writes the Google Tag Manager container for happyhocking.com as an import file: docs/tracking/happyhocking-gtm.json.

    python3 scripts/gtm-container.py GTM-XXXXXXX G-XXXXXXXXXX              # container ID and GA4 measurement ID
    python3 scripts/gtm-container.py GTM-XXXXXXX G-XXXXXXXXXX AW-123/abc   # plus a Google Ads conversion (ID/label), optional

Import it in GTM: Admin > Import Container > choose the file > Existing workspace > Merge >
"Rename conflicting tags, triggers, and variables". Then Preview, test, Submit.
Ported from WentDirect's scripts/gtm-container.py (cole-stark/wentdirect). What every tag does is in docs/tracking/README.md.
"""
import json
import re
import sys
from pathlib import Path

if len(sys.argv) < 3 or not re.fullmatch(r'GTM-[A-Z0-9]+', sys.argv[1]) or not re.fullmatch(r'G-[A-Z0-9]+', sys.argv[2]):
    sys.exit('Usage: python3 scripts/gtm-container.py GTM-XXXXXXX G-XXXXXXXXXX [AW-1234567890/label]')
GTM_ID, GA4 = sys.argv[1], sys.argv[2]
ADS = sys.argv[3] if len(sys.argv) > 3 else ''
OUT = Path(__file__).resolve().parent.parent / 'docs' / 'tracking' / 'happyhocking-gtm.json'

ALL_PAGES = '2147479553'  # GTM's built-in "All Pages"
BASE = {'accountId': '0', 'containerId': '0'}
SITE = r'^https?://(www\.)?happyhocking\.com'


def t(key, value, kind='TEMPLATE'):
    return {'type': kind, 'key': key, 'value': value}


def rows(pairs):
    return {'type': 'LIST', 'key': 'eventSettingsTable',
            'list': [{'type': 'MAP', 'map': [t('parameter', a), t('parameterValue', b)]} for a, b in pairs]}


variables, triggers, tags = [], [], []
_ids = {'v': 100, 'tr': 200, 'tag': 300}


def nid(kind):
    _ids[kind] += 1
    return str(_ids[kind])


def variable(name, kind, params):
    variables.append({**BASE, 'variableId': nid('v'), 'name': name, 'type': kind, 'parameter': params, 'fingerprint': '0'})
    return '{{' + name + '}}'


def dlv(key):
    return variable(f'DLV - {key}', 'v', [t('dataLayerVersion', '2', 'INTEGER'), t('setDefaultValue', 'false', 'BOOLEAN'), t('name', key)])


def custom_event(name, event):
    tid = nid('tr')
    triggers.append({**BASE, 'triggerId': tid, 'name': name, 'type': 'CUSTOM_EVENT', 'fingerprint': '0',
                     'customEventFilter': [{'type': 'EQUALS', 'parameter': [t('arg0', '{{_event}}'), t('arg1', event)]}]})
    return tid


def link_click(name, regex):
    tid = nid('tr')
    triggers.append({**BASE, 'triggerId': tid, 'name': name, 'type': 'LINK_CLICK', 'fingerprint': '0',
                     'filter': [{'type': 'MATCH_REGEX', 'parameter': [t('arg0', '{{Click URL}}'), t('arg1', regex)]}],
                     'waitForTags': {'type': 'BOOLEAN', 'value': 'false'},
                     'checkValidation': {'type': 'BOOLEAN', 'value': 'false'},
                     'waitForTagsTimeout': {'type': 'TEMPLATE', 'value': '2000'},
                     'uniqueTriggerId': {'type': 'TEMPLATE'}})
    return tid


def tag(name, kind, params, trigger_ids, paused=False, needs_ads_consent=False):
    item = {**BASE, 'tagId': nid('tag'), 'name': name, 'type': kind, 'parameter': params,
            'firingTriggerId': trigger_ids, 'tagFiringOption': 'ONCE_PER_EVENT', 'monitoringMetadata': {'type': 'MAP'},
            'consentSettings': {'consentStatus': 'NOT_SET'}, 'fingerprint': '0'}
    if needs_ads_consent:
        item['consentSettings'] = {'consentStatus': 'NEEDED', 'consentType': {'type': 'LIST', 'list': [{'type': 'TEMPLATE', 'value': 'ad_storage'}]}}
    if paused:
        item['paused'] = True
    tags.append(item)


def ga4_event(event, trigger_ids, pairs):
    tag(f'GA4 - {event}', 'gaawe', [t('sendEcommerceData', 'false', 'BOOLEAN'), t('eventName', event),
                                    t('measurementIdOverride', ga4_id), rows(pairs + [('page_type', page_type)])], trigger_ids)


# ---- Variables
ga4_id = variable('Const - GA4 measurement ID', 'c', [t('value', GA4)])
form_name, lead_type, cabin = dlv('form_name'), dlv('lead_type'), dlv('cabin')

# Where a click happened: the nearest wrapper with data-track (header, footer, closing band, booking card...).
cta_location = variable('CJS - cta_location', 'jsm', [t('javascript', """function() {
  var el = {{Click Element}};
  if (!el || !el.closest) return 'other';
  var t = el.closest('[data-track]');
  return t ? t.getAttribute('data-track') : 'page_body';
}""")])

# The cabin a link points at, from its address: /cabins/pickle-hill gives pickle-hill.
cabin_from_url = variable('CJS - cabin from link', 'jsm', [t('javascript', """function() {
  var m = ({{Click URL}} || '').match(/\\/cabins\\/([^\\/?#]+)/);
  return m ? m[1] : undefined;
}""")])

contact_method = variable('CJS - contact method', 'jsm', [t('javascript', """function() {
  return /^tel:/i.test({{Click URL}} || '') ? 'phone' : 'email';
}""")])

# First match wins, so specific addresses come before the catch-all patterns.
PAGE_TYPES = [
    ('^/$', 'home'),
    ('^/cabins$', 'cabins_index'),
    ('^/cabins/.+', 'cabin'),
    ('^/hocking-hills-.+', 'collection'),
    ('^/search$', 'search'),
    ('^/co-hosting$', 'cohosting'),
    ('^/contact$', 'contact'),
    ('^/blog$', 'blog_index'),
    ('^/blog/.+', 'post'),
    ('^/(about|faqs|privacy)$', 'company'),
    ('^/review$', 'review'),
]
page_type = variable('RT - page_type', 'remm', [
    t('input', '{{Page Path}}'), t('fullMatch', 'true', 'BOOLEAN'), t('replaceAllOccurrences', 'false', 'BOOLEAN'),
    t('setDefaultValue', 'true', 'BOOLEAN'), t('defaultValue', 'other'), t('ignoreCase', 'true', 'BOOLEAN'),
    t('enableCaptureGroups', 'false', 'BOOLEAN'),
    {'type': 'LIST', 'key': 'map', 'list': [{'type': 'MAP', 'map': [t('key', k), t('value', v)]} for k, v in PAGE_TYPES]},
])

# ---- Triggers
ce_lead = custom_event('CE - generate_lead', 'generate_lead')
ce_signup = custom_event('CE - newsletter_signup', 'newsletter_signup')
ce_form_start = custom_event('CE - form_start', 'form_start')
# "Check availability" and "Book now": the cabin search, or the booking card on a cabin page
lc_book = link_click('LC - Check availability', SITE + r'/cabins/?([?#].*)?$|#book$')
# A cabin page itself, not its #book jump (that one counts as book_click)
lc_cabin = link_click('LC - Cabin page', SITE + r'/cabins/[^/?#]+/?(\?[^#]*)?$')
lc_cohost = link_click('LC - Co-host with us', SITE + r'/co-hosting([?#].*)?$')
lc_contact = link_click('LC - Call or email', r'^(tel|mailto):')

# ---- Tags
# No Google Tag here: GA4 is linked to the container itself, so the container's own Google tag loads it and sends
# page views. A separate Google Tag for the same ID is flagged by GTM as a "Conflicting Google tag".
# content_group = {{RT - page_type}} is set in the container's Google tag settings instead (docs/tracking/README.md).
ga4_event('generate_lead', [ce_lead], [('form_name', form_name), ('lead_type', lead_type), ('cabin', cabin)])
ga4_event('newsletter_signup', [ce_signup], [('form_name', form_name)])
ga4_event('form_start', [ce_form_start], [('form_name', form_name)])
ga4_event('book_click', [lc_book], [('cta_location', cta_location), ('link_text', '{{Click Text}}'), ('link_url', '{{Click URL}}')])
ga4_event('cabin_click', [lc_cabin], [('cabin', cabin_from_url), ('cta_location', cta_location), ('link_url', '{{Click URL}}')])
ga4_event('cohost_click', [lc_cohost], [('cta_location', cta_location), ('link_text', '{{Click Text}}'), ('link_url', '{{Click URL}}')])
ga4_event('contact_click', [lc_contact], [('contact_method', contact_method), ('cta_location', cta_location)])
tag('Conversion Linker', 'gclidw', [t('enableCrossDomain', 'false', 'BOOLEAN'), t('enableUrlPassthrough', 'false', 'BOOLEAN'),
                                     t('enableCookieOverrides', 'false', 'BOOLEAN')], [ALL_PAGES])

# Google Ads conversion tag. Paused, with placeholders, until an Ads account and its conversion action exist.
ads_id, ads_label = (ADS.replace('AW-', '').split('/') + [''])[:2] if ADS else ('0000000000', 'REPLACE_ME')
tag('Google Ads - Lead', 'awct', [t('enableNewCustomerReporting', 'false', 'BOOLEAN'), t('enableConversionLinker', 'true', 'BOOLEAN'),
                                  t('enableProductReporting', 'false', 'BOOLEAN'), t('conversionId', ads_id),
                                  t('conversionLabel', ads_label), t('rdp', 'false', 'BOOLEAN'), t('enableShippingData', 'false', 'BOOLEAN')],
    [ce_lead], paused=not ADS, needs_ads_consent=True)

container = {
    'exportFormatVersion': 2,
    'exportTime': '2026-11-23 12:00:00',
    'containerVersion': {
        'path': 'accounts/0/containers/0/versions/0', **BASE, 'containerVersionId': '0',
        'container': {'path': 'accounts/0/containers/0', **BASE, 'name': 'happyhocking.com', 'publicId': GTM_ID, 'usageContext': ['WEB']},
        'tag': tags, 'trigger': triggers, 'variable': variables,
        'builtInVariable': [{**BASE, 'type': kind, 'name': name} for kind, name in [
            ('CLICK_ELEMENT', 'Click Element'), ('CLICK_URL', 'Click URL'), ('CLICK_TEXT', 'Click Text'),
            ('PAGE_PATH', 'Page Path'), ('EVENT', 'Event')]],
    },
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(container, indent=2) + '\n')
print(f'{OUT.relative_to(OUT.parent.parent.parent)}: {len(tags)} tags, {len(triggers)} triggers, {len(variables)} variables, {GTM_ID}, GA4 {GA4}')
