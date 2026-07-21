#!/usr/bin/env python3
"""Exercise and capture every scene in real Chrome at all release widths.

For each figure this gate moves across every discrete interactive hotspot,
verifies that a hover redraw occurs, clicks the same target, moves away, and
verifies that the disclosure remains pinned. It also exercises every DOM control,
fails on browser errors, and records card/canvas layout evidence for visual review.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


SITE = Path(__file__).resolve().parents[1]
URL = "file://" + str(SITE / "index.html")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = SITE / "qa" / "scenes"
REPORT = SITE / "qa" / "scene_interaction_results.json"
OUT.mkdir(parents=True, exist_ok=True)
SCENES = [
    "hero", "stakes", "blindspot", "windtunnel", "abstain", "rejection",
    "challenge", "phase", "frontier", "ladder", "genome", "ask",
]
VIEWPORTS = [
    (1280, 900, "desk1280"),
    (1920, 1080, "wide1920"),
    (390, 844, "mobile390"),
]
CANVAS_HASH = """canvas => {
  const value = canvas.toDataURL('image/png');
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16) + ':' + value.length;
}"""


def clamp(value, low, high):
    return max(low, min(high, value))


def fade(value, low, high):
    value = clamp((value - low) / (high - low), 0, 1)
    return value * value * (3 - 2 * value)


def scroll_to_scene(page, scene_id, width):
    page.evaluate(
        """({sceneId, mobile}) => {
          const section = document.getElementById(sceneId);
          const runway = Math.max(0, section.offsetHeight - window.innerHeight * 0.9);
          const y = mobile ? section.offsetTop : section.offsetTop + Math.min(section.offsetHeight * 0.5, runway);
          window.scrollTo(0, Math.max(0, y));
        }""",
        {"sceneId": scene_id, "mobile": width <= 680},
    )
    page.wait_for_timeout(180)


def relative_card_band(page, scene_id, canvas_box):
    card = page.locator("#" + scene_id + " .copy-card").bounding_box()
    return {
        "left": clamp(card["x"] - canvas_box["x"], 0, canvas_box["width"]),
        "right": clamp(card["x"] + card["width"] - canvas_box["x"], 0, canvas_box["width"]),
        "top": clamp(card["y"] - canvas_box["y"], 0, canvas_box["height"]),
        "bottom": clamp(card["y"] + card["height"] - canvas_box["y"], 0, canvas_box["height"]),
        "box": card,
    }


def free_side(width, band, left_pad, right_pad, choose_wider=False):
    if width <= 800:
        return left_pad, width - right_pad
    if choose_wider and width - band["right"] < band["left"]:
        return left_pad, band["left"] - right_pad
    return band["right"] + left_pad, width - right_pad


def targets_for(page, scene_id, width, height, band):
    """Return exact canvas-local points matching each painter's hit geometry."""
    compact = height < 650
    if scene_id == "hero":
        if width > 800:
            if width - band["right"] >= band["left"]:
                x0, x1 = band["right"] + 28, width - 28
            else:
                x0, x1 = 28, band["left"] - 28
        else:
            x0, x1 = 24, width - 24
        if x1 - x0 < 200:
            x0, x1 = 24, width - 24
        y0, y1 = 136, height - 56
        scale = clamp(min((x1 - x0) / 12.0, (y1 - y0) / 8.4), 14, 46)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        node_units = [(0, 0), (-4.4, -1.8), (4.4, -1.2), (0.6, 3.4)]
        return [(cx + nx * scale, cy + (ny - 0.8) * scale) for nx, ny in node_units]

    if scene_id == "stakes":
        x0, x1 = free_side(width, band, 40, 40)
        if x1 - x0 < 250:
            x0, x1 = 28, width - 28
        cx, cy = (x0 + x1) / 2, height * (0.46 if compact else 0.43)
        radius = min((x1 - x0) * 0.34, height * 0.24)
        return [(cx, cy)] + [
            (cx + math.cos(-math.pi / 2 + i * math.pi * 2 / 7) * radius,
             cy + math.sin(-math.pi / 2 + i * math.pi * 2 / 7) * radius)
            for i in range(7)
        ]

    if scene_id == "blindspot":
        left, right = 46, band["left"] - 34 if width > 800 else width - 44
        if right - left < 260:
            left, right = 30, width - 24
        top, row_h, gap = (142, 56, 22) if compact else (150, 62, 40)
        return [((left + right) / 2, top + i * (row_h + gap) + row_h / 2) for i in range(3)]

    if scene_id == "windtunnel":
        x0 = band["right"] + 30 if width > 800 else 30
        x1 = width - 34
        if x1 - x0 < 280:
            x0, x1 = 24, width - 24
        available = x1 - x0
        grid_width = min(available, 1020)
        x0 += (available - grid_width) / 2
        gap, box_h = 9, 44 if compact else 56
        top, row_gap = (118, 22) if compact else (132, 56)
        box_w = max(96, (grid_width - gap * 2) / 3)
        return [
            (x0 + (i % 3) * (box_w + gap) + box_w / 2,
             top + (i // 3) * (box_h + row_gap) + box_h / 2)
            for i in range(9)
        ]

    if scene_id == "abstain":
        x0, x1 = free_side(width, band, 30 if width > 800 else 40, 40)
        if x1 - x0 < 260:
            x0, x1 = 30, width - 24
        cx, cy = (x0 + x1) / 2, height * 0.46
        radius = min((x1 - x0) * 0.38, height * 0.26)
        return [
            (cx + math.cos(-2.45) * radius, cy + math.sin(-2.45) * radius),
            (cx + math.cos(-0.55) * radius, cy + math.sin(-0.55) * radius),
        ]

    if scene_id == "rejection":
        if width > 800 and (band["left"] + band["right"]) / 2 > width * 0.5:
            x0, x1 = 48, band["left"] - 34
        elif width > 800:
            x0, x1 = band["right"] + 34, width - 44
        else:
            x0, x1 = 48, width - 44
        top = 112 if compact else height * 0.18
        return [(x0 + 24, top + i * 51 + 19) for i in range(4)]

    if scene_id == "challenge":
        x0, x1 = (band["right"] + 64 if width > 800 else 54), width - 56
        if x1 - x0 < 250:
            x0, x1 = 28, width - 28
        count = page.evaluate("window.EVO_DATA.timeline.events.length")
        denominator = max(1, count - 1)
        y = height * 0.31
        return [(x0 + i * (x1 - x0) / denominator, y) for i in range(count)]

    if scene_id == "phase":
        left = band["right"] + 28 if width > 800 else 36
        right = width - 40
        if right - left < 280:
            left, right = 36, width - 20
        top, view_h = 118, 52
        row_top = top + view_h + 22
        points = [((left + right) / 2, row_top + i * 52 + 18) for i in range(3)]
        plane_top, plane_bottom = row_top + 168, height - 68
        if plane_bottom - plane_top > 150:
            row = page.evaluate(
                "window.EVO_DATA.phase.cohorts.blind_v5.find(r=>r.model==='GP1'&&r.population_arms==='16'&&r.information_horizon_days==='60')"
            )
            plot_left, plot_right = left + 46, right - 12
            gain = clamp(float(row["mean_relative_crps_gain"]), -0.25, 0.65)
            coverage = clamp(float(row["coverage_90"]), 0, 1)
            points.append((plot_left + (gain + 0.25) / 0.9 * (plot_right - plot_left),
                           plane_bottom - coverage * (plane_bottom - plane_top)))
        return points

    if scene_id == "frontier":
        left, right = 46, band["left"] - 28 if width > 800 else width - 40
        if right - left < 280:
            left, right = 30, width - 20
        plot_left, plot_right = left + 48, right - 12
        plot_top, plot_bottom = 182, height - 78
        rows = page.evaluate(
            "window.EVO_DATA.portfolio.cohorts.blind_v5.filter(r=>r.measurement_package==='genome_plus_phenome'&&r.information_horizon_days==='60')"
        )
        points = []
        for row in rows:
            x = plot_left + (clamp(float(row["normalized_resource_units"]), 1.6, 8.8) - 1.6) / 7.2 * (plot_right - plot_left)
            y = plot_bottom - (clamp(float(row["forecast_utility"]), -0.11, 0.055) + 0.11) / 0.165 * (plot_bottom - plot_top)
            points.append((x, y))
        return points

    if scene_id == "ladder":
        x0, right = 46, band["left"] - 34 if width > 800 else width - 44
        if right - x0 < 260:
            x0, right = 30, width - 24
        top, row_h, gap = (112, 56, 8) if compact else (156, 62, 22)
        max_width = max(190, right - x0 - 78)
        return [(x0 + i * 26 + (max_width - i * 6) / 2,
                 top + (3 - i) * (row_h + gap) + row_h / 2) for i in range(4)]

    if scene_id == "genome":
        figure_x = band["right"] + 40 if width > 800 else 30
        figure_right = width - 44
        figure_width = max(220, figure_right - figure_x)
        figure_width = min(1000, figure_width)
        column_gap = min(66, figure_width * 0.10)
        chromosome_width = (figure_width - column_gap) * 0.44
        layer_x = figure_x + chromosome_width + column_gap
        layer_width = figure_width - chromosome_width - column_gap
        top, step, layer_h = (140, 42, 34) if compact else (140, 54, 42)
        return [(layer_x + layer_width / 2, top + i * step + layer_h / 2) for i in range(5)]

    if scene_id == "ask":
        if width > 800:
            if width - band["right"] >= band["left"]:
                x0, x1 = band["right"] + 34, width - 40
            else:
                x0, x1 = 40, band["left"] - 34
        else:
            x0, x1 = 30, width - 30
        if x1 - x0 < 240:
            x0, x1 = 30, width - 30
        item_width = min(x1 - x0, 520)
        item_x = x0 + (x1 - x0 - item_width) / 2
        top, item_h, gap = (132, 72, 12) if compact else (150, 62, 20)
        return [(item_x + item_width / 2, top + i * (item_h + gap) + item_h / 2) for i in range(3)]

    raise AssertionError("no interaction target for " + scene_id)


def exercise_controls(page):
    checks = {}
    challenge_readouts = set()
    for mode in ("positive", "blind", "adverse"):
        selector = "[data-challenge-mode='" + mode + "']"
        page.eval_on_selector(selector, "el=>el.click()")
        page.wait_for_timeout(35)
        if page.locator(selector).get_attribute("aria-pressed") != "true":
            raise AssertionError("challenge button did not expose pressed state: " + mode)
        challenge_readouts.add(page.locator("#challenge-readout").inner_text())
    checks["challenge_buttons"] = len(challenge_readouts) == 3
    checks["challenge_button_cases"] = 3

    phase_ok = True
    phase_cases = 0
    for selector, event_name in (("#phase-cohort", "change"), ("#phase-model", "change")):
        values = page.locator(selector + " option").evaluate_all("els=>els.map(el=>el.value)")
        readouts = set()
        for value in values:
            page.eval_on_selector(
                selector,
                "(el,value)=>{el.value=value;el.dispatchEvent(new Event('" + event_name + "',{bubbles:true}))}",
                value,
            )
            page.wait_for_timeout(25)
            readouts.add(page.locator("#phase-readout").inner_text())
            phase_cases += 1
        phase_ok = phase_ok and len(readouts) == len(values)
    for selector in ("#phase-arms", "#phase-horizon"):
        slider = page.locator(selector)
        values = range(int(slider.get_attribute("min")), int(slider.get_attribute("max")) + 1)
        readouts = set()
        for value in values:
            page.eval_on_selector(
                selector,
                "(el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}))}",
                value,
            )
            page.wait_for_timeout(25)
            readouts.add(page.locator("#phase-readout").inner_text())
            phase_cases += 1
        phase_ok = phase_ok and len(readouts) == len(values)
    checks["phase_controls"] = phase_ok
    checks["phase_control_cases"] = phase_cases

    frontier_ok = True
    frontier_cases = 0
    packages = page.locator("#frontier-package option").evaluate_all("els=>els.map(el=>el.value)")
    readouts = set()
    for value in packages:
        page.eval_on_selector(
            "#frontier-package",
            "(el,value)=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))}",
            value,
        )
        page.wait_for_timeout(25)
        readouts.add(page.locator("#frontier-readout").inner_text())
        frontier_cases += 1
    frontier_ok = frontier_ok and len(readouts) == len(packages)
    horizon = page.locator("#frontier-horizon")
    values = range(int(horizon.get_attribute("min")), int(horizon.get_attribute("max")) + 1)
    readouts = set()
    for value in values:
        page.eval_on_selector(
            "#frontier-horizon",
            "(el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}))}",
            value,
        )
        page.wait_for_timeout(25)
        readouts.add(page.locator("#frontier-readout").inner_text())
        frontier_cases += 1
    frontier_ok = frontier_ok and len(readouts) == len(values)
    checks["frontier_controls"] = frontier_ok
    checks["frontier_control_cases"] = frontier_cases
    return checks


def run_viewport(browser, width, height, tag):
    context = browser.new_context(viewport={"width": width, "height": height})
    page = context.new_page()
    errors = {"console": [], "page": []}
    page.on("console", lambda message: errors["console"].append(message.text[:240]) if message.type == "error" else None)
    page.on("pageerror", lambda error: errors["page"].append(str(error)[:240]))
    page.goto(URL, wait_until="load")
    page.wait_for_timeout(700)
    page.evaluate("document.documentElement.style.scrollBehavior='auto'")

    for scene_id in SCENES:
        scroll_to_scene(page, scene_id, width)
    if page.locator("canvas").count() != 12:
        raise AssertionError(tag + ": expected exactly 12 canvases")

    header_bottom = page.evaluate(
        "Math.max(document.querySelector('.site-header').getBoundingClientRect().bottom,document.querySelector('.claim-boundary').getBoundingClientRect().bottom)"
    )
    scenes = {}
    for scene_id in SCENES:
        scroll_to_scene(page, scene_id, width)
        canvas = page.locator("#visual-" + scene_id + " canvas")
        canvas_box = canvas.bounding_box()
        visual_box = page.locator("#visual-" + scene_id).bounding_box()
        band = relative_card_band(page, scene_id, canvas_box)
        card_box = band.pop("box")

        if abs(canvas_box["width"] - visual_box["width"]) > 2 or abs(canvas_box["height"] - visual_box["height"]) > 2:
            raise AssertionError(tag + "/" + scene_id + ": canvas does not match visual host")
        if width > 680:
            if card_box["y"] < header_bottom - 1 or card_box["y"] + card_box["height"] > height + 2:
                raise AssertionError(tag + "/" + scene_id + ": copy card crosses fixed chrome or viewport")
        elif card_box["y"] < visual_box["y"] + visual_box["height"] - 2:
            raise AssertionError(tag + "/" + scene_id + ": mobile copy card overlaps canvas band")

        candidates = targets_for(page, scene_id, canvas_box["width"], canvas_box["height"], band)
        tested = []
        for target_index, (local_x, local_y) in enumerate(candidates):
            page.mouse.move(2, 2)
            page.wait_for_timeout(80)
            baseline = canvas.evaluate(CANVAS_HASH)
            viewport_x = canvas_box["x"] + local_x
            viewport_y = canvas_box["y"] + local_y
            if not (0 <= viewport_x < width and header_bottom + 1 <= viewport_y < height - 1):
                raise AssertionError(tag + "/" + scene_id + ": hotspot outside the usable viewport: " + str(target_index))
            if width > 680 and band["left"] <= local_x <= band["right"] and band["top"] <= local_y <= band["bottom"]:
                raise AssertionError(tag + "/" + scene_id + ": hotspot overlaps the copy-card band: " + str(target_index))
            page.mouse.move(viewport_x, viewport_y)
            page.wait_for_timeout(90)
            if canvas.evaluate(CANVAS_HASH) == baseline:
                raise AssertionError(tag + "/" + scene_id + ": hover disclosed nothing at hotspot " + str(target_index))
            page.mouse.click(viewport_x, viewport_y)
            page.wait_for_timeout(80)
            page.mouse.move(2, 2)
            page.wait_for_timeout(100)
            if canvas.evaluate(CANVAS_HASH) == baseline:
                raise AssertionError(tag + "/" + scene_id + ": click did not remain pinned at hotspot " + str(target_index))
            tested.append([round(local_x, 1), round(local_y, 1)])

        screenshot = OUT / (tag + "_" + scene_id + ".png")
        page.screenshot(path=str(screenshot))
        scenes[scene_id] = {
            "hover_disclosed": True,
            "click_pinned": True,
            "hotspot_count": len(tested),
            "targets_canvas_xy": tested,
            "card_rect": {key: round(card_box[key], 1) for key in ("x", "y", "width", "height")},
            "visual_rect": {key: round(visual_box[key], 1) for key in ("x", "y", "width", "height")},
            "screenshot": screenshot.relative_to(SITE).as_posix(),
        }

    controls = exercise_controls(page)
    if not all(controls[key] for key in ("challenge_buttons", "phase_controls", "frontier_controls")):
        raise AssertionError(tag + ": one or more DOM controls failed: " + repr(controls))
    if errors["console"] or errors["page"]:
        raise AssertionError(tag + ": browser errors: " + repr(errors))
    result = {
        "viewport": {"width": width, "height": height},
        "canvas_count": 12,
        "controls": controls,
        "console_errors": errors["console"],
        "page_errors": errors["page"],
        "scenes": scenes,
    }
    context.close()
    return result


def main():
    missing_free_band = [
        scene_id for scene_id in SCENES
        if "freeBands" not in (SITE / "scenes" / (scene_id + ".js")).read_text()
    ]
    if missing_free_band:
        raise SystemExit("painters missing free-band mapping: " + repr(missing_free_band))

    results = {"browser": "Google Chrome", "url": "index.html opened with the file protocol", "viewports": {}, "verdict": "PASS"}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=CHROME, headless=True)
        for width, height, tag in VIEWPORTS:
            results["viewports"][tag] = run_viewport(browser, width, height, tag)
        browser.close()
    REPORT.write_text(json.dumps(results, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print("PASS: exercised and captured", len(SCENES), "scenes across", len(VIEWPORTS), "viewports")
    print("report:", REPORT)
    print("screenshots:", OUT)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print("SCENE QA FAILED:", error, file=sys.stderr)
        raise
