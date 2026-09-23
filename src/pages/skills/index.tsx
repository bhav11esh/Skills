import React from "react";
import Link from "@docusaurus/Link";
import { SkillsShell, SkillGrid, useSkillPreview } from "@site/src/components/skills";
import { getOfficialSkills, getBestSkills, getSkillsMeta, categoryLabel } from "@site/src/api/skills";
import styles from "@site/src/components/skills/skills.module.css";

export default function SkillsHomePage() {
  const { onOpen, drawer } = useSkillPreview();
  const meta = getSkillsMeta();
  const official = getOfficialSkills(12);
  const best = getBestSkills(12);

  return (
    <SkillsShell title="Skills" description="Browse and copy agent skills" showHero>
      <div className={styles.sectionTitle}>
        <span>Official skills</span>
        <Link to="/skills/explore?official=1">View all →</Link>
      </div>
      <SkillGrid skills={official} onOpen={onOpen} />

      <div className={styles.sectionTitle}>
        <span>Best skills</span>
        <Link to="/skills/best">View all →</Link>
      </div>
      <SkillGrid skills={best} onOpen={onOpen} />

      <div className={styles.sectionTitle}>
        <span>Explore by domain</span>
      </div>
      <div className={styles.categoryGrid}>
        {meta.categories.map((c) => (
          <Link key={c.id} className={styles.categoryCard} to={`/skills/category?slug=${encodeURIComponent(c.slug)}`}>
            <strong>{categoryLabel(c.id)}</strong>
            <span>{c.count} skills</span>
          </Link>
        ))}
      </div>
      {drawer}
    </SkillsShell>
  );
}
