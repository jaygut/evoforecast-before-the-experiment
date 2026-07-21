# EvoForecast scrollytelling audit index

Output: published repository root
Evidence-export snapshot: 20 July 2026
End-to-end publication audit: 21 July 2026
Repository source revision: `fbd77ec79026401e718a23e26afa44c26d886030`
Repository worktree note: the three governing prompt/PRD files were untracked user inputs at build time and are therefore bound by their file hashes, not implied to be present in that commit.

## Controlling hashes

| Input | SHA-256 |
|---|---|
| Scrollytelling execution prompt | `390928168f6f003125c71d484c1bfd31eb984d67a0b098baa43111289bfef28a` |
| GT01 PRD | `edeab3d86997e97cec429e73bfd622bc1a5780d1e4d5eac3412c3f426c08b979` |
| Design wind-tunnel brief (internal) | `8a9cc820ba9497d50694d8385429ccead3ff694f71d6f49aa0abd3ccff9e6fc4` |
| Canonical brand snapshot | `4f7ed8f3af048ae0ac620a0535c9b4a887111f6140deefa9da6767240ccac2e3` |
| Canonical voice snapshot | `1b067c7f4dd176559371adb2782c622eace2ab0cf25d1dfbca690ae5fee319c4` |

Every scientific source row, normalized locator, byte size, and hash is in `source_manifest.json`. `lineage_dag.json` records source → exported data → rendered-site relationships.

## Published immutable evidence

| Bundle file | Source SHA-256 (identical after copy) |
|---|---|
| `evidence/blind_v5_phase_diagram.svg` | `f100b1a7371f405d456b540e2e62952b132dbbf221c4a7dc179e61a5ad8571d5` |
| `evidence/blind_v5_portfolio_frontier.svg` | `1fac64ed4069508d042574e123213697c1cd2ecc30a055956c680ac72d08d349` |

The predecessor's external-facing evidence PDFs are not shipped in this public tree. No published source evidence was edited, cropped, recomputed, or overwritten.

## Runtime dependencies

The p5 vendor file and five IBM Plex WOFF2 files were copied byte-for-byte from the approved local design reference. Their hashes are in `bundle_manifest.json`; the p5 hash is `00a532c56e785c68d7c7bb6f9a084e2c856b71527f22c3260aff4a2f582d80c9`. There is no CDN, build step, service worker, analytics call, or remote runtime fetch.

Raw third-party page captures are not shipped. They can reproduce named-individual text or imagery from unrelated page footers. `design_review.md` records the review method and the hash-bound local snapshots without carrying those captures into the public tree.

## Audit map

- `claim_registry.tsv` / `facts_digest.json`: all displayed scientific assertions, allowed and forbidden wording, denominators, status, and uncertainty.
- `source_manifest.json`: immutable scientific-source lineage.
- `lineage_dag.json`: machine-readable derivation graph.
- `environment.json`: exporter environment and script hash.
- `design_review.md`: design-reference access, public-capture omission, and brand decisions.
- `scientific_review.md`: fresh-context scientific review and resolved findings.
- `visual_narrative_review.md`: fresh-context visual/narrative review and resolved findings.
- `commands.log`: normalized command chronology.
- `../qa/scene_interaction_results.json`: every discrete hover/click hotspot at the three release widths.
- `bundle_manifest.json`: final SHA-256 inventory, excluding itself to avoid circularity.
- `final_audit.md`: release verdict and remaining boundaries.

The two review passes are internal computational quality reviews with distinct checklists. They are not fabricated external or independent expert acceptance.
