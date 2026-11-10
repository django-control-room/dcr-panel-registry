# Agent instructions

The panel directory for Django Control Room at
[panels.djangocontrolroom.com](https://panels.djangocontrolroom.com), part of the
[djangocontrolroom.com](https://djangocontrolroom.com) family of sites.

## Static site, no backend

- Hosted on Cloudflare Pages as static HTML. Don't add a server, API, database, auth or functions.
- Content is resolved at build time:
  - panels come from `panels/`;
  - wishlist ideas come from GitHub issues, via `wishlist-from-github.ts`.
- Changes reach the site through a rebuild.
- The browser only fetches public read-only JSON, like stats.djangocontrolroom.com, and only on
  the pages that need it.
- Secrets live in the build environment, never in the repo or bundle.
- If build-time data can't load, fail the build. Cloudflare then keeps the last deploy live.

## vite-react-ssg

- Pages are prerendered with vite-react-ssg, like the main site. Routes live in `src/App.tsx`.
  Dynamic routes list their paths in `getStaticPaths`.
- Content, title and description must be in the prerendered HTML. Set the title and description
  with `Seo`.
- Browser-only code (`window`, `localStorage`, fetched stats) runs after mount, so the first
  render matches the prerendered HTML.
- Stay on react-router-dom v6. Don't add another router, meta framework or SSR server.

## Consistent with djangocontrolroom.com

The site should look and read like the main site, `../dj-control-room-website`. Its AGENTS.md has
the full rules.

- Use the tokens in `src/styles.css`. Don't hardcode colors. Support light and dark mode.
- Reuse existing components and the main site's component language: rounded cards, pill badges,
  whitespace.
- When the main site's look changes, follow it.
- Writing: no em dashes, short specific sentences, no hype.

## Commands

```sh
npm run dev     # skips invalid panel files
npm run lint
npm run build   # fails on invalid panel files; needs GITHUB_TOKEN while the repo is private
```
