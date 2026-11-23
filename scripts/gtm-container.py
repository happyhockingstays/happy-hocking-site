#!/usr/bin/env python3
"""Writes the Google Tag Manager container for happyhocking.com as an import file: docs/tracking/happyhocking-gtm.json.

    python3 scripts/gtm-container.py GTM-MNB9PCPW G-P9ZPMEE9TJ

Options, once a Google Ads account exists (each conversion action has its own label):
    --ads AW-1234567890 --label-purchase abc --label-begin-checkout def --label-guest ghi --label-cohost jkl
    --linked   leave out the Google Tag, if GA4 is ever linked to the container in GA4's own settings

Import it in GTM: Admin > Import Container > choose the file > Existing workspace > Overwrite, which replaces the
earlier import. Then Preview, test, Submit. Steps and what every tag does: docs/tracking/README.md.
Ported from WentDirect's scripts/gtm-container.py (cole-stark/wentdirect).

One event per kind of conversion (Cole, Nov 23): each has its own trigger and its own GA4 tag.
"""
import argparse
import json
import re
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('gtm_id')
ap.add_argument('ga4_id')
ap.add_argument('--linked', action='store_true')
ap.add_argument('--ads', default='')
for name in ('purchase', 'begin-checkout', 'guest', 'cohost'):
    ap.add_argument(f'--label-{name}', default='')
args = ap.parse_args()
if not re.fullmatch(r'GTM-[A-Z0-9]+', args.gtm_id) or not re.fullmatch(r'G-[A-Z0-9]+', args.ga4_id):
    ap.error('expected GTM-XXXXXXX G-XXXXXXXXXX')
if args.ads and not re.fullmatch(r'AW-\d+', args.ads):
    ap.error('--ads expects AW-1234567890')

OUT = Path(__file__).resolve().parent.parent / 'docs' / 'tracking' / 'happyhocking-gtm.json'
INIT_ALL_PAGES = '2147479573'  # GTM's built-in "Initialization - All Pages"
ALL_PAGES = '2147479553'       # GTM's built-in "All Pages"
BASE = {'accountId': '0', 'containerId': '0'}
SITE = r'^https?://(www\.)?happyhocking\.com'


def t(key, value, kind='TEMPLATE'):
    return {'type': kind, 'key': key, 'value': value}


def table(key, pairs, a='parameter', b='parameterValue'):
    return {'type': 'LIST', 'key': key, 'list': [{'type': 'MAP', 'map': [t(a, x), t(b, y)]} for x, y in pairs]}


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


def jsm(name, code):
    return variable(name, 'jsm', [t('javascript', code)])


def custom_event(event):
    tid = nid('tr')
    triggers.append({**BASE, 'triggerId': tid, 'name': f'CE - {event}', 'type': 'CUSTOM_EVENT', 'fingerprint': '0',
                     'customEventFilter': [{'type': 'EQUALS', 'parameter': [t('arg0', '{{_event}}'), t('arg1', event)]}]})
    return tid


