# Testpilot landing and docs

The public website for Testpilot: the landing page and the user documentation, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) and published to GitHub Pages at https://papaya13-03.github.io/testpilot-landing/.

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | The landing page (its own layout and animations) |
| `src/content/docs/` | Documentation pages (Markdown) |
| `src/styles/docs.css` | Testpilot colours and type for the docs |
| `src/assets/`, `public/` | Logo and favicon |

```sh
npm install
npm run dev       # http://localhost:4321/testpilot-landing/
npm run build     # static site in dist/
```

Every push to `main` builds and deploys the site (`.github/workflows/deploy.yml`).
Only publish documentation that is fine for anyone on the internet to read.
