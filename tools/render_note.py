#!/usr/bin/env python3
"""Render the print companion from the locally served offline artifact."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://127.0.0.1:8877/technical-note.html", wait_until="networkidle")
    page.emulate_media(media="print")
    page.pdf(path=str(ROOT / "technical-note.pdf"), format="A4", print_background=True, margin={"top":"0","right":"0","bottom":"0","left":"0"})
    browser.close()
print("technical note rendered")
