# Strada website

Static public website and shared-stop handler for Strada, hosted on GitHub Pages.

- [Website](https://stasmega.github.io/strada-web/)
- [Privacy Policy](https://stasmega.github.io/strada-web/privacy/)
- [Terms of Service](https://stasmega.github.io/strada-web/terms/)
- [Account deletion](https://stasmega.github.io/strada-web/delete-account/)

No build step, runtime dependencies, tracking scripts or external fonts. Serve the repository as a static directory, for example with `python -m http.server 4173 --bind 127.0.0.1`.

`home/index.html` retains the old homepage URL. `stop/?id=…` opens a shared stop through `strada://stop/…`. Keep `.well-known/assetlinks.json` and the in-app `strada-content.json` feed intact.
