#!/usr/bin/env python3
"""Honest file:// smoke test: launch real Chrome in default mode (fetch on file://
stays CORS-blocked, exactly like a double-click open) and verify the interactive
layer comes alive from window.EVO_DATA alone."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "file://" + str(Path(__file__).resolve().parents[1] / "index.html")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

res = {"console_errors": [], "page_errors": []}
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, headless=True)  # NO file-access override
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: res["console_errors"].append(m.type + ": " + m.text[:200]) if m.type == "error" else None)
    pg.on("pageerror", lambda e: res["page_errors"].append(str(e)[:200]))
    pg.goto(URL, wait_until="load")
    pg.wait_for_timeout(900)
    # scroll through so every lazily-created scene canvas mounts
    height = pg.evaluate("document.body.scrollHeight")
    for y in range(0, int(height), 500):
        pg.evaluate(f"window.scrollTo(0,{y})")
        pg.wait_for_timeout(70)
    pg.evaluate("window.scrollTo(0,0)")
    pg.wait_for_timeout(200)
    res["evo_data_present"] = pg.evaluate("!!(window.EVO_DATA && window.EVO_DATA.facts && window.EVO_DATA.phase)")
    res["canvas_count"] = pg.eval_on_selector_all("canvas", "els=>els.length")
    res["section_count"] = pg.eval_on_selector_all("section.story-scene", "els=>els.length")
    res["load_status"] = pg.eval_on_selector("#load-status", "el=>el.textContent")
    res["html_class"] = pg.eval_on_selector("html", "el=>el.className")
    res["phase_before"] = pg.eval_on_selector("#phase-readout", "el=>el.textContent")
    # interaction: change the information track and confirm the lookup readout changes
    pg.select_option("#phase-model", "P1")
    pg.wait_for_timeout(150)
    res["phase_after_P1"] = pg.eval_on_selector("#phase-readout", "el=>el.textContent")
    # challenge mode button
    pg.eval_on_selector("[data-challenge-mode='adverse']", "el=>el.click()")
    pg.wait_for_timeout(120)
    res["challenge_after_adverse"] = pg.eval_on_selector("#challenge-readout", "el=>el.textContent")
    b.close()

res["verdict"] = (
    "PASS" if (res["evo_data_present"] and res["canvas_count"] >= 10
               and res["section_count"] == 12 and not res["page_errors"]
               and res["phase_after_P1"] != res["phase_before"]) else "FAIL"
)
print(json.dumps(res, indent=2))
sys.exit(0 if res["verdict"] == "PASS" else 1)
