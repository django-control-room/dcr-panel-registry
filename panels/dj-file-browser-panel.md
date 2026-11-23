---
label: File Browser
tagline: Browse your project's files from Django admin
categories:
  - Developer tooling
repository: https://github.com/taufanbudiman/dj-file-browser-panel
maintainer: Taufan Budiman
first_release: 2026-11-20
screenshot:
  file: dj-file-browser-panel.png
  alt: A directory listing under MEDIA_ROOT showing folders and files with sizes and modified times
highlights:
  - Browse MEDIA_ROOT, STATIC_ROOT, and custom roots
  - Breadcrumbs and pagination for deep, large directories
  - File details with size, modified time, and MIME type
  - Optional preview for text, images, and PDFs
  - Strictly read-only with path sandboxing and symlink escape protection
  - No models or migrations; supports admin dark mode
---

Answer "did my upload land?" in two clicks. Browse directories under `MEDIA_ROOT`, `STATIC_ROOT`, or any configured root, check file sizes and modified times, and preview small text files, images, and PDFs, all without shell access.

The panel is strictly read-only. There is no upload, delete, rename, or chmod. Every path is resolved and must stay inside a configured root, so traversal and symlink escapes are rejected. It ships with no models and no migrations.
