# Skills + Prompts Unified Catalog — Design

**Date:** 2026-09-24  
**Status:** Approved  
**Product:** AiShort (ChatGPT-Shortcut) + Skills registry

## Goal

One website where users can find **prompts** or **agent skills** quickly. Skills stay fresh via automated scanning (TrueFoundry-style), not hand-edited catalogs.

## Decisions

| Topic | Choice |
|--------|--------|
| IA | **Prompts \| Skills** tabs; mode-scoped search |
| Skills UI | **skills.rest** structure/look (Open Design clone as reference); rebrand to this product |
| Prompts v1 | Keep current AiShort UI/behavior |
| Prompts v2 | Visual unify to match Skills (after Skills ships) |
| Skill bodies | **Full snapshot** of `SKILL.md` in committed catalog for offline Copy |
| Sync | Adapt TrueFoundry scanner + `sources.yaml`; run **our** weekly Action |

## Architecture

```
sources.yaml → weekly scanner Action → src/data/skills.json (metadata + body)
                                         ↓
                    Skills routes (skills.rest IA) ←→ Prompts | Skills switch ←→ existing HomePage
```

- **Catalog, not store:** skill authorship stays upstream; we index, preview, and copy.
- **Prompts data plane unchanged:** `prompt_*.json`, community Strapi, favorites.

## Data model (`skills.json`)

Array of objects:

- `id`, `display_name`, `description`, `authors`, `is_official`, `tags`, `category`
- `source.repo`, `source.path`, `metadata.stars`, `added_at`
- `body` — markdown instructions with YAML frontmatter stripped (may be empty if fetch failed)
- `source_url` — GitHub tree/blob link for attribution

Size guard: if JSON exceeds ~3MB gzipped-equivalent concern, split to `skills-index.json` + `src/data/skills/bodies/<id>.json` with lazy load.

## UI (Skills)

Routes (default locale `en`):

- `/skills` — landing: official / best / explore-by-domain
- `/skills/explore` — search + filters
- `/skills/best` — by stars
- `/skills/companies`, `/skills/company/:id` — publisher browse
- `/skills/category/:slug` — category browse
- Skill preview drawer or `/skills/skill/:id` — body + **Copy** + GitHub link

Primary actions: open preview; **Copy** body to clipboard; open source on GitHub if body missing.

## Sync

- Scripts under `scripts/skills/` adapted from TrueFoundry (Apache-2.0), with attribution.
- Seed from their `sources.yaml` / catalog; extend to fetch each `SKILL.md` body.
- `.github/workflows/skills-sync.yml`: weekly cron + `workflow_dispatch`; never wipe last good catalog on failure.

## Out of scope (v1)

- skills.rest live APIs / accounts / pixel-identical branding
- Prompts visual remamp
- TrueFoundry S3 dependency

## Reference

- TrueFoundry: https://github.com/truefoundry/tfy-skills-repo  
- Visual IA: skills.rest (local OD clone project `0a3f4107-ccae-454a-ac9b-ce076a095078`)
