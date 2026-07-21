# EvoForecast · Before the experiment (successor v2)

An offline, public-quality scrollytelling artifact that presents EvoForecast as a synthetic
digital wind tunnel: it rehearses an evolution-prediction experiment in software before it is
built, and reports plainly when a design is not ready.

Successor to `evoforecast-graph-of-life-scrollytelling-20260720T180057Z`. The predecessor is
preserved unchanged. This version rebuilds the narrative into a twelve-beat decision-maker
spine, adds a dedicated V4-rejection beat, and fixes a critical offline defect.

## Value proposition

Before anyone commits tens of millions of pounds to a dataset built to predict evolution, EvoForecast
can tell you whether the experiment is even winnable. In a fully synthetic world where the true
outcome is known by construction, competing forecasters are scored blind, and the instrument
reports whether rival designs can be told apart, which measurements buy identifiability rather
than expense, and when the honest read is that a design is not ready.

## Claim boundary

This bundle demonstrates reproducible software execution, blind synthetic challenge discipline,
source-hash lineage, and a lookup interface over preregistered design cells. It does **not**
demonstrate empirical Daphnia magna forecast skill, real DNA predictive value, out-of-distribution
transfer, GT01 or G1 qualification, a calibrated genome-to-phenome mechanism, external endorsement or
funding, or intervention efficacy. All evidence is synthetic and within-model (MATCH) only. The illustrative
programme cost is external context, not a committed budget.

## Open it

The bundle now works two ways with no build step and no runtime network:

1. **Double-click `index.html`** (opens from `file://`). Data loads from the embedded classic
   bundle `data/bundle-data.js` (`window.EVO_DATA`), so every scene and control works offline.
2. Or serve it: `python3 -m http.server 8877 --bind 127.0.0.1`, then open `http://127.0.0.1:8877/`.

The predecessor loaded data only via `fetch()`, which a `file://` open blocks by CORS, so its
interactive layer was dead on a double-click. That is fixed here and verified in real Chrome.

## What is here

- `index.html`, `styles.css`, `config.js`, `main.js`: semantic story, brand system, scroll driver.
- `scenes/`: twelve p5 instance-mode scene painters (adds `rejection.js` for the V4 beat).
- `data/`: deterministic, public, hash-bound lookup JSON, plus `bundle-data.js` (`window.EVO_DATA`).
- `evidence/`: registered synthetic figures (SVG); no external-facing PDFs are shipped.
- `technical-note.html` / `technical-note.pdf`: print-friendly three-page companion.
- `audit/`: claim registry, source hashes, lineage, environment, reviews, V4 disposition, final audit.
- `qa/`: file:// smoke results, screenshots, accessibility evidence, and defect log.
- `tools/`: deterministic exporter, `build_data_bundle.py`, leak gate, `file_qa.py`, `qa_suite.py`.

## Verify it

```bash
python3 tools/build_data_bundle.py --check   # JSON <-> window.EVO_DATA parity + hash
sh tools/leak_gate.sh                         # remote/randomness/path/claim + offline-first order
python3 tools/file_qa.py                       # real Chrome file:// smoke (12 canvases, embedded data)
python3 tools/qa_suite.py                       # voice lint, offline network-zero, a11y, screenshots
```

## Keyboard and accessibility

Use the skip link to reach the story. Native controls are keyboard-operable. Outside a form
control, `J` advances and `K` returns to the previous chapter. Reduced-motion users receive
resolved static scenes. With JavaScript disabled, all twelve titles, facts, evidence badges,
caveats, and links remain in document order, and every canvas is `aria-hidden` and non-essential.

## Data sources and limits

The instrument reads the latest blind-v5 synthetic phase and portfolio tables. Blind v3, the
corrected favorable and adverse controls, the earlier RC01 synthetic POC, the GT01 PRD, and the
internal design brief provide chronology and boundaries. Exact hashes and normalized locators
are in `audit/source_manifest.json`; displayed language is registered in `audit/claim_registry.tsv`.
The frozen immutable-evidence products are hash-bound upstream and are not shipped in this bundle;
the `data/*.json` mirrors are their deterministic re-exports and `data/bundle-data.js` is generated
from those with asserted parity. This is a dated synthetic snapshot.
