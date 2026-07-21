# Independent review dispositions (successor v2)

Date: 20 July 2026
Method: four parallel adversarial reviewers over the rebuilt story bundle
(scientific recompute, adversarial communication, fresh-reader comprehension,
voice and accessibility). Internal automated reviews are not external human
acceptance.

## Verdicts

- **Scientific recompute: minor_findings.** Every displayed statistic matches the
  frozen sources exactly and is framed correctly. The 47.5% / 80% headline is
  confirmed as the model-ladder aggregate over 35 contexts and is never the
  phase-cell product (mean of the 20 GP1-vs-P1 phase cells is 19.3%; the 48-arm
  day-60 cell 39.3% / 68.3% appears only inside the lookup instrument). Gates
  recomputed exactly (0/60, 0/80, 1/80 = the day-90 52.5% cell, 0/120). No
  claim-boundary breach found.
- **Adversarial communication: minor_findings, no must-fix.** Read as a research
  director and a skeptical geneticist, the story survives. The claim boundary is
  airtight and repeated where it matters. The value proposition is judged
  compelling and credible for a nine-figure scale-or-not decision.
- **Fresh-reader comprehension: minor_findings.** The five-second and sixty-second
  tests both land the intended message. The first-250-words rule passes (no model
  acronym; problem, decision-maker, cost, and role all stated). Findings were
  plain-language glosses for load-bearing terms.
- **Voice and accessibility: minor_findings.** Voice is clean (no em/en-dash, no
  semicolon in prose, no negation-correction, no stock phrasing). Accessibility is
  largely sound. One real defect in the companion note (three h1 elements).

## Fixed in v2

- Frontier axis renamed from bare "cost" to "modeled resource use", with a caveat
  that resource use is a planning abstraction, not a procurement cost or budget.
- Phase readout now prints the plain track label (for example "Genome + phenome")
  instead of the internal acronym, shows coverage to one decimal so it no longer
  visually collides with the 80% ladder headline, and is labelled "single-cell lookup".
- Frontier readout leads with the classification and appends "none robustly best" so a
  high Pareto-membership figure cannot travel alone.
- Static index.html frontier proof synced to the config value (feedback +0.0% beyond
  genome plus phenome), removing JS-on vs no-JS drift.
- Plain-language glosses added: the combined test and the 50% coin-toss meaning are
  defined in the V5 scene; "one cell is one design at one forecast horizon" is defined;
  "prospective" removed from the hero; the V3/V4/V5 version scheme is introduced;
  "regret" replaced with "expected loss"; "proper score" replaced with "forecast
  accuracy"; "nowcast" dropped; "mesocosms" replaced with "small controlled model
  ecosystems"; the closing network is subordinated to an explicit later stage around one
  keystone organism.
- All external-funder references removed; the claim boundary reads "no endorsement, partnership, or funding claim".
- Slider `aria-valuetext` set initially and on input, so assistive tech announces
  "16 populations" and "day 60" rather than raw indices.
- Companion technical note reduced to a single h1 with page titles demoted to h2 and
  section headings to h3.
- Unicode minus sign in a canvas label replaced with an ASCII hyphen.

## Accepted as minor, not changed

- All external-funder naming and the specific programme figure were removed in the de-branding
  pass; the hero now reads "tens of millions of pounds" and the stakes scene marks the figure as an
  illustrative programme scale, not a committed budget.
- A small set of specialist tokens (hash-bound, standing variation, phenome,
  marker-encoded) remain for the actual research-director audience, glossed lightly where
  added; over-glossing would flatten the register for the expert reader.
- Desktop chapter-nav dot target size, source-pill accessible names (mitigated by the
  visible "SOURCE" prefix and the claim IDs), and a mild double live-region announcement
  are logged as low-priority polish for a later pass.

## De-branding and scene-render pass (owner-directed)

- Removed every external-funder and named-individual reference (agency name, the specific programme
  figure) from the artifact and its data ledgers. The cost anchor is now a generic illustrative
  "tens of millions of pounds," clearly marked not a committed budget. A permanent leak-gate guard
  fails the build on any reintroduction of those tokens.
- Predecessor evidence PDFs (derived from external-facing briefs) were removed; the ask actions now
  point only to the technical note and the audit trail. The two registered SVG figures remain.
- Scene-by-scene visual review at desktop and mobile: every one of the twelve scenes was corrected to
  render its canvas content in the free band beside the copy-card, with no text, box, or control
  overlapping the card. Painters made free-band-aware: stakes, blindspot, windtunnel, abstain,
  challenge, rejection, genome, ladder.
- Owner credentials added to the page footer (always visible at the page end), with outbound mailto
  and site links; outbound navigation links are permitted by the leak gate while remote runtime
  resources remain banned.

## Interactive redesign pass (owner-directed)

Reviewer finding: the interactive layer was decorative and did not carry the value
proposition. A specialist interaction-design workshop (instrument, pipeline, hero,
narrative-critic) spec'd the rebuild. A pointer layer was added to the scene engine
(hover and click, rAF-throttled, cleared on canvas-leave, disabled under reduced
motion) and painters now receive a per-instance pointer state. Everything remains
LOOKUP ONLY: pointers select and reveal frozen rows, the browser computes nothing.

- **phase** rebuilt as a verdict bench. The configured design gets a PASS/FAIL stamp,
  decomposed into three sub-test meters: accuracy gain with the interval that must
  clear zero, calibration against the 85-95 percent band, and the combined gate against
  the 50 and 80 percent marks. Below sits a gain-by-coverage plane with the acceptance
  band shaded, a PASS REGION drawn and visibly EMPTY, all 80 frozen cells plotted, the
  measurement ladder P1 to R1 traced at the selected design, and hover-to-inspect on any
  cell. The default design reads +17.1 percent gain, interval still touching zero,
  79.9 percent coverage (over-confident), combined gate 21.6 percent, verdict NOT READY.
- **frontier** rebuilt as a cost-by-value plane with a robust/conditional/dominated
  counter strip, a value-ceiling line labelled "no plan reaches higher", a break-even
  line, six colour-keyed measurement families, selected-package emphasis, and hover
  tooltips over the 120 frozen policies.
- **windtunnel** rebuilt as an operable auditable chain. A coral blind boundary is drawn
  between deposit and reveal, and hovering any of the nine stages discloses what that
  stage RELEASES and what it keeps HIDDEN.
- **blindspot** rebuilt as a three-gate funnel that visibly collapses from "+47.5%
  CLEARS" through "80% of a 90% range FAILS" to "0/60 EMPTY", with hover disclosure.
- **abstain** gains hover over the favorable and adverse arcs with a disclosure panel.
- **hero** rebuilt as a living network. The mark is re-centred on its geometry centroid
  and fitted to the free band, which fixes the clipped bottom node; nodes carry hit
  halos, respond to the cursor, and disclose their role on hover.
