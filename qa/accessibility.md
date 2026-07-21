# Accessibility verification

Status: passed internal automated and visual checks on 20 July 2026.

- Skip link, semantic `main`, eleven labelled `section` elements, one H1, ordered H2 hierarchy, and footer are present.
- All 11 source pills are links; all 11 provenance states and caveats are textual.
- Controls are native `select`, `range`, and `button` elements with labels, fieldset legends, pressed state, outputs, and polite live regions.
- `J`/`K` chapter shortcuts are disabled while a form control has focus.
- Visible focus uses a 3 px signal-green outline with offset.
- Canvas elements are `aria-hidden`; essential values and qualifications exist in the DOM.
- Supported/indicative/blocked states use words, symbols, borders, and structure in addition to color.
- Browser font checks passed for local IBM Plex Sans and Mono.
- Reduced-motion mode removes smooth scrolling, resolves each scene at its final state, removes long sticky tracks, and disables backdrop blur.
- No-JavaScript mode retained 11 titles, 11 source pills, claim boundary, caveats, links, and an ordered fallback summary.

Limit: no external assistive-technology user study was performed. This is an internal release check, not WCAG certification.
