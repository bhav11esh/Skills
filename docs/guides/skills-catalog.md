---
sidebar_label: Skills catalog
title: Skills catalog | Auto-updated agent skills
description: Browse agent skills alongside prompts. Catalog syncs weekly from open GitHub sources.
---

# Skills catalog

The **Skills** section lists agent skills (Claude / Cursor-style `SKILL.md` packages) collected from public GitHub repositories.

## How it stays updated

- Source allowlist: [`scripts/skills/sources.yaml`](https://github.com/rockbenben/ChatGPT-Shortcut/blob/main/scripts/skills/sources.yaml) (seeded from [TrueFoundry Skills Registry](https://github.com/truefoundry/tfy-skills-repo))
- Builder: `python scripts/skills/build_catalog.py` fetches each `SKILL.md` body for offline **Copy**
- GitHub Action: `.github/workflows/skills-sync.yml` runs weekly (and on manual dispatch)

## Propose a new source

Open a PR that adds a GitHub repo URL under `scripts/skills/sources.yaml`. Do not hand-edit the generated `skills-index.json` or `static/skills-data/` files.

## Attribution

Skill content belongs to upstream authors. Each skill links back to its GitHub source. Scanner tooling is adapted from TrueFoundry under Apache-2.0 (see `scripts/skills/NOTICE`).
