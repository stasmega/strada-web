# Strada website

Static public website and shared-stop handler for Strada, hosted on GitHub Pages.

- [Website](https://stasmega.github.io/strada-web/)
- [Privacy Policy](https://stasmega.github.io/strada-web/privacy/)
- [Terms of Service](https://stasmega.github.io/strada-web/terms/)
- [Account deletion](https://stasmega.github.io/strada-web/delete-account/)

No build step, runtime dependencies, tracking scripts or third-party font requests. Manrope is hosted locally in `assets/fonts/` under the included SIL Open Font License. Serve the repository with `node tools/preview.cjs` and open `http://127.0.0.1:4173`.

The landing page uses `assets/landing.css` and `assets/landing.js`; legal and shared-stop pages keep `assets/site.css`. The feature selector progressively enhances real anchor links: all screenshots remain available without JavaScript. Motion respects reduced-motion preferences. Product facts and visual decisions are documented in `PRODUCT.md` and `DESIGN.md`.

`home/index.html` retains the old homepage URL. `stop/?id=…` opens a shared stop through `strada://stop/…`. Keep `.well-known/assetlinks.json` and the in-app `strada-content.json` feed intact.
