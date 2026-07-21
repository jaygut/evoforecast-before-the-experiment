#!/usr/bin/env python3
"""Capture the exact external design references consulted for this build."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "audit/reference_captures"
REFERENCES = {
    "brand_notion": "https://app.notion.com/p/3a342ab843e381f08c2af78caf7da1a2",
    "storytelling_notion": "https://app.notion.com/p/3a342ab843e381b09622e269928fcb14",
    "ai_ecologist": "https://jaygut.github.io/ai-ecologist-landing/",
    "upper_colorado": "https://jaygut.github.io/upper-colorado-corridor-landing/",
    "fluvion_soy_belt": "https://jaygut.github.io/fluvion-landing/soy-belt.html",
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for ref_id, url in REFERENCES.items():
            page = browser.new_page(viewport={"width": 1440, "height": 900}, color_scheme="dark")
            errors = []
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            status = "live"
            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(1800)
                text = page.locator("body").inner_text(timeout=10000)
                text = re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"
                text_path = OUT / (ref_id + ".txt")
                image_path = OUT / (ref_id + ".png")
                text_path.write_text(text, encoding="utf-8")
                page.screenshot(path=str(image_path), full_page=True)
                results.append({"id": ref_id, "url": url, "status": status, "http_status": response.status if response else None, "title": page.title(), "body_characters": len(text), "text_sha256": digest(text_path), "screenshot_sha256": digest(image_path), "console_error_count": len(errors)})
            except Exception as exc:
                results.append({"id": ref_id, "url": url, "status": "failed", "error": str(exc)})
            finally:
                page.close()
            (OUT / "manifest.json").write_text(json.dumps({"captured_at_utc": "2026-07-20T18:00:57Z", "references": results}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        browser.close()
    (OUT / "manifest.json").write_text(json.dumps({"captured_at_utc": "2026-07-20T18:00:57Z", "references": results}, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
