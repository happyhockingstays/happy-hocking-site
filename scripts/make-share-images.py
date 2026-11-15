#!/usr/bin/env python3
"""
Makes the share images: the picture that shows when a page's link is texted or posted.
One 1200 x 630 card per page, in the same design as the site card: the page's own photo with
a cream card holding the logo, a headline and one short line.

This is a one-off tool, not part of the site build. Run it after adding a page or a post, or
after changing a cabin's main photo, a post's cover or a headline:
    python3 scripts/make-share-images.py            # only the cards that are missing
    python3 scripts/make-share-images.py --all      # redo every card
    python3 scripts/make-share-images.py blog-ash-cave cabins-pickle-hill   # just these
Needs Python with playwright and pyyaml, plus Google Chrome.

Cards are written to public/images/share/<page>.jpg, named for the page's web address:
/cabins/pickle-hill is cabins-pickle-hill.jpg and the homepage is home.jpg. The site finds them
by name (src/lib/seo.ts). A page without a card falls back to its own photo, so nothing breaks
if this isn't run.
"""
import html, sys, tempfile
from pathlib import Path
import yaml
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
OUT = PUBLIC / 'images/share'
FONTS = ROOT / 'node_modules'
CAPRASIMO = FONTS / '@fontsource/caprasimo/files/caprasimo-latin-400-normal.woff2'
MONTSERRAT = FONTS / '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2'
WORDMARK = PUBLIC / 'images/brand/wordmark.svg'
FEES = 'Skip the booking-site fees'


def read(path):
    return yaml.safe_load((ROOT / path).read_text()) or {}


def post_meta(path):
    raw = path.read_text()
    return yaml.safe_load(raw.split('---', 2)[1]) or {}


def cards():
    """Every page that gets a card: (name, photo, headline, small line)."""
    out = []
    home = read('content/pages/home.yml')
    cohost = read('content/pages/co-hosting.yml')
    about = read('content/pages/about.yml')
    cabins = sorted((read(f'content/cabins/{f.name}') | {'slug': f.stem} for f in (ROOT / 'content/cabins').glob('*.yml')), key=lambda c: c.get('order', 99))
    cabins = [c for c in cabins if not c.get('hidden')]
    by_slug = {c['slug']: c for c in cabins}

    out.append(('home', (home.get('hero') or {}).get('image'), 'A place for everyone in the Hocking Hills', FEES))
    out.append(('cabins', by_slug['lazy-deer-retreat']['heroImage'] if 'lazy-deer-retreat' in by_slug else cabins[0]['heroImage'], 'Hocking Hills cabin rentals', FEES))
    out.append(('co-hosting', (cohost.get('hero') or {}).get('image'), 'Happy homes start with great hosts', 'Hocking Hills co-hosting'))
    out.append(('about', (about.get('hero') or {}).get('image') or (home.get('story') or {}).get('image'), 'Happy guests, happy homes', 'Meet your hosts'))
    out.append(('faqs', '/images/cabins/clouds-reach/exterior/clouds-reach-exterior-011.jpg', 'Happy to help', 'Hocking Hills cabin FAQs'))
    out.append(('contact', '/images/cabins/the-johnny/backyard-fire-pit/the-johnny-backyard-fire-pit-008.jpg', 'Happy to help', 'Call, text or send us a note'))
    out.append(('blog', '/images/cabins/dunkle-creek/exterior/dunkle-creek-exterior-006.jpg', 'Hocking Hills guides and trip ideas', 'From your hosts at Happy Hocking Stays'))
    for c in cabins:
        out.append((f"cabins-{c['slug']}", c.get('heroImage'), c['name'], f"{c['tagline']} · Sleeps {c['sleeps']}"))
    for f in sorted((ROOT / 'content/collections').glob('*.yml')):
        d = read(f'content/collections/{f.name}')
        out.append((f.stem, d.get('image'), d['title'], FEES))
    for f in sorted((ROOT / 'content/blog').glob('*.md')):
        d = post_meta(f)
        out.append((f'blog-{f.stem}', d.get('cover'), d['title'], d.get('category') or 'Hocking Hills guide'))
    return [c for c in out if c[1] and (PUBLIC / c[1].lstrip('/')).exists()]


def page_html(photo, headline, line):
    # Longer headlines (post titles) get a wider card, smaller type and a smaller logo
    long = len(headline) > 34
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face {{ font-family: Caprasimo; src: url('{CAPRASIMO.as_uri()}') format('woff2'); }}
@font-face {{ font-family: Montserrat; font-weight: 100 900; src: url('{MONTSERRAT.as_uri()}') format('woff2'); }}
* {{ margin: 0; box-sizing: border-box; }}
body {{ width: 1200px; height: 630px; overflow: hidden; background: #1F3D2E; }}
.photo {{ position: absolute; inset: 0; width: 1200px; height: 630px; object-fit: cover; }}
.card {{ position: absolute; left: 58px; bottom: 58px; width: {'600px' if long else '518px'}; padding: {'30px 38px 32px' if long else '32px 38px 36px'};
  background: #F9F3E7; border: 2px solid #1F3D2E; border-radius: 22px; box-shadow: 10px 10px 0 #E0A23A; }}
.logo {{ display: block; height: {'92px' if long else '128px'}; width: auto; margin-left: -4px; }}
h1 {{ font: 400 {'36px' if long else '38px'}/1.16 Caprasimo, Georgia, serif; color: #1F3D2E; margin-top: {'14px' if long else '10px'}; text-wrap: balance; }}
p {{ font: 700 19px/1.3 Montserrat, sans-serif; color: #A8452A; margin-top: 14px; }}
</style>
<img class="photo" src="{(PUBLIC / photo.lstrip('/')).as_uri()}">
<div class="card"><img class="logo" src="{WORDMARK.as_uri()}"><h1>{html.escape(headline)}</h1><p>{html.escape(line)}</p></div>"""


def main():
    args = sys.argv[1:]
    redo = '--all' in args
    only = [a for a in args if not a.startswith('--')]
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [c for c in cards() if (c[0] in only if only else redo or not (OUT / f'{c[0]}.jpg').exists())]
    if not todo:
        print('Every page already has a share image. Use --all to redo them.')
        return
    with sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
        browser = p.chromium.launch(channel='chrome', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
        for name, photo, headline, line in todo:
            f = Path(tmp) / 'card.html'
            f.write_text(page_html(photo, headline, line))
            page.goto(f.as_uri())
            page.evaluate('document.fonts.ready')
            page.wait_for_function("document.querySelector('.photo').complete && document.querySelector('.logo').complete")
            page.screenshot(path=str(OUT / f'{name}.jpg'), type='jpeg', quality=84)
            print(f'  {name}.jpg  {headline}')
        browser.close()
    print(f'{len(todo)} share image(s) written to public/images/share')


if __name__ == '__main__':
    main()