def link_click(name, regex):
    tid = nid('tr')
    triggers.append({**BASE, 'triggerId': tid, 'name': f'LC - {name}', 'type': 'LINK_CLICK', 'fingerprint': '0',
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


def ga4_event(event, trigger_id, pairs=(), ecommerce=False):
    params = [t('eventName', event), t('measurementIdOverride', ga4_id),
              table('eventSettingsTable', list(pairs) + [('page_type', page_type)])]
    if ecommerce:
        # Hospitable sends value, currency and the booking details in the standard GA4 ecommerce object
        params += [t('sendEcommerceData', 'true', 'BOOLEAN'), t('getEcommerceDataFrom', 'dataLayer')]
    else:
        params += [t('sendEcommerceData', 'false', 'BOOLEAN')]
    tag(f'GA4 - {event}', 'gaawe', params, [trigger_id])


def ads_conversion(name, trigger_id, label, value=False):
    params = [t('enableNewCustomerReporting', 'false', 'BOOLEAN'), t('enableConversionLinker', 'true', 'BOOLEAN'),
              t('enableProductReporting', 'false', 'BOOLEAN'), t('conversionId', args.ads.replace('AW-', '') or '0000000000'),
              t('conversionLabel', label or 'REPLACE_ME'), t('rdp', 'false', 'BOOLEAN'), t('enableShippingData', 'false', 'BOOLEAN')]
    if value:
        params += [t('conversionValue', ecom_value), t('currencyCode', ecom_currency), t('orderId', ecom_order)]
    tag(f'Google Ads - {name}', 'awct', params, [trigger_id], paused=not (args.ads and label), needs_ads_consent=True)


# ---- Variables
ga4_id = variable('Const - GA4 measurement ID', 'c', [t('value', args.ga4_id)])
form_name, cabin, signup_location = dlv('form_name'), dlv('cabin'), dlv('signup_location')
ecom_value, ecom_currency, ecom_order = dlv('ecommerce.value'), dlv('ecommerce.currency'), dlv('ecommerce.transaction_id')

# Where a click happened: the nearest wrapper with data-track (header, footer, closing band, booking card...).
cta_location = jsm('CJS - cta_location', """function() {
  var el = {{Click Element}};
  if (!el || !el.closest) return 'other';
  var t = el.closest('[data-track]');
  return t ? t.getAttribute('data-track') : 'page_body';
}""")

# The cabin a link points at, from its address: /cabins/pickle-hill gives pickle-hill.
cabin_from_url = jsm('CJS - cabin from link', """function() {
  var m = ({{Click URL}} || '').match(/\\/cabins\\/([^\\/?#]+)/);
  return m ? m[1] : undefined;
}""")

# Hospitable may load this container inside its booking widget, which is a frame on each cabin page.
# A page view from inside that frame would count the cabin page twice, so the Google tag skips it there.
send_page_view = jsm('CJS - send page view', """function() {
  try { return window.self === window.top; } catch (e) { return false; }
}""")

# Hostname plus path, first match wins. Hospitable's booking pages come first, then this site's pages.
PAGE_TYPES = [
    (r'^[^/]*hospitable\.com/.*', 'booking'),
    (r'^[^/]+/$', 'home'),
    (r'^[^/]+/cabins$', 'cabins_index'),
    (r'^[^/]+/cabins/.+', 'cabin'),
    (r'^[^/]+/hocking-hills-.+', 'collection'),
    (r'^[^/]+/search$', 'search'),
    (r'^[^/]+/co-hosting$', 'cohosting'),
    (r'^[^/]+/contact$', 'contact'),
    (r'^[^/]+/blog$', 'blog_index'),
    (r'^[^/]+/blog/.+', 'post'),
    (r'^[^/]+/(about|faqs|privacy)$', 'company'),
    (r'^[^/]+/review$', 'review'),
]
page_type = variable('RT - page_type', 'remm', [
    t('input', '{{Page Hostname}}{{Page Path}}'), t('fullMatch', 'true', 'BOOLEAN'), t('replaceAllOccurrences', 'false', 'BOOLEAN'),
    t('setDefaultValue', 'true', 'BOOLEAN'), t('defaultValue', 'other'), t('ignoreCase', 'true', 'BOOLEAN'),
    t('enableCaptureGroups', 'false', 'BOOLEAN'),
    table('map', PAGE_TYPES, 'key', 'value'),
])

# ---- Google Tag: loads GA4 and sends page views, with content_group = page type.
# GA4 was not linked to the container when the property was made (Nov 23), so the container needs this tag.
# If GA4 is ever linked to the container, GTM flags it as a "Conflicting Google tag": rerun with --linked.
if not args.linked:
    tag('Google Tag - GA4', 'googtag', [t('tagId', ga4_id), table('configSettingsTable', [
        ('content_group', page_type), ('send_page_view', send_page_view)])], [INIT_ALL_PAGES])

# ---- Conversions from this site's forms: one event, one trigger and one tag each
ce_guest = custom_event('guest_inquiry')
ga4_event('guest_inquiry', ce_guest, [('form_name', form_name), ('cabin', cabin)])
ce_cohost = custom_event('cohost_inquiry')
ga4_event('cohost_inquiry', ce_cohost, [('form_name', form_name)])
ga4_event('newsletter_signup', custom_event('newsletter_signup'), [('form_name', form_name), ('signup_location', signup_location)])
ga4_event('form_start', custom_event('form_start'), [('form_name', form_name)])

# ---- Booking, sent by Hospitable once the GTM ID is in Hospitable (Direct > the site > Marketing).
# Standard GA4 ecommerce event names. begin_checkout is the Reserve click, purchase a finished booking.
ce_booking = {}
for event in ['view_item', 'add_to_cart', 'begin_checkout', 'add_payment_info', 'purchase']:
    ce_booking[event] = custom_event(event)
    ga4_event(event, ce_booking[event], ecommerce=True)

# ---- Clicks on this site, tracked by GTM from data-track wrappers
# "Check availability" and "Book now": the cabin search, or the booking card on a cabin page
ga4_event('book_click', link_click('Check availability', SITE + r'/cabins/?([?#].*)?$|#book$'),
          [('cta_location', cta_location), ('link_text', '{{Click Text}}'), ('link_url', '{{Click URL}}')])
# A cabin page itself, not its #book jump (that one counts as book_click)
ga4_event('cabin_click', link_click('Cabin page', SITE + r'/cabins/[^/?#]+/?(\?[^#]*)?$'),
          [('cabin', cabin_from_url), ('cta_location', cta_location), ('link_url', '{{Click URL}}')])
ga4_event('cohost_click', link_click('Co-host with us', SITE + r'/co-hosting([?#].*)?$'),
          [('cta_location', cta_location), ('link_text', '{{Click Text}}'), ('link_url', '{{Click URL}}')])
ga4_event('phone_click', link_click('Phone', r'^tel:'), [('cta_location', cta_location)])
ga4_event('email_click', link_click('Email', r'^mailto:'), [('cta_location', cta_location)])

tag('Conversion Linker', 'gclidw', [t('enableCrossDomain', 'false', 'BOOLEAN'), t('enableUrlPassthrough', 'false', 'BOOLEAN'),
                                     t('enableCookieOverrides', 'false', 'BOOLEAN')], [ALL_PAGES])

# ---- Google Ads: one conversion tag per conversion action. Paused, with placeholders, until the Ads account
# and its conversion actions exist, then filled in by rerunning with --ads and the labels.
ads_conversion('Booking', ce_booking['purchase'], args.label_purchase, value=True)
ads_conversion('Reserve click', ce_booking['begin_checkout'], args.label_begin_checkout)
ads_conversion('Guest inquiry', ce_guest, args.label_guest)
ads_conversion('Co-host inquiry', ce_cohost, args.label_cohost)

container = {
    'exportFormatVersion': 2,
    'exportTime': '2026-11-23 13:00:00',
    'containerVersion': {
        'path': 'accounts/0/containers/0/versions/0', **BASE, 'containerVersionId': '0',
        'container': {'path': 'accounts/0/containers/0', **BASE, 'name': 'happyhocking.com', 'publicId': args.gtm_id, 'usageContext': ['WEB']},
        'tag': tags, 'trigger': triggers, 'variable': variables,
        'builtInVariable': [{**BASE, 'type': kind, 'name': name} for kind, name in [
            ('CLICK_ELEMENT', 'Click Element'), ('CLICK_URL', 'Click URL'), ('CLICK_TEXT', 'Click Text'),
            ('PAGE_PATH', 'Page Path'), ('PAGE_HOSTNAME', 'Page Hostname'), ('EVENT', 'Event')]],
    },
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(container, indent=2) + '\n')
print(f'{OUT.relative_to(OUT.parent.parent.parent)}: {len(tags)} tags, {len(triggers)} triggers, {len(variables)} variables, '
      f'{args.gtm_id}, GA4 {args.ga4_id}')
