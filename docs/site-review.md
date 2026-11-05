# Strada website review — 5 November 2026

## Direction

- Product: public transport positions, stops and departures for people travelling in Tallinn.
- Character: calm, precise, urban.
- World: stop signs, departure boards and city maps.
- Moments: real app screenshots, with the map leading the first screen.
- Signature: the route line and its stop markers; Strada blue remains the accent.

## Audit and changes

1. Spacing: replaced inconsistent section and control spacing with a 4px rhythm, shared page widths and consistent touch targets.
2. Colour: removed blue-tinted shadows, unnecessary accent surfaces and faded decorative badges. Used one cool neutral ramp and the existing blue.
3. Icons: removed feature emoji; transport symbols share one stroke and size.
4. Copy: removed unqualified accuracy promises, filler marquees, placeholder contacts and username URLs. Described real transport features and data-feed limitations.
5. Type: used a local system sans-serif stack, limited weights and readable sizes. No third-party font requests.
6. Layout: split the hero between text and the real map screenshot. Retained the map, stop board, route view, everyday features, about and download sequence. Stacked sections in reading order on mobile.
7. Details: added visible keyboard focus, native mobile navigation, skip links, stable image dimensions, legal navigation and page metadata. Repaired screenshot paths on both home URLs.
8. Visuals: used supplied product screenshots rather than a generated scene. The transport map shows the product directly; no image-generation prompt was needed.
9. Motion: removed floating badges, marquees and decorative looping animations. Kept short, local hover feedback and honoured reduced-motion preferences.

The redesign follows **unslop by Damir Sokolovsky (@heydamir), CC BY 4.0**: https://github.com/heydamir/unslop/tree/main/skills/unslop.

Accessibility, metadata and motion guidance was also reviewed from the user-supplied `ui-skills-0.2.3.zip`. Existing plain HTML/CSS was retained.

## Public URLs

- Home: https://stasmega.github.io/strada-web/
- Privacy Policy: https://stasmega.github.io/strada-web/privacy/
- Terms of Service: https://stasmega.github.io/strada-web/terms/
- Account and data deletion: https://stasmega.github.io/strada-web/delete-account/

## Release notes for the owner

- The Google Play button intentionally targets `com.stasmega.strada`. The owner confirmed the app has not yet been published. A public listing is required before that link can open the app page. GitHub APK releases remain available as a secondary path.
- Support and privacy contact: `support.strada@gmail.com`, matching the Android feedback address and confirmed by the owner.
- The published app documents use the English Privacy Policy and Terms from the active `Strada2` project, updated 5 November 2026 for optional email/password accounts. The website-hosting section and external deletion instructions supplement those documents. Address search and journey calculation are local; optional analytics is disabled until consent. The public Android repository and old `Strada` workspace are older than the active app.
- The external deletion path is an email request. The owner must monitor the inbox, verify ownership and remove both the Firebase Authentication user and the Firestore `users/{uid}` record while respecting the deletion marker used to prevent stale sessions from recreating the account. The active app already provides in-app deletion and clears personal data on the requesting device.
- The app already displays bundled legal documents and optional analytics controls. Keep the app and website documents consistent when updating either. Publishing this site does not change Firebase, its rules or Analytics settings.
- Confirm the production Analytics retention configuration. The site does not change that configuration or guarantee Google Play approval.
- Preserve `strada-content.json` and `.well-known/assetlinks.json`: the app consumes the former and the latter contains Android link association data.
- The owner supplied five current screenshots and `stradalogolue.png`. All five screenshots are displayed, including the journey planner. The original transparent logo replaces the temporary route glyph in navigation and the footer. Web assets retain their content and are resized to suit their displayed dimensions.

## Sources checked

- Google Play User Data: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- Firebase privacy: https://firebase.google.com/support/privacy
- GitHub privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
