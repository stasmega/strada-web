# Strada visual direction

Light urban design, approved in chat. A public transport app for Tallinn; the primary action is installation through the existing Google Play listing.

The visual language comes from clear city wayfinding: large legible lettering, purposeful route geometry, quiet surfaces and recognizable Strada blue. Actual application screenshots carry product demonstrations. Never invent ratings, users, prices, reviews or performance claims.

## Tokens

- Canvas `#fafbf8`; ink `#152421`; secondary `#5d6863`; dividers `#dce2dc`.
- Primary `#1649ed`; hover `#0732b9`; city surface `#e8eee2`; journey surface `#183ac8`.
- Locally hosted Manrope: 400 body, 600 controls, 800 display. Display tracking no tighter than -0.04em.
- Content maximum 1280px; desktop edges 56px, tablet 36px, mobile 20px.
- Buttons 10px radius, presentation frames 14–18px. Phone frames follow screenshot geometry.
- One opening animation, brief interaction feedback, full reduced-motion support. No scroll reveals, autoplay or third-party runtime libraries.

The landing page has isolated CSS so legal pages and shared-stop links retain their behavior. The `/home/` route serves the same landing page with corrected relative paths.
