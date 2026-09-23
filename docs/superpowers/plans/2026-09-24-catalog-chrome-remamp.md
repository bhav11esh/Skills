# Catalog Chrome Remamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shared inspired catalog chrome (custom TopBar + footer) for Prompts and Skills; Prompts home restructured to hero + search + featured; Skills restyled to the same tokens.

**Architecture:** `CatalogShell` wraps catalog pages; hide Infima navbar on those routes via Navbar swizzle; design tokens in CSS; Prompts HomePage refactored into sectioned layout without changing data/favorite/copy behavior; Skills drop in-page mode switch.

**Tech Stack:** Docusaurus 3, React 19, CSS modules + CSS variables, existing antd SearchBar / prompt stack, existing skills components.

**Spec:** `docs/superpowers/specs/2026-09-24-catalog-chrome-remamp-design.md`

## Global Constraints

- Inspired look only — no skills.rest logo, Inter-as-brand, or pixel-identical clone CSS
- Brand: AiShort (`/img/logo.svg`)
- Secondary destinations (docs, community-prompts, user, feedback) in footer only
- Prompt and skills data planes unchanged
- Hide default navbar on `/` and `/skills/*` only

## File map

| File | Role |
|------|------|
| `src/css/catalog-tokens.css` | Shared design tokens |
| `src/components/catalog/CatalogTopBar.tsx` + `.module.css` | Custom top bar |
| `src/components/catalog/SiteFooter.tsx` + `.module.css` | Footer links |
| `src/components/catalog/CatalogShell.tsx` + `.module.css` | Shell wrapper |
| `src/theme/Navbar/index.tsx` | Return null on catalog routes |
| `src/components/HomePage.tsx` | Prompts sectioned home inside shell |
| `src/components/skills/SkillsShell.tsx` | Use CatalogShell; remove in-page mode switch |
| `src/components/skills/skills.module.css` | Align to tokens |
| `src/css/custom.css` | Import tokens |
| `docusaurus.config.js` | Slim navbar items optional (hidden on catalog anyway) |

---

### Task 1: Design tokens + CatalogShell chrome

**Files:**
- Create: `src/css/catalog-tokens.css`
- Create: `src/components/catalog/CatalogTopBar.tsx`, `CatalogTopBar.module.css`
- Create: `src/components/catalog/SiteFooter.tsx`, `SiteFooter.module.css`
- Create: `src/components/catalog/CatalogShell.tsx`, `CatalogShell.module.css`
- Create: `src/theme/Navbar/index.tsx`
- Modify: `src/css/custom.css` (import tokens)

**Interfaces:**
- Produces: `CatalogShell({ mode, children })` where `mode: "prompts" | "skills"`
- Produces: TopBar mode links — prompts: `#featured`, `#browse`; skills: `/skills`, `/skills/explore`, `/skills/best`, `/skills/companies`

- [ ] **Step 1:** Add `catalog-tokens.css` with variables for `--cat-bg`, `--cat-surface`, `--cat-text`, `--cat-muted`, `--cat-accent`, `--cat-radius`, `--cat-font-display`, `--cat-font-body`, noise/gradient helpers. Import from `custom.css`.
- [ ] **Step 2:** Implement `CatalogTopBar`, `SiteFooter`, `CatalogShell`.
- [ ] **Step 3:** Swizzle Navbar: if pathname is `/` or starts with `/skills` (locale-aware via `useBaseUrl` / strip locale prefix), return `null`; else render `@theme-original/Navbar`.
- [ ] **Step 4:** Smoke: wrap a temporary page or SkillsShell; confirm Infima nav hidden on `/skills`, footer links work.
- [ ] **Step 5:** Commit `feat(catalog): add CatalogShell tokens and top bar`

---

### Task 2: Wire Skills into CatalogShell

**Files:**
- Modify: `src/components/skills/SkillsShell.tsx`
- Modify: `src/components/skills/skills.module.css`
- Modify: `src/components/skills/CatalogModeSwitch.tsx` (optional keep for non-shell use or delete if unused)

- [ ] **Step 1:** Replace `Layout` + in-page mode switch with `CatalogShell mode="skills"` (CatalogShell includes Layout or wraps Layout).
- [ ] **Step 2:** Restyle hero/cards/chips to catalog tokens.
- [ ] **Step 3:** Verify `/skills`, explore, best, companies, preview copy.
- [ ] **Step 4:** Commit `feat(skills): adopt CatalogShell chrome`

---

### Task 3: Prompts home restructure

**Files:**
- Modify: `src/components/HomePage.tsx`
- Create or modify: `src/components/HomePage/styles.module.css` (or existing styles)

- [ ] **Step 1:** Wrap HomePage content in `CatalogShell mode="prompts"`.
- [ ] **Step 2:** Replace `ShowcaseHeader` with hero (AiShort + tagline + stats) + promote `SearchBar` into hero.
- [ ] **Step 3:** Add `#featured` section (logged-in favorites strip and/or popular tag row) and `#browse` section wrapping existing filters + cards.
- [ ] **Step 4:** Preserve filters, infinite scroll, modal, favorite, vote, MySpace views.
- [ ] **Step 5:** Smoke desktop/mobile; commit `feat(prompts): sectioned home under CatalogShell`

---

### Task 4: Polish + regression

- [ ] **Step 1:** Locale + color mode on TopBar.
- [ ] **Step 2:** Footer links: `/docs`, `/community-prompts`, `/user`, `/feedback`.
- [ ] **Step 3:** Confirm no skills.rest strings/assets.
- [ ] **Step 4:** Commit `chore(catalog): polish chrome remamp`

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| CatalogShell + TopBar | 1 |
| Hide Infima navbar on catalog | 1 |
| Footer secondary links | 1 |
| Skills restyle / mode in TopBar | 2 |
| Prompts hero + search + featured + browse | 3 |
| Inspired tokens / AiShort brand | 1–3 |
| Data planes unchanged | 2–3 (no API changes) |
| Testing checklist | 4 |
