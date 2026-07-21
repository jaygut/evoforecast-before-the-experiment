# QA summary (successor v2)

Final gate date: 20 July 2026

The predecessor QA was captured over a loopback HTTP origin, which proved no remote requests but
not that the bundle runs from `file://`. That gap hid a critical defect: opened by double-click,
the predecessor loaded data only via `fetch()`, which `file://` blocks by CORS, so its entire
interactive layer was dead. This version fixes it with an embedded `window.EVO_DATA` bundle and
re-runs QA over a genuine `file://` origin in real Chrome.

| Gate | Result | Evidence |
|---|---|---|
| file:// smoke in real Chrome (default CORS) | pass | `tools/file_qa.py`: 12 canvases mount, data from embedded bundle, interactions update, 0 console/page errors |
| Offline network-zero | pass | `tools/qa_suite.py`: zero remote requests captured on load and scroll-through |
| JSON to window.EVO_DATA parity + hash | pass | `tools/build_data_bundle.py --check`; `audit/bundle_data_manifest.json` |
| Two-run deterministic bundle export | pass | identical SHA-256 across two runs of `build_data_bundle.py` |
| Leak / exact-key allowlist / offline-first order | pass | `tools/leak_gate.sh` (adds fetch-fallback-only + bundle-before-main-js order + parity) |
| Voice lint on rendered prose | pass | `tools/qa_suite.py`: no em/en-dash, no semicolon in prose, no negation-correction, no stock phrase |
| Accessibility basics | pass | one h1, ordered h2, skip link, zero unlabeled controls, all canvases aria-hidden |
| Desktop 1280×900 | pass | `screenshots/v2_desktop_hero.png`, `v2_desktop_v5result.png`, `v2_desktop_rejection.png` |
| Mobile 390×844 | pass | `screenshots/v2_mobile_hero.png`; body scroll width within viewport (no horizontal overflow) |
| Reduced motion | pass | `screenshots/v2_reduced_motion.png`; scenes present and frozen at resolved state |
| No JavaScript | pass | `screenshots/v2_no_javascript.png`; 12 sections and noscript summary in document order |
| Three-page A4 note | pass | `technical-note.pdf` regenerated from the corrected, voice-compliant HTML |
| Independent review (scientific / comms / fresh-reader / voice-a11y) | see `audit/final_audit.md` | parallel adversarial review, findings triaged |

These are internal computational and visual checks, not external accessibility certification,
scientific validation, or expert acceptance.
