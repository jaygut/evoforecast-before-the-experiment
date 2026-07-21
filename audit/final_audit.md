# Final audit report (successor v2)

Status: **release-ready as a dated, offline synthetic communication artifact that
works from a file:// double-click**
Date: 21 July 2026

Successor to `evoforecast-graph-of-life-scrollytelling-20260720T180057Z`, which is
preserved unchanged. This version rebuilds the narrative into a twelve-beat
decision-maker spine, adds a dedicated V4-rejection beat, and fixes a critical
offline defect that left the predecessor's interactive layer dead on a double-click.

## What this artifact proves

- The public bundle reconstructs the registered synthetic facts deterministically
  from immutable, hash-bound sources, and the JSON mirrors and the embedded
  `window.EVO_DATA` bundle are parity-checked and hash-recorded.
- The latest blind package completed 5,600 of 5,600 SLiM 5.2 trajectories successfully.
- The release, deposit, reveal, and score chronology, the model-information tracks,
  the phase and portfolio cells, the controls, and the claim boundaries can be
  inspected without a runtime network and without hidden browser computation.
- Both favorable and adverse software controls are visible, and abstention and a
  rejected cohort are first-class outcomes.
- The trajectory scene projects every daily population and founder-composition row
  from all 32 registered `adaptive_E07` vessels. The default is the first manifest
  row, and browser interaction selects frozen rows only.
- The bundle functions at desktop and mobile widths, in reduced-motion mode, and
  without JavaScript, and it now works opened directly from `file://`.

## The critical fix

The predecessor loaded data only via `fetch()`, which a `file://` open blocks by
CORS, so every scene canvas and control failed to initialize on a double-click. QA
had missed this because it was captured over a loopback HTTP origin. This version
ships an embedded classic bundle `data/bundle-data.js` (`window.EVO_DATA`), generated
from the frozen `data/*.json` mirrors with asserted parity, and `main.js` prefers it
and uses `fetch()` only as an online fallback. Verified in real Google Chrome at a
`file://` origin under default CORS: 12 of 12 scene canvases mount, data loads from
the embedded bundle, interactions update, and there are zero console and page errors.

## What it suggests, conditionally

- Synthetic challenge scenarios can reveal measurement and replication bottlenecks
  before a physical programme scales.
- Richer information tracks can improve aggregate scores in some registered scenarios
  while still failing calibration or the combined gate.
- A bounded, staged, keystone-centered round is a defensible next method for deciding
  what a physical programme would need to measure.

## What remains blocked

- Empirical Daphnia magna forecast skill and real DNA predictive value.
- Out-of-distribution transfer (one MATCH environment; transfer unestimated).
- GT01/G1 qualification, exact founder/genome identity, and a calibrated
  genome-to-phenome mechanism.
- Real assay performance, custody, independent prospective reveal, biological
  uncertainty analysis, and external reproduction.
- Operational forecasting, intervention efficacy, external endorsement, budget authority,
  public scientific release claims, or safety authority.

## Verification verdict

- JSON to `window.EVO_DATA` parity and hash: passed (`tools/build_data_bundle.py --check`).
- Two-run deterministic bundle export: passed (identical SHA-256).
- Leak gate, exact-key allowlist, and offline-first bundle order: passed.
- Real Chrome `file://` smoke (default CORS): passed (`qa/file_smoke_v2.json`).
- Offline network-zero on load and scroll-through: passed (`qa/qa_suite_v2.json`).
- Voice lint on rendered prose: passed (no em/en-dash, semicolon, negation-correction,
  or stock phrasing).
- Accessibility basics: passed (one h1, ordered h2, skip link, labelled controls,
  slider aria-valuetext, canvases aria-hidden). The companion note is now a single h1.
- Desktop, mobile 390 px, reduced-motion, and no-JavaScript reading paths: passed.
- Exhaustive scene interaction at 1280×900, 1920×1080, and 390×844: passed.
  The harness exercised 167 scene hotspots and 453 discrete DOM-control cases,
  with hover disclosure, click pinning, 12 canvases, and zero console or page errors
  at every width.
- Manual visual inspection: all 36 current scene captures, both DOCX pages, and all
  three technical-note pages inspected. The mobile trajectory plot initially placed
  its day-zero hotspot beneath the fixed boundary. The plot was moved into the usable
  band and the full three-width interaction gate then passed.
- Author exception: the story footer, technical note, and decision brief carry the
  owner-approved identity `Jay Gutierrez, PhD`, `jg@graphoflife.com`, and
  `biome-translator.emergent.host`. The leak gate requires all three while preserving
  the unrelated-name and external-funder bans.
- Three-page A4 technical note: regenerated from the corrected, voice-compliant HTML.
- Independent adversarial review (scientific, communication, fresh-reader, voice and
  accessibility): completed; findings triaged and dispositioned in
  `audit/independent_review_v2.md`. No critical or high communication finding remained;
  the scientific recompute found no claim-boundary breach.
- GT01 production tree and immutable evidence inputs: unchanged.

## Superseded predecessor records

`qa/browser_results.json` and any predecessor statement of "release-ready offline"
were based on a loopback HTTP origin and are superseded by the `file://` verification
in `qa/offline_request_audit.md`, `qa/file_smoke_v2.json`, and `qa/qa_suite_v2.json`.
The predecessor bundle manifest covers the predecessor tree; the new data bundle is
covered by `audit/bundle_data_manifest.json`, and a full-bundle manifest should be
regenerated by `tools/finalize_bundle.py` before any external release.

## Single next action

Run one small, contained, keystone-centered round: one candidate organism, one
stressor, one feasible measurement budget, and one sealed outcome, rehearsed in the
wind tunnel first, then executed as the smallest real round that can estimate
calibration and forecast accuracy under an independent reveal.

EvoForecast turns prediction into a testable programme decision. Measure what can
discriminate, seal the outcome, score the forecast, and scale only after the evidence
earns it.
