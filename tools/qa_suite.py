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

phase_payload = json.loads((SITE / "data/phase_cells.json").read_text())
portfolio_payload = json.loads((SITE / "data/portfolio.json").read_text())
facts_payload = json.loads((SITE / "data/facts_digest.json").read_text())
v5_rows = phase_payload["cohorts"]["blind_v5"]
claims = {claim["claim_id"]: claim for claim in facts_payload["claims"]}
prospective_rows = [row for row in v5_rows if int(row["information_horizon_days"]) < 90]
indicative_rows = [row for row in v5_rows if float(row["probability_meeting_definition"]) >= 0.5]
cell_48_day_60 = [
    row for row in v5_rows
    if row["model"] == "GP1" and row["population_arms"] == "48"
    and row["information_horizon_days"] == "60"
]


def near(value, expected, tolerance=5e-4):
    return abs(float(value) - expected) <= tolerance

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
       "console_errors": [], "page_errors": [], "static_copy_mismatches": [],
       "numeric_invariants": {
           "runs_5600_of_5600": "5,600/5,600" in claims["EF-002"]["text"],
           "model_ladder_35_contexts": claims["EF-007"]["denominator"] == "35 nuisance contexts",
           "model_ladder_47_5_gain": "47.5%" in claims["EF-007"]["text"],
           "model_ladder_80_coverage": "80%" in claims["EF-007"]["text"],
           "phase_48_day60_is_39_3_68_3": len(cell_48_day_60) == 1
               and near(cell_48_day_60[0]["mean_relative_crps_gain"], 0.3930822711)
               and near(cell_48_day_60[0]["coverage_90"], 0.683),
           "r1_increment_is_0_0": "0.0%" in claims["EF-008"]["text"],
           "prospective_0_of_60": len(prospective_rows) == 60
               and not any(float(row["probability_meeting_definition"]) >= 0.5 for row in prospective_rows),
           "robust_0_of_80": len(v5_rows) == 80
               and not any(float(row["probability_meeting_definition"]) >= 0.8 for row in v5_rows),
           "plans_0_of_120": len(portfolio_payload["cohorts"]["blind_v5"]) == 120
               and not any(row["status"] == "robustly_pareto_optimal"
                           for row in portfolio_payload["cohorts"]["blind_v5"]),
           "sole_indicative_is_day90_52_5": len(indicative_rows) == 1
               and indicative_rows[0]["information_horizon_days"] == "90"
               and near(indicative_rows[0]["probability_meeting_definition"], 0.525, 1e-9),
           "favorable_control_17_0": "17.0%" in claims["EF-009"]["text"],
           "adverse_control_minus_9_2": "-9.2%" in claims["EF-010"]["text"],
       },
       "a11y": {}, "screenshots": [], "verdict": "PASS"}
requests = []


def watch(page, label):
    page.on(
        "console",
        lambda message: res["console_errors"].append(label + ": " + message.text[:240])
        if message.type == "error" else None,
    )
    page.on("pageerror", lambda error: res["page_errors"].append(label + ": " + str(error)[:240]))
    page.on("request", lambda request: requests.append(request.url))

