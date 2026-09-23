# Skills + Prompts Unified Catalog Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox syntax.

**Goal:** Ship a skills.rest-style Skills catalog beside AiShort prompts, with weekly SKILL.md body snapshots and offline Copy.

**Architecture:** Build-time / CI scanner writes `src/data/skills.json`; Docusaurus pages under `/skills/*` consume it; navbar Prompts|Skills switch; prompts HomePage unchanged in v1.

**Tech Stack:** Docusaurus 3, React 19, antd, Python 3 scanner (PyYAML + urllib), GitHub Actions.

**Spec:** [docs/superpowers/specs/2026-09-24-skills-registry-design.md](../specs/2026-09-24-skills-registry-design.md)

## Global Constraints

- Default locale: English
- Do not pixel-clone skills.rest branding; match IA/hierarchy
- Do not remamp Prompts UI in v1
- Attribute upstream skill sources; Apache-2.0 notice for vendored TF scripts
- On sync failure, keep last good `skills.json`

---

### Task 1: Skills data pipeline

**Files:**
- `scripts/skills/NOTICE` (attribution)
- `scripts/skills/sources.yaml` (seed from TF)
- `scripts/skills/build_catalog.py` (metadata + body fetch → `src/data/skills.json`)
- `scripts/skills/requirements.txt`
- `.github/workflows/skills-sync.yml`
- `src/data/skills.json` (generated)
- `src/data/skills-meta.json` (optional derived: categories, companies counts)

**Steps:**
- [ ] Seed sources + build script that reads TF catalog or scans sources
- [ ] Fetch SKILL.md bodies; strip frontmatter; write skills.json
- [ ] Add weekly workflow
- [ ] Commit generated catalog (or regenerate in CI)

### Task 2: Skills API helpers (client)

**Files:**
- `src/api/skills.ts` — load skills, search, filter by category/company, getById
- `src/data/skillsCategories.ts` — category slug labels for UI

### Task 3: Skills UI

**Files:**
- `src/css/skills.css` — skills.rest-inspired layout tokens (product brand)
- `src/components/skills/*` — SkillCard, SkillPreviewDrawer, SkillsSearch, SkillsShell, ModeSwitch
- `src/pages/skills/index.tsx` (+ explore, best, companies, company, category, skill detail)
- Navbar items in `docusaurus.config.js`

### Task 4: Mode switch + prompts untouched

**Files:**
- ModeSwitch linking `/` ↔ `/skills`
- Ensure HomePage has no Skills visual remamp

### Task 5: Docs + verify

- Short docs note under `docs/guides/` or skills contribute blurb
- Smoke: yarn start, open /skills, copy, / prompts still works
