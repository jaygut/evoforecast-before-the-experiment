# Offline request audit (successor v2)

Snapshot: 20 July 2026

## Method

The predecessor audit was captured over a loopback HTTP origin
(`http://127.0.0.1`). That proves no remote requests, but it does not prove the
bundle runs from `file://`, and it hid a critical defect: the predecessor loaded
data only via `fetch()`, which a `file://` open blocks by CORS, so its interactive
layer was dead on a double-click.

This audit is captured from a genuine `file://` origin in real Google Chrome, in
default mode (no `--allow-file-access-from-files`), so `fetch()` on `file://` stays
blocked exactly as it would for a user who double-clicks `index.html`.

## Result

- Data source at load: **embedded bundle** (`window.EVO_DATA` from `data/bundle-data.js`).
- Canvases mounted after scroll-through: **12 of 12**.
- Story sections present: **12**.
- Console errors: **0**. Page errors: **0**.
- Interaction under `file://`: changing the information track and the reference-frame
  buttons updates the lookup readouts.
- Remote requests captured on load and scroll-through: **0** (see `qa/qa_suite_v2.json`).

## Evidence

- `qa/file_smoke_v2.json` (real Chrome `file://` smoke, verdict PASS).
- `qa/qa_suite_v2.json` (network-zero, voice lint, accessibility, verdict PASS).
- Reproduce with `python3 tools/file_qa.py` and `python3 tools/qa_suite.py`.

The predecessor's `browser_results.json` and its "release-ready offline" statement
are superseded by this file:// verification.
