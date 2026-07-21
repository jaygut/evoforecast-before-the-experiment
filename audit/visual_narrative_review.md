# Fresh-context visual and narrative review

Review type: internal visual/narrative pass; not an external design endorsement  
Review date: 20 July 2026  
Evidence: desktop, mobile, reduced-motion, no-JavaScript screenshots; browser result JSON; three rendered note pages; hash-bound local brand and voice snapshots.

## Review questions

- Can a skeptical reader recover the argument without touching a control?
- Does each visual reveal a claim rather than decorate a chapter?
- Can supported, indicative, and blocked states be distinguished without color alone?
- Do copy cards collide with plotted labels or fixed chrome?
- Are source pills, caveats, and badges legible at desktop and 390 px mobile width?
- Does reverse scroll reconstruct the same scene state?
- Does the ending make one bounded ask rather than a generic pitch?

## Findings and disposition

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| VIS-01 | High | The initial portfolio control used invented package labels that did not match the registered table. | Fixed before release. Options now use the six exact `measurement_package` keys and human-readable config labels. |
| VIS-02 | Medium | The first technical-note render produced six pages because exact-height pages also forced page breaks. | Fixed. The final PDF is exactly three A4 pages; content was tightened and the second-page footer moved inside the safe band. |
| VIS-03 | Low | The initial ask panel had no inline caveat even though every other chapter did. | Fixed. All twelve scenes now have provenance, source pill, and inline caveat. |
| VIS-04 | Informational | Stitched full-page screenshots contain blank vertical runway because sticky scrollytelling stages are captured at one scroll state. | Accepted. Viewport interaction is controlling; the blank runway is intentional scene duration, not missing content. |
| VIS-05 | Low | The successful-load status pill remained visible and could overlap lower mobile copy. | Fixed. The live region remains in the DOM and visually fades after successful load. |

## Passed observations

- No console errors or runtime remote requests.
- Zero horizontal overflow at 1440×900 and 390×844.
- Twelve canvases construct in both sizes; every essential claim remains in the DOM.
- Native controls update live regions with registered readouts.
- DOM-measured card bands are recomputed after font settlement and resize; phase, frontier, chronology, and genome labels stay outside the occupied copy region.
- Exact local IBM Plex fonts report loaded.
- Reduced-motion chapters resolve to finite static stages with automatic scroll behavior.
- No-JavaScript mode exposes twelve scene titles, twelve source pills, the fixed claim boundary, and an explicit fallback summary.
- The final sentence is quiet, claim-bounded, and exact.

## Conclusion

The artifact reads as one cumulative argument rather than a chart gallery: claim → stakes → epistemic failure → auditable mechanism → phase instrument → portfolio trade-off → challenge chronology → proposed cutaway → abstention → maturity → bounded ask. No open visual defect is release-blocking.
