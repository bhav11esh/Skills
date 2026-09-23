# Catalog Chrome Remamp — Design

**Date:** 2026-09-24  
**Status:** Approved (approach + §1; user directed implement)  
**Product:** AiShort — Prompts + Skills unified catalog

## Goal

One inspired (not pixel-clone) visual system for the whole catalog chrome: custom top bar, Prompts home restructured like skills.rest (hero + search + featured sections), Skills restyled to the same tokens, secondary destinations in the footer only.

## Decisions

| Topic | Choice |
|--------|--------|
| Scope | Nav + Prompts + Skills |
| Approach | Shared `CatalogShell` |
| Prompts | Keep features; home → hero + search + featured sections |
| Top nav | Custom bar; hide Docusaurus navbar on catalog surfaces |
| Secondary links | Footer only (docs, community, account, feedback) |
| Look | Inspired — same IA/hierarchy; own type, color, brand |
| Legal | Do not ship skills.rest branding, assets, or pixel-identical CSS |

## Architecture

```
CatalogShell
├── TopBar
│   ├── Logo → /
│   ├── Mode: Prompts | Skills
│   ├── Mode links (Prompts: Home/#browse; Skills: Explore, Best, Companies)
│   ├── Locale control
│   └── Color mode toggle
├── Main (page body)
└── SiteFooter
    ├── docs, community-prompts, user/account, feedback
    └── optional existing legal/social links
```

- Catalog routes (`/`, `/skills/*`) wrap content in `CatalogShell` and hide Infima navbar via CSS / Layout props.
- Docs, auth, feedback, user pages keep `@theme/Layout`; reuse `SiteFooter` for continuity (no full TopBar required).
- Data planes unchanged: prompt JSON / Strapi / favorites; `skills.json` + weekly scanner.

## Components

| Unit | Responsibility |
|------|----------------|
| `catalogTokens.css` | CSS variables: surfaces, text, accent, radius, type scale, motion |
| `CatalogShell` | TopBar + main + SiteFooter; `mode: prompts \| skills` |
| `CatalogTopBar` | Logo, mode switch, mode links, lang, theme |
| `SiteFooter` | Secondary destinations |
| `PromptsHome` / HomePage refactor | Hero, search, featured rows, then existing filter/card/modal stack |
| Skills pages | Keep routes; consume tokens; drop duplicate mode switch from page hero (lives in TopBar) |

## Prompts home (restructure)

1. **Hero** — product name + short line; count/stat strip optional.
2. **Search** — existing prompt search wired into hero search field.
3. **Featured sections** — e.g. Favorites (if logged in), Popular / tagged rows, then full browse.
4. **Browse** — existing filters + infinite cards + detail modal + copy/favorite/vote — behavior preserved.

Mode links on Prompts: soft anchors or chips to Featured / Browse (no fake Explore/Best routes).

## Skills (align)

- Routes unchanged: `/skills`, `/explore`, `/best`, `/companies`, etc.
- Remove in-page `CatalogModeSwitch` from Skills hero; TopBar owns mode.
- Cards, drawer, nav chips restyle to tokens; IA stays.

## Visual direction

- Avoid purple-on-white AI cliché and skills.rest blue/Inter clone as brand identity.
- Prefer one clear accent, expressive type (not Inter/Roboto/Arial/system alone), subtle atmosphere (gradient/noise/pattern — light touch).
- Dark/light both supported via existing color mode.
- Brand mark: keep **AiShort** wordmark/logo; no “skills.rest” naming.

## Navbar hide

- On catalog pages: `navbar: { hideOnScroll }` insufficient — use `customFields`/page wrapper class `catalog-chrome` + CSS `#__docusaurus > nav.navbar { display: none }` scoped, or Layout `noNavbar` if available via swizzle.
- Prefer a thin `src/theme/Navbar/index.tsx` wrapper that returns `null` when `pathname` is `/` or starts with `/skills`.

## Out of scope

- Pixel-perfect skills.rest clone / shipping clone assets
- Changing skills scanner, `skills.json` schema, or prompt data APIs
- New account/auth flows
- Rewriting community-prompts page IA (footer link only; optional later)

## Testing

- Desktop + mobile: TopBar, mode switch, Prompts search + featured + browse, Skills explore/copy
- Locale switch still works (prod build; dev alert unchanged)
- Color mode toggle
- Footer links resolve
- Prompts favorites/copy/filters regression
- No skills.rest logo/strings in UI

## Reference

- Visual IA: local OD project `0a3f4107-ccae-454a-ac9b-ce076a095078` (evaluation only)
- Prior skills registry spec: `docs/superpowers/specs/2026-09-24-skills-registry-design.md`
