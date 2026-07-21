# Font-load evidence

Playwright evaluated `document.fonts.check('16px IBM Plex Sans')` and `document.fonts.check('12px IBM Plex Mono')` after network-idle and received `true` for both in desktop and mobile runs. `document.fonts.status` was `loaded`. No remote font request occurred.

Vendored file hashes are recorded in `audit/README.md` and the final bundle manifest.
