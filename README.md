# hive-landing

Landing page and download site for **HIVE** — a macOS desktop app for managing
OpenCode CLI coding sessions with live CPU/RAM insights, deep theming (including
a dynamic dock icon), and reliable multi-session control.

A single static page built with plain **HTML, CSS, and vanilla JavaScript** — no
build step, no framework, no dependencies. Deployed with GitHub Pages straight
from the `main` branch root.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The page markup |
| `styles.css` | Deep-space theme (cyan + violet), layout, and effects |
| `main.js` | Starfield, scroll reveals, and abstract data-viz (no fake screenshots) |
| `favicon.svg` | Hexagon hive mark |

## Local preview

Just open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Download links

The download buttons point at the HIVE v1.0.0 release assets:

- Apple Silicon: `HIVE-1.0.0-arm64.dmg`
- Intel: `HIVE-1.0.0.dmg`

Both live on the [app repository releases](https://github.com/LunaHook/hive/releases/tag/v1.0.0).
