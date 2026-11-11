#!/usr/bin/env python3
"""
Builds the homepage hero video from the cabins' own photos: slow pans and zooms with
crossfades, looping cleanly. Same idea as the Serenity Lodge hero.

This is a one-off tool, not part of the site build. Run it again only to change the shots:
    python3 scripts/make-hero-video.py
Needs Python with Pillow and numpy, plus ffmpeg. Writes to public/video/:
    hero-desktop.mp4 (1280x720) and hero-phone.mp4 (540x960)

If the clients send a real clip, skip this script: export a wide and a tall MP4 (no sound,
about 2 MB and 1.5 MB), save them over these 2 files and keep the names.

Each shot: photo, then a start and end framing for the wide cut and for the tall cut.
A framing is (center x, center y, zoom). x and y run 0 to 1 across the photo. Zoom 1.0 is
the biggest crop that fits. Keep zoom at 1.12 or less so the smaller photos stay sharp.
"""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CABINS = ROOT / 'public/images/cabins'
OUT = ROOT / 'public/video'
FPS = 24  # 24 fps keeps the slow pans smooth and the files small (bandwidth costs Netlify credits)
HOLD = 3.6   # seconds from one shot's start to the next
FADE = 1.0   # seconds of crossfade

SHOTS = [
    # The first shot's opening frame should match the hero photo in content/pages/home.yml.
    ('the-farm-at-nickel-plate/exterior/the-farm-at-nickel-plate-exterior-013.jpg', (0.50, 0.50, 1.00), (0.50, 0.60, 1.12), (0.50, 0.50, 1.00), (0.50, 0.50, 1.10)),
    ('rickenbacker-ridge/pool/rickenbacker-ridge-pool-002.jpg',                     (0.50, 0.55, 1.12), (0.50, 0.50, 1.00), (0.52, 0.50, 1.10), (0.52, 0.50, 1.00)),
    ('pickle-hill/sport-barn/pickle-hill-sport-barn-002.jpg',                       (0.45, 0.50, 1.10), (0.55, 0.50, 1.10), (0.60, 0.50, 1.00), (0.66, 0.50, 1.06)),
    ('loch-llyn/lake/loch-llyn-lake-001.jpg',                                       (0.50, 0.50, 1.00), (0.50, 0.60, 1.10), (0.50, 0.50, 1.00), (0.52, 0.50, 1.06)),
    ('dunkle-creek/exterior/dunkle-creek-exterior-003.jpg',                         (0.50, 0.50, 1.00), (0.56, 0.58, 1.12), (0.60, 0.50, 1.00), (0.62, 0.50, 1.08)),
    ('valhalla-hills/living-room-1/valhalla-hills-living-room-1-001.jpg',           (0.50, 0.50, 1.12), (0.50, 0.50, 1.00), (0.50, 0.50, 1.08), (0.50, 0.50, 1.00)),
    ('clouds-reach/exterior/clouds-reach-exterior-011.jpg',                         (0.50, 0.50, 1.00), (0.50, 0.58, 1.10), (0.47, 0.50, 1.00), (0.47, 0.50, 1.06)),
]

def box(size, target, framing):
    """Crop box (left, top, right, bottom) for a framing, kept inside the photo."""
    w, h = size
    tw, th = target
    cx, cy, zoom = framing
    scale = min(w / tw, h / th) / zoom
    cw, ch = tw * scale, th * scale
    left = min(max(cx * w - cw / 2, 0), w - cw)
    top = min(max(cy * h - ch / 2, 0), h - ch)
    return (left, top, left + cw, top + ch)

def render(name, target, start_i, end_i, crf):
    images = [Image.open(CABINS / s[0]).convert('RGB') for s in SHOTS]
    n = len(SHOTS)
    total = n * HOLD
    frames = round(total * FPS)
    out = OUT / name
    ff = subprocess.Popen(
        ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{target[0]}x{target[1]}', '-r', str(FPS), '-i', '-',
         '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', str(out)],
        stdin=subprocess.PIPE)

    def shot_frame(i, local):
        # local runs 0 to HOLD + FADE: the shot keeps drifting while it fades out
        p = local / (HOLD + FADE)
        a, b = SHOTS[i][start_i], SHOTS[i][end_i]
        framing = tuple(a[k] + (b[k] - a[k]) * p for k in range(3))
        im = images[i].resize(target, Image.LANCZOS, box=box(images[i].size, target, framing))
        return np.asarray(im, dtype=np.float32)

    first = None
    for k in range(frames):
        # Start the file FADE seconds in, so frame 1 is the first shot at full strength.
        t = (FADE + k / FPS) % total
        i = int(t // HOLD)
        local = t - i * HOLD
        frame = shot_frame(i, local)
        if local < FADE:  # fading in over the previous shot (wraps around, so the loop is seamless)
            prev = (i - 1) % n
            alpha = local / FADE
            alpha = alpha * alpha * (3 - 2 * alpha)
            frame = shot_frame(prev, HOLD + local) * (1 - alpha) + frame * alpha
        data = np.clip(frame + 0.5, 0, 255).astype(np.uint8)
        if first is None:
            first = Image.fromarray(data)
        ff.stdin.write(data.tobytes())
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit('ffmpeg failed')
    print(f'{name}: {total:.1f} s, {out.stat().st_size / 1e6:.1f} MB')
    return first

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    render('hero-desktop.mp4', (1280, 720), 1, 2, crf=31)
    render('hero-phone.mp4', (540, 960), 3, 4, crf=30)
