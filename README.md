# Django Control Room Panel Registry

This codebase powers [djangocontrolroom.com/panels](https://djangocontrolroom.com/panels/), the directory
of panels for [Django Control Room](https://djangocontrolroom.com).

DCR panels are operational tools built right inside the Django admin. Any published tool using the DCR
framework can have an entry in this repo and pull requests are welcome.

## List your panel

Every panel is one markdown file in [`panels/`](panels/). To add yours, open a pull request that
adds a single file named after your PyPI package, for example `panels/dj-example-panel.md`:

```markdown
---
label: Example
tagline: One line about what it does
categories:
  - Developer tooling
repository: https://github.com/you/dj-example-panel
docs: https://you.github.io/dj-example-panel/
maintainer: Your name
first_release: 2025-01-15
highlights:
  - A short point about what the panel gives you
  - Another one
---

A short description of your panel, in plain prose.
```

Your panel needs to be published on PyPI with public source code. Once the pull request is merged,
it appears at `djangocontrolroom.com/panels/<package-name>`.

[CONTRIBUTING.md](CONTRIBUTING.md) lists every field, the categories and the rules. A check runs on
each pull request and names any field that needs fixing.

### Add live download stats (optional)

Panel pages show PyPI download counts read from
[stats.djangocontrolroom.com](https://stats.djangocontrolroom.com), which is built from the
[dcr-stats](https://github.com/django-control-room/dcr-stats) repo. To get live stats on your panel's
page, open a second small pull request there that adds your package name to the `packages` list in
`pypi-tracker.toml`:

```toml
packages = [
    # ...
    "dj-example-panel",
]
```

Until your package is tracked, your panel page simply shows no download stats.

## The wishlist

Panel ideas are GitHub issues labelled `wishlist`, opened from the "Panel idea" issue form. A 👍
on the issue is a vote; label it `planned` or `in progress` to show its status, and close it as
completed once the panel ships (closing as not planned hides it). The build reads the issues from
the GitHub API, so the site shows new ideas and votes after its next build.

## Run it locally

```sh
npm install
npm run dev     # development server
npm run build   # checks every file in panels/ and builds the static site into dist/
```
