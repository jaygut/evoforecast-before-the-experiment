# EvoForecast scrollytelling strategy (successor v2)

Snapshot: 20 July 2026
Audience: a research director or funder sizing a large predict-evolution programme, plus the
scientists and reviewers who would vet it.
Claim boundary: synthetic software and experimental-design evidence only. Not empirical Daphnia
magna forecast skill, real DNA predictive value, out-of-distribution transfer, GT01/G1
qualification, external endorsement, funding, or intervention efficacy.

## Narrative spine (twelve beats)

| # | Scene | Falsifiable point | Frozen fact | Reader question |
|---|---|---|---|---|
| 1 | hero | Before funding a large experiment, find out whether it can teach you enough to predict what happens next. | EF-001, EF-002, EF-003 | Will this experiment separate a good forecast from a lucky guess? |
| 2 | stakes | A programme can spend more and still not tell two forecasts apart. | EF-014 (illustrative programme scale) | Which irreversible choice most limits what the experiment can learn? |
| 3 | blindspot | A better average can hide a forecast that misses too often. | EF-007 (47.5% ladder aggregate, 80% coverage) vs EF-003 (0/60) | Would the design survive calibration and a held-out gate? |
| 4 | windtunnel | Rehearse the whole experiment where the answer is already known, and compare learning, cost, and failure. | EF-013 (SLiM 5.2 registered for this round), EF-002 | Where could leakage or a second simulator enter? |
| 5 | abstain (V3) | First prove the instrument can find a signal that is really there. | EF-009 (+17.0%), EF-010 (-9.2%), 16 seed blocks | Is the positive control passed, and can the same workflow come back empty? |
| 6 | rejection (V4) | Throw out evidence that cannot be trusted. | REVIEW-V4 disposition, EF-016 | Does the review stop a flattering but broken result before it decides anything? |
| 7 | challenge (V5) | The clean, expensive run said do not scale yet. | EF-002/003/004/006/007/008 | Did a clean run produce a clear instruction? |
| 8 | phase | Build a design and read what the frozen challenge already found. | EF-003, EF-004, EF-005 (80 cells) | Where does a design cross from signal to evidence? |
| 9 | frontier | More measurement helps only when it changes the answer. | EF-006 (0/120), EF-008 (feedback +0.0%) | What measurement buys identifiability rather than expense? |
| 10 | ladder | The software is proven here, while the biology still needs a real test. | EF-002, EF-011, EF-015, EF-017 | Which rung is truly supported, and what would move the next one? |
| 11 | genome | The hard part a real study still has to prove. | EF-012 (proposed/blocked), EF-015 | Which structural assumptions still need real material and assays? |
| 12 | ask | Run one small, staged, keystone-centered round together before anyone scales. | EF-001, EF-015 | What must the physical programme measure before it scales? |

## Load-bearing decisions

1. **Address the decision-maker, keep the guardrail.** The story speaks to the reader's scale-or-not
   decision directly while stating everywhere that evidence is synthetic and there is no
   endorsement or funding. The willingness to say "not ready" is the persuasive asset for this reader.
2. **Offline-first data path.** Data ships as an embedded classic bundle `data/bundle-data.js`
   (`window.EVO_DATA`), generated from the frozen `data/*.json` mirrors with asserted parity and hash.
   `main.js` prefers it and uses `fetch()` only as an online fallback, so a `file://` double-click keeps
   the full interactive instrument. Verified in real Chrome under default CORS.
3. **Ladder aggregate is never a single cell.** The 47.5% gain and 80% coverage are the model-ladder
   aggregate across 35 nuisance contexts, framed as such. The phase-cell product at 48 arms and day 60
   (a different 39.3% / 68.3%) is never substituted as the headline.
4. **Latest, least flattering default.** Blind v5 is the default because it is latest and yields zero
   prospective indicative cells. Blind v3 remains as chronology, not headline.
5. **V3, V4, V5 are three distinct beats.** The positive control, the rejected cohort, and the scale-up
   decision are separated so the trust arc (find a real signal, throw out a broken one, act on a clean
   negative) is legible. The day-90 52.5% nowcast is shown as barely above the indicative threshold and not prospective evidence.
6. **Lookup, never live inference.** The instruments read hash-bound cells. Controls are labelled Build
   the experiment and Explore measurement plans, and the browser contains no fitting, scoring, or
   simulation path.
7. **One biological boundary.** The site does not modify RC01 or implement GT01. The ten-chromosome
   cutaway is explicitly proposed and blocked and paired with the clonal RC01 boundary. SLiM 5.2
   is the registered trajectory engine for this round. The harness is engine-agnostic, other
   evolutionary simulators are under evaluation, and ecological network dynamics in a population
   context remain a direction for later rounds.
8. **Color is semantic and canvas is redundant.** Teal is connection, green supported synthetic
   evidence, amber indicative and caution, coral risk, keystone, and abstention. Every essential value
   exists in semantic DOM text; canvases are `aria-hidden`; no-JavaScript and reduced-motion retain all
   twelve beats.
9. **Voice.** Scientist and product builder. No em-dash, no semicolon in public prose, no rhetorical
   mid-sentence colon, no "not X but Y", no grant or governance register, no stock LLM phrasing.

## Stop conditions preserved

The story stops at software proof and indicative synthetic design evidence. It may not claim empirical
qualification, exact founder or genome identity, a real assay result, external endorsement, operational
forecasting, biological intervention efficacy, or release authority. Any future integration into the
GT01 worktree would require a separate repository-scoped decision and review.
