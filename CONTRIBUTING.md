# Add your panel to the registry

Every panel in the registry is a single markdown file in [`panels/`](panels/). To list your
panel, open a pull request that adds one file. Nothing else in the repository needs to change.

## 1. Before you submit

- Your panel is published on PyPI and installs with `pip install <your-package>`.
- Its source code is public.
- It works with [Django Control Room](https://djangocontrolroom.com).

## 2. Create the file

Name the file after your PyPI package, in lowercase: `panels/<package-name>.md`. The file name
becomes the page address, for example `/panels/dj-redis-panel`, and the install command shown on
the site.

```markdown
---
label: Redis
tagline: Redis monitoring, inside your admin
categories:
  - Infrastructure
  - Performance
repository: https://github.com/you/dj-redis-panel
docs: https://you.github.io/dj-redis-panel/
maintainer: Your name or organization
first_release: 2024-11-01
highlights:
  - Live key browser with search and filtering
  - Memory and connection stats at a glance
---

A short description of what your panel does and who it is for. Write plain prose; separate
paragraphs with a blank line.
```

## 3. Fields

| Field           | Required | Rules                                                        |
| --------------- | -------- | ------------------------------------------------------------ |
| `label`         | yes      | Short display name, at most 30 characters.                   |
| `tagline`       | yes      | One line, at most 80 characters.                             |
| `categories`    | yes      | One or more categories from the list below, as a list.       |
| `repository`    | yes      | Full URL of the source code (GitHub, GitLab, Codeberg, ...). |
| `docs`          | no       | Full URL of the documentation.                               |
| `maintainer`    | yes      | Person or organization that maintains the panel.             |
| `first_release` | yes      | Date of the first PyPI release, written `YYYY-MM-DD`.        |
| `highlights`    | yes      | 1 to 6 short bullet points about what the panel gives you.   |
| _(body)_        | yes      | The description, written below the closing `---`.            |

**Categories:** Background jobs, Database, Developer tooling, Games, Infrastructure, Integrations,
Observability, Performance, Security. Case doesn't matter. A category not on this list is ignored
rather than rejected; a panel with no listed category still appears under "All". If none fits,
say so in your pull request.

Download counts are not part of the file. The site reads them from
[stats.djangocontrolroom.com](https://stats.djangocontrolroom.com) once your package is tracked
there. To get tracked, open a pull request to
[dcr-stats](https://github.com/django-control-room/dcr-stats) that adds your package name to the
`packages` list in `pypi-tracker.toml`.

## 4. Check it locally (optional)

```sh
npm install
npm run build
```

The build reads every file in `panels/` and stops with a message naming the file and field if
something is wrong. The same check runs automatically on your pull request.
