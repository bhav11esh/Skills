import React from "react";
import Link from "@docusaurus/Link";
import { SkillsShell } from "@site/src/components/skills";
import { getSkillsMeta } from "@site/src/api/skills";
import styles from "@site/src/components/skills/skills.module.css";

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function SkillsCompaniesPage() {
  const meta = getSkillsMeta();
  return (
    <SkillsShell title="Companies & publishers" description="Browse skills by publisher">
      <div className={styles.categoryGrid}>
        {meta.companies.map((c) => (
          <Link key={c.id} className={styles.categoryCard} to={`/skills/company?id=${encodeURIComponent(c.id)}`}>
            <strong>{c.name}</strong>
            <span>
              {c.count} skills · ★ {formatStars(c.stars)}
              {c.official ? " · official" : ""}
            </span>
          </Link>
        ))}
      </div>
    </SkillsShell>
  );
}
