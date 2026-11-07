# Strada website

Static public website and shared-stop handler for Strada, hosted on GitHub Pages.

- [Website](https://stasmega.github.io/strada-web/)
- [Privacy Policy](https://stasmega.github.io/strada-web/privacy/)
- [Terms of Service](https://stasmega.github.io/strada-web/terms/)
- [Account deletion](https://stasmega.github.io/strada-web/delete-account/)

No build step, runtime dependencies, tracking scripts or third-party font requests. Manrope is hosted locally in `assets/fonts/` under the included SIL Open Font License. Serve the repository with `node tools/preview.cjs` and open `http://127.0.0.1:4173`.

The landing page uses `assets/landing.css` and `assets/landing.js`; legal and shared-stop pages keep `assets/site.css`. The feature selector progressively enhances real anchor links: all screenshots remain available without JavaScript. Motion respects reduced-motion preferences. Product facts and visual decisions are documented in `PRODUCT.md` and `DESIGN.md`.

English pages are the source templates. After editing them or translations in `locales/ui.cjs` and `locales/legal.cjs`, run `node tools/localize.cjs` to regenerate `/et/`, `/ru/`, language links, alternate tags and the sitemap. The generator rejects untranslated interface text and changed legal paragraph counts. The generated HTML works without JavaScript. `assets/language.js` remembers an explicit language selection locally, preserves shared-stop query parameters and page fragments, and restores the preference when visiting an English entry point. Choosing EN explicitly resets that preference. Localized URLs always take priority over the saved choice.

Legal source fingerprints prevent silently reusing translations after changing an English document. After updating both legal translations to match an intentional source change, acknowledge it with `node tools/localize.cjs --update-legal-source`.

`home/index.html` retains the old homepage URL. `stop/?id=…` opens a shared stop through `strada://stop/…`. Keep `.well-known/assetlinks.json` and the in-app `strada-content.json` feed intact.
