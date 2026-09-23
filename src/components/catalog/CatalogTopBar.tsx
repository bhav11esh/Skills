import React, { useState } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useLocation } from "@docusaurus/router";
import clsx from "clsx";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarItem from "@theme/NavbarItem";
import type { CatalogMode } from "@site/src/components/catalog/types";
import styles from "./CatalogTopBar.module.css";

type ModeLink = { label: string; to: string; match?: (path: string) => boolean };

const PROMPTS_LINKS: ModeLink[] = [
  { label: "Featured", to: "/#featured" },
  { label: "Browse", to: "/#browse" },
];

const SKILLS_LINKS: ModeLink[] = [
  { label: "Home", to: "/skills", match: (p) => p === "/skills" || p === "/skills/" },
  { label: "Explore", to: "/skills/explore", match: (p) => p.startsWith("/skills/explore") },
  { label: "Best", to: "/skills/best", match: (p) => p.startsWith("/skills/best") },
  {
    label: "Companies",
    to: "/skills/companies",
    match: (p) => p.startsWith("/skills/companies") || p.startsWith("/skills/company"),
  },
];

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && (/^[a-z]{2}$/.test(first) || first === "ind" || /^zh-Han[st]$/.test(first))) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname || "/";
}

export function CatalogTopBar({ mode }: { mode: CatalogMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const path = stripLocalePrefix(pathname);
  const logoSrc = useBaseUrl("/img/logo.svg");
  const links = mode === "prompts" ? PROMPTS_LINKS : SKILLS_LINKS;

  const linkNodes = links.map((l) => {
    const active = l.match ? l.match(path) : false;
    return (
      <Link
        key={l.to}
        className={clsx(styles.link, active && styles.linkActive)}
        to={l.to}
        onClick={() => setMenuOpen(false)}>
        {l.label}
      </Link>
    );
  });

  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/" aria-label="AiShort home">
          <img className={styles.brandLogo} src={logoSrc} alt="" width={28} height={28} />
          <span className={styles.brandName}>AiShort</span>
        </Link>

        <div className={styles.modeSwitch} role="tablist" aria-label="Catalog mode">
          <Link
            role="tab"
            aria-selected={mode === "prompts"}
            className={clsx(styles.modeTab, mode === "prompts" && styles.modeTabActive)}
            to="/">
            Prompts
          </Link>
          <Link
            role="tab"
            aria-selected={mode === "skills"}
            className={clsx(styles.modeTab, mode === "skills" && styles.modeTabActive)}
            to="/skills">
            Skills
          </Link>
        </div>

        <nav className={styles.links} aria-label="Section links">
          {linkNodes}
        </nav>

        <div className={styles.actions}>
          <NavbarItem type="localeDropdown" items={[]} dropdownItemsBefore={[]} dropdownItemsAfter={[]} />
          <NavbarColorModeToggle className={styles.colorToggle} />
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      <nav className={clsx(styles.mobilePanel, menuOpen && styles.mobilePanelOpen)} aria-label="Mobile section links">
        {linkNodes}
      </nav>
    </header>
  );
}
