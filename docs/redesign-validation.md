# Landing redesign validation

2026-11-08. Light urban direction selected by the owner in chat.

- All seven existing Node tests passed (Google verification and shared-stop handoff).
- Local asset and link resolution passed for both `/` and `/home/`.
- Browser width checks at 1440, 1024, 768, 390 and 320px found no document overflow or out-of-bounds headings, primary controls or phone frames.
- Real screenshots loaded successfully. Feature links switch the active image and preserve a fragment URL. Route and departure states were exercised.
- Mobile navigation opens, follows its anchor and closes. The legacy `/home/` route resolves the new CSS and logo correctly.
- Browser warning/error log was empty during these interactions.
- Independent visual review of full desktop and mobile captures returned `ship`, with no material findings. Review scope: screenshots and changed source, not a second browser test.

No build step or new runtime dependencies. Existing legal pages, shared-stop code, Android association and application content feed are unchanged. Verification used desktop browser viewport sizes, not physical Android hardware. Google Play and mail links retain the existing destinations; no store installation or email submission was performed.
