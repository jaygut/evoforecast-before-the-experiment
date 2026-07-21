#!/usr/bin/env python3
"""Render the print companion directly from the offline HTML artifact."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto((ROOT / "technical-note.html").as_uri(), wait_until="load")
    page.wait_for_function("document.fonts.status === 'loaded'")
    if page.locator("main.note > section.page").count() != 3:
        raise SystemExit("technical note must contain exactly three source pages")
    page.emulate_media(media="print")
    page.pdf(path=str(ROOT / "technical-note.pdf"), format="A4", print_background=True, margin={"top":"0","right":"0","bottom":"0","left":"0"})
    browser.close()
print("technical note rendered")
