import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./skills.module.css";

export type CatalogMode = "prompts" | "skills";

export function CatalogModeSwitch({ active }: { active: CatalogMode }) {
  return (
    <div className={styles.modeSwitch} role="tablist" aria-label="Catalog mode">
      <Link
        role="tab"
        aria-selected={active === "prompts"}
        className={clsx(styles.modeTab, active === "prompts" && styles.modeTabActive)}
        to="/">
        Prompts
      </Link>
      <Link
        role="tab"
        aria-selected={active === "skills"}
        className={clsx(styles.modeTab, active === "skills" && styles.modeTabActive)}
        to="/skills">
        Skills
      </Link>
    </div>
  );
}
