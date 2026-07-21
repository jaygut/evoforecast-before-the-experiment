#!/usr/bin/env python3
"""EvoForecast successor QA battery (real Chrome, file://).

Covers: voice lint on rendered text, offline network-zero assertion, multi-viewport
+ reduced-motion + no-JavaScript screenshots, and accessibility basics."""
import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1]
URL = "file://" + str(SITE / "index.html")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SHOTS = SITE / "qa" / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)

BANNED_CHARS = {"em-dash": "—", "en-dash": "–"}
BANNED_PHRASES = [
    "which is the point", "the honest answer is not yet", "at its core", "at the heart of",
    "it's important to note", "it is worth noting", "game-chang", "cutting-edge", "state-of-the-art",
    "seamless", "leverage the", "delve into", "dive into", "deep dive", "tapestry", "paradigm shift",
    "unlock the", "unleash", "harness the power", "beautiful trajectory", "must be able to say no",
    "the decision before the decision", "independently governed", "ownership are named", "empower",
    "AI predicts nature", "ai-powered", "powered by ai", "supercharge", "testament to",
]
# "not X but Y" style negation-correction, and mid-sentence rhetorical colon
NEG_CORR = re.compile(r"\bnot only\b|\bnot just\b|\bnot [^.,;]{1,40}\bbut\b", re.I)
REMOTE = re.compile(r"^https?://", re.I)

res = {"voice_violations": [], "banned_char_hits": [], "remote_requests": [],
       "a11y": {}, "screenshots": [], "verdict": "PASS"}
requests = []

with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    pg = ctx.new_page()
    pg.on("request", lambda r: requests.append(r.url))
    pg.goto(URL, wait_until="load")
    pg.wait_for_timeout(700)

    # ---- rendered-text voice lint (visible prose only) ----
    text = pg.eval_on_selector("main", "el=>el.innerText")
    for name, ch in BANNED_CHARS.items():
        if ch in text:
            ctx_snip = [ln for ln in text.splitlines() if ch in ln][:3]
            res["banned_char_hits"].append({name: ctx_snip})
    low = text.lower()
    for ph in BANNED_PHRASES:
        if ph in low:
            res["voice_violations"].append("phrase: " + ph)
    for m in NEG_CORR.finditer(text):
        res["voice_violations"].append("neg-correction: " + m.group(0)[:60])
    # semicolons in visible prose (evidence/eyebrow proof lines use middot, not ;)
    if ";" in text:
        res["voice_violations"].append("semicolon in visible prose")

    # ---- offline network assertion ----
    res["remote_requests"] = [u for u in requests if REMOTE.match(u)]

    # ---- accessibility basics ----
    res["a11y"]["h1_count"] = pg.eval_on_selector_all("h1", "els=>els.length")
    res["a11y"]["skip_link"] = pg.eval_on_selector_all("a.skip-link", "els=>els.length") == 1
    res["a11y"]["unlabeled_controls"] = pg.evaluate(
        "Array.from(document.querySelectorAll('select,input,button')).filter(el=>!el.closest('label')&&!el.getAttribute('aria-label')&&!el.textContent.trim()).length"
    )
    res["a11y"]["canvases_aria_hidden"] = pg.evaluate(
        "Array.from(document.querySelectorAll('canvas')).every(c=>c.getAttribute('aria-hidden')==='true')"
    )
    res["a11y"]["headings_order"] = pg.eval_on_selector_all("h1,h2", "els=>els.map(e=>e.tagName)")

    # ---- screenshots: desktop + mobile ----
    pg.screenshot(path=str(SHOTS / "v2_desktop_hero.png"))
    res["screenshots"].append("v2_desktop_hero.png")
    pg.evaluate("document.getElementById('challenge').scrollIntoView()")
    pg.wait_for_timeout(400)
    pg.screenshot(path=str(SHOTS / "v2_desktop_v5result.png"))
    res["screenshots"].append("v2_desktop_v5result.png")
    pg.evaluate("document.getElementById('rejection').scrollIntoView()")
    pg.wait_for_timeout(400)
    pg.screenshot(path=str(SHOTS / "v2_desktop_rejection.png"))
    res["screenshots"].append("v2_desktop_rejection.png")
    ctx.close()

    # mobile 390
    mctx = b.new_context(viewport={"width": 390, "height": 844})
    mpg = mctx.new_page()
    mpg.goto(URL, wait_until="load")
    mpg.wait_for_timeout(700)
    mpg.screenshot(path=str(SHOTS / "v2_mobile_hero.png"))
    res["screenshots"].append("v2_mobile_hero.png")
    res["mobile_body_overflow"] = mpg.evaluate("document.body.scrollWidth <= window.innerWidth + 2")
    mctx.close()

    # reduced motion
    rctx = b.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    rpg = rctx.new_page()
    rpg.goto(URL, wait_until="load")
    rpg.wait_for_timeout(600)
    rpg.screenshot(path=str(SHOTS / "v2_reduced_motion.png"))
    res["screenshots"].append("v2_reduced_motion.png")
    res["reduced_motion_canvas"] = rpg.eval_on_selector_all("canvas", "els=>els.length")
    rctx.close()

    # no-JavaScript
    jctx = b.new_context(viewport={"width": 1280, "height": 900}, java_script_enabled=False)
    jpg = jctx.new_page()
    jpg.goto(URL, wait_until="load")
    jpg.wait_for_timeout(300)
    res["nojs_sections"] = jpg.eval_on_selector_all("section.story-scene", "els=>els.length")
    res["nojs_noscript_visible"] = jpg.eval_on_selector_all("noscript", "els=>els.length") >= 1
    jpg.screenshot(path=str(SHOTS / "v2_no_javascript.png"))
    res["screenshots"].append("v2_no_javascript.png")
    jctx.close()
    b.close()

problems = (res["voice_violations"] or res["banned_char_hits"] or res["remote_requests"]
            or res["a11y"]["h1_count"] != 1 or not res["a11y"]["skip_link"]
            or res["a11y"]["unlabeled_controls"] != 0 or not res["a11y"]["canvases_aria_hidden"]
            or not res.get("mobile_body_overflow") or res["nojs_sections"] != 12)
res["verdict"] = "FAIL" if problems else "PASS"
print(json.dumps(res, indent=2))
sys.exit(0 if res["verdict"] == "PASS" else 1)
