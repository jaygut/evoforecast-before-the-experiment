#!/usr/bin/env python3
"""Capture each scene centered, at desktop and mobile, for visual overlap review."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1]
URL = "file://" + str(SITE / "index.html")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = SITE / "qa" / "scenes"
OUT.mkdir(parents=True, exist_ok=True)
SCENES = ["hero","stakes","blindspot","windtunnel","abstain","rejection","challenge","phase","frontier","ladder","genome","ask"]

def shoot(width, height, tag):
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME, headless=True)
        pg = b.new_page(viewport={"width": width, "height": height})
        pg.goto(URL, wait_until="load")
        pg.wait_for_timeout(700)
        for sid in SCENES:
            # scroll so the section's sticky stage is pinned and resolved
            pg.evaluate(f"""() => {{
              const s = document.getElementById('{sid}');
              const y = s.offsetTop + Math.min(s.offsetHeight*0.5, s.offsetHeight - window.innerHeight*0.9);
              window.scrollTo(0, Math.max(0, y));
            }}""")
            pg.wait_for_timeout(450)
            pg.screenshot(path=str(OUT / f"{tag}_{sid}.png"))
        b.close()

shoot(1280, 900, "desk")
shoot(390, 844, "mob")
print("captured", len(SCENES)*2, "scene screenshots to", str(OUT))
