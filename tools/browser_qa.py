#!/usr/bin/env python3
"""Browser smoke, interaction, responsive, reduced-motion, and no-JS checks."""

from __future__ import annotations

import json
from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
URL = "http://127.0.0.1:8877/"
SCENES = [
    "hero",
    "stakes",
    "blindspot",
    "windtunnel",
    "abstain",
    "rejection",
    "challenge",
    "phase",
    "frontier",
    "ladder",
    "genome",
    "ask",
]


def check_page(page, label: str, screenshot: str) -> dict:
    console_errors = []
    page_errors = []
    remote = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on("request", lambda req: remote.append(req.url) if not req.url.startswith("http://127.0.0.1:8877/") else None)
    page.goto(URL, wait_until="networkidle")
    page.wait_for_function("document.getElementById('load-status').textContent.indexOf('Evidence loaded') === 0")
    scene_results = []
    for index, scene in enumerate(SCENES):
        page.locator("#" + scene).scroll_into_view_if_needed()
        page.wait_for_timeout(100)
        box = page.locator("#" + scene).bounding_box()
        scene_results.append({"id": scene, "box": box, "canvas": page.locator("#visual-" + scene + " canvas").count()})
    for scene in reversed(SCENES):
        page.locator("#" + scene).scroll_into_view_if_needed()
        page.wait_for_timeout(30)
    page.set_viewport_size({"width": 860, "height": 760})
    page.set_viewport_size({"width": 1440 if label == "desktop" else 390, "height": 900 if label == "desktop" else 844})
    page.locator("#phase").scroll_into_view_if_needed()
    page.select_option("#phase-cohort", "blind_v3")
    page.select_option("#phase-model", "G1")
    page.locator("#phase-arms").fill("1")
    page.locator("#phase-horizon").fill("2")
    phase_text = page.locator("#phase-readout").inner_text()
    page.locator("#frontier").scroll_into_view_if_needed()
    page.select_option("#frontier-package", "deep_phenome")
    frontier_text = page.locator("#frontier-readout").inner_text()
    page.locator("#challenge").scroll_into_view_if_needed()
    page.locator("[data-challenge-mode='adverse']").click()
    adverse_text = page.locator("#challenge-readout").inner_text()
    page.locator("#hero").scroll_into_view_if_needed()
    page.screenshot(path=str(ROOT / "qa/screenshots" / screenshot), full_page=True)
    if label == "desktop":
        page.evaluate("document.documentElement.style.scrollBehavior='auto'")
        for scene in ("hero", "phase", "frontier", "challenge", "genome", "ask"):
            page.evaluate("id => { const e=document.getElementById(id); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.65); }", scene)
            page.wait_for_timeout(120)
            page.locator("#" + scene + " .copy-card").evaluate("e => e.scrollTop = 0")
            page.screenshot(path=str(ROOT / "qa/screenshots" / ("desktop_" + scene + ".png")), full_page=False)
    if label == "mobile":
        page.evaluate("document.documentElement.style.scrollBehavior='auto'")
        for scene in ("hero", "phase", "ask"):
            page.evaluate("id => { const e=document.getElementById(id); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.55); }", scene)
            page.wait_for_timeout(120)
            page.locator("#" + scene + " .copy-card").evaluate("e => e.scrollTop = 0")
            page.screenshot(path=str(ROOT / "qa/screenshots" / ("mobile_" + scene + ".png")), full_page=False)
    overflow = page.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth")
    fonts = page.evaluate("({sans: document.fonts.check('16px IBM Plex Sans'), mono: document.fonts.check('12px IBM Plex Mono'), status: document.fonts.status})")
    semantics = page.evaluate("({main: document.querySelectorAll('main').length, h1: document.querySelectorAll('h1').length, sections: document.querySelectorAll('main section').length, skip: !!document.querySelector('.skip-link'), boundary: !!document.querySelector('.claim-boundary'), live: document.querySelectorAll('[aria-live]').length, sourcePills: document.querySelectorAll('.source-pill').length, caveats: document.querySelectorAll('.caveat').length})")
    return {"label": label, "console_errors": console_errors, "page_errors": page_errors, "remote_requests": remote, "scenes": scene_results, "phase_readout": phase_text, "frontier_readout": frontier_text, "adverse_readout": adverse_text, "horizontal_overflow_px": overflow, "fonts": fonts, "semantics": semantics}


def main() -> None:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        desktop = browser.new_page(viewport={"width": 1440, "height": 900}, color_scheme="dark")
        results = [check_page(desktop, "desktop", "desktop_full.png")]
        mobile = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, color_scheme="dark")
        results.append(check_page(mobile, "mobile", "mobile_full.png"))
        reduced = browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce", color_scheme="dark")
        reduced.goto(URL, wait_until="networkidle")
        reduced.wait_for_function("document.getElementById('load-status').textContent.indexOf('Evidence loaded') === 0")
        reduced.screenshot(path=str(ROOT / "qa/screenshots/reduced_motion.png"), full_page=True)
        results.append({"label": "reduced_motion", "scene_height": reduced.locator("#hero").evaluate("e => getComputedStyle(e).height"), "scroll_behavior": reduced.evaluate("getComputedStyle(document.documentElement).scrollBehavior")})
        nojs_context = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
        nojs = nojs_context.new_page()
        nojs.goto(URL, wait_until="load")
        nojs.screenshot(path=str(ROOT / "qa/screenshots/no_javascript.png"), full_page=True)
        results.append({"label": "no_javascript", "scene_titles": nojs.locator("main h1, main h2").count(), "noscript_visible": nojs.locator(".noscript-note").is_visible(), "boundary_visible": nojs.locator(".claim-boundary").is_visible(), "source_pills": nojs.locator(".source-pill").count()})
        nojs_context.close()
        browser.close()

    (ROOT / "qa/browser_results.json").write_text(json.dumps(results, indent=2, sort_keys=True) + "\n")
    failures = []
    for result in results[:2]:
        if result["console_errors"]: failures.append(result["label"] + ": console errors")
        if result["page_errors"]: failures.append(result["label"] + ": page errors")
        if result["remote_requests"]: failures.append(result["label"] + ": remote requests")
        if result["horizontal_overflow_px"] > 1: failures.append(result["label"] + ": horizontal overflow")
        if not all(item["canvas"] == 1 for item in result["scenes"]): failures.append(result["label"] + ": missing scene canvas")
        if result["fonts"] != {"sans": True, "mono": True, "status": "loaded"}: failures.append(result["label"] + ": font load")
        if result["semantics"] != {"main": 1, "h1": 1, "sections": 12, "skip": True, "boundary": True, "live": 5, "sourcePills": 12, "caveats": 12}:
            failures.append(result["label"] + ": semantic inventory mismatch " + repr(result["semantics"]))
    if results[-1]["scene_titles"] != 12 or not results[-1]["noscript_visible"] or results[-1]["source_pills"] != 12:
        failures.append("no-JS reading order")
    if failures:
        raise SystemExit("QA FAIL: " + "; ".join(failures))
    print("browser QA passed")


if __name__ == "__main__":
    main()
