# Search metadata and FAQ validation

14 November 2026

- Canonical, Open Graph and reciprocal EN/ET/RU/x-default alternatives use
  `https://stradaapp.eu/` across all 18 generated pages. Legacy `/home/` pages
  continue to canonicalize to their language's main page.
- The sitemap contains the 12 existing indexable pages on the custom domain.
  Shared-stop handlers remain outside the sitemap. `robots.txt` declares the
  sitemap and is included in the existing Pages deployment artifact.
- Localized factual descriptions and five FAQ answers appear in the HTML.
  Native disclosures work without JavaScript and expose keyboard controls.
- MobileApplication JSON-LD uses the same app ID on all translations, a Google
  Play identity link and a separate developer identity. Free download is stated
  without inventing ratings, reviews or premium pricing.
- The translation generator is idempotent and retains legal source fingerprints.
  Cookie-notice source copy is aligned with the existing main-page wording so
  regeneration does not restore older consent-button labels.
- `node tools/localize.cjs`: passed, all translations covered.
- `node --test tests/*.test.cjs`: 23 passed, including existing stop, storage,
  legal and Google verification checks and the new search-metadata checks.
- Browser preview: EN and RU on a narrow viewport, ET on a desktop viewport;
  answers open correctly and language switching preserves `#faq`. Desktop
  document width does not exceed the viewport.
- Main pages explicitly declare the existing 64x64 PNG favicon, with the ICO
  fallback accurately labelled 32x32. Live GET checks returned HTTP 200 for the
  home page and all three favicon formats. Search-result refresh remains under
  Google's control and may require a homepage recrawl.

After merge/deployment, use Search Console to submit the sitemap and inspect
the three main language URLs. Those account actions were not performed here.
Google's Rich Results Test can report missing review/rating data: do not add
fabricated ratings to satisfy it. Schema markup alone does not guarantee a
rich result, indexing or AI Overview inclusion.

References:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/software-app