with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    pg = ctx.new_page()
    watch(pg, "desktop")
    pg.goto(URL, wait_until="load")
    pg.wait_for_timeout(700)
    pg.evaluate("document.documentElement.style.scrollBehavior='auto'")

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
    prose = pg.eval_on_selector_all(
        "[data-field='title'],[data-field='body'],aside.caveat,.final-sentence",
        "els=>els.map(el=>el.innerText)",
    )
    for passage in prose:
        if ":" in passage:
            res["voice_violations"].append("mid-sentence colon: " + passage[:80])

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
    config_copy = pg.evaluate(
        "({scenes: window.EVO_CONFIG.scenes.map(s=>({id:s.id,eyebrow:s.eyebrow,title:s.title,body:s.body,proof:s.proof,claim:s.claim,badge:s.badge})),"
        "boundary:window.EVO_CONFIG.boundary,finalSentence:window.EVO_CONFIG.finalSentence,snapshot:window.EVO_CONFIG.snapshot})"
    )

    # ---- screenshots: desktop + mobile ----
    pg.screenshot(path=str(SHOTS / "v2_desktop_hero.png"))
    res["screenshots"].append("v2_desktop_hero.png")
    pg.evaluate("document.getElementById('challenge').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(400)
    pg.screenshot(path=str(SHOTS / "v2_desktop_v5result.png"))
    res["screenshots"].append("v2_desktop_v5result.png")
    pg.evaluate("document.getElementById('rejection').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(400)
    pg.screenshot(path=str(SHOTS / "v2_desktop_rejection.png"))
    res["screenshots"].append("v2_desktop_rejection.png")
    ctx.close()

    # mobile 390
    mctx = b.new_context(viewport={"width": 390, "height": 844})
    mpg = mctx.new_page()
    watch(mpg, "mobile")
    mpg.goto(URL, wait_until="load")
    mpg.wait_for_timeout(700)
    mpg.screenshot(path=str(SHOTS / "v2_mobile_hero.png"))
    res["screenshots"].append("v2_mobile_hero.png")
    res["mobile_body_overflow"] = mpg.evaluate("document.body.scrollWidth <= window.innerWidth + 2")
    mctx.close()

    # reduced motion
    rctx = b.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    rpg = rctx.new_page()
    watch(rpg, "reduced-motion")
    rpg.goto(URL, wait_until="load")
    rpg.wait_for_timeout(600)
    for sid in [scene["id"] for scene in config_copy["scenes"]]:
        rpg.eval_on_selector("#" + sid, "el=>el.scrollIntoView()")
        rpg.wait_for_timeout(60)
    rpg.eval_on_selector("#hero", "el=>el.scrollIntoView()")
    rpg.wait_for_timeout(180)
    rpg.screenshot(path=str(SHOTS / "v2_reduced_motion.png"))
    res["screenshots"].append("v2_reduced_motion.png")
    res["reduced_motion_canvas"] = rpg.eval_on_selector_all("canvas", "els=>els.length")
    hero_canvas = rpg.locator("#visual-hero canvas")
    reduced_before = hero_canvas.evaluate("canvas=>canvas.toDataURL()")
    hero_box = hero_canvas.bounding_box()
    rpg.mouse.move(hero_box["x"] + hero_box["width"] * 0.75, hero_box["y"] + hero_box["height"] * 0.5)
    rpg.mouse.click(hero_box["x"] + hero_box["width"] * 0.75, hero_box["y"] + hero_box["height"] * 0.5)
    rpg.mouse.move(2, 2)
    rpg.wait_for_timeout(180)
    res["reduced_motion_pointer_static"] = reduced_before == hero_canvas.evaluate("canvas=>canvas.toDataURL()")
    rctx.close()

    # no-JavaScript
    jctx = b.new_context(viewport={"width": 1280, "height": 900}, java_script_enabled=False)
    jpg = jctx.new_page()
    watch(jpg, "no-javascript")
    jpg.goto(URL, wait_until="load")
    jpg.wait_for_timeout(300)
    res["nojs_sections"] = jpg.eval_on_selector_all("section.story-scene", "els=>els.length")
    res["nojs_noscript_visible"] = jpg.eval_on_selector_all("noscript", "els=>els.length") >= 1
    static_copy = jpg.evaluate(
        "Array.from(document.querySelectorAll('section.story-scene')).map(section=>{const out={id:section.id};"
        "['eyebrow','title','body','proof','claim','badge'].forEach(key=>{const node=section.querySelector('[data-field=\"'+key+'\"]');out[key]=node?node.textContent.trim():null});return out})"
    )
    expected_by_id = {scene["id"]: scene for scene in config_copy["scenes"]}
    for scene in static_copy:
        expected = expected_by_id.get(scene["id"])
        if not expected:
            res["static_copy_mismatches"].append(scene["id"] + ": missing from config")
            continue
        for field in ("eyebrow", "title", "body", "proof", "claim", "badge"):
            if scene[field] != expected[field]:
                res["static_copy_mismatches"].append(scene["id"] + "." + field)
    if jpg.locator("#claim-boundary-text").inner_text().strip() != config_copy["boundary"]:
        res["static_copy_mismatches"].append("claim boundary")
    if jpg.locator("#final-sentence").inner_text().strip() != config_copy["finalSentence"]:
        res["static_copy_mismatches"].append("final sentence")
    if jpg.locator("#snapshot-date").inner_text().strip() != config_copy["snapshot"]:
        res["static_copy_mismatches"].append("snapshot")
    jpg.screenshot(path=str(SHOTS / "v2_no_javascript.png"))
    res["screenshots"].append("v2_no_javascript.png")
    jctx.close()
    b.close()

problems = (res["voice_violations"] or res["banned_char_hits"] or res["remote_requests"]
            or res["console_errors"] or res["page_errors"] or res["static_copy_mismatches"]
            or not all(res["numeric_invariants"].values())
            or res["a11y"]["h1_count"] != 1 or not res["a11y"]["skip_link"]
            or res["a11y"]["unlabeled_controls"] != 0 or not res["a11y"]["canvases_aria_hidden"]
            or not res.get("mobile_body_overflow") or res["nojs_sections"] != 12
            or res.get("reduced_motion_canvas") != 12 or not res.get("reduced_motion_pointer_static"))
res["verdict"] = "FAIL" if problems else "PASS"
print(json.dumps(res, indent=2))
(SITE / "qa" / "qa_suite_v2.json").write_text(
    json.dumps(res, indent=2) + "\n", encoding="utf-8"
)
sys.exit(0 if res["verdict"] == "PASS" else 1)
