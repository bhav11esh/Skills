import React from "react";
import type { SkillItem } from "@site/src/api/skills";
import { categoryLabel } from "@site/src/api/skills";
import styles from "./skills.module.css";

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function SkillCard({ skill, onOpen }: { skill: SkillItem; onOpen: (s: SkillItem) => void }) {
  return (
    <button type="button" className={styles.card} onClick={() => onOpen(skill)}>
      <h3 className={styles.cardTitle}>{skill.display_name}</h3>
      <p className={styles.cardDesc}>{skill.description}</p>
      <div className={styles.cardMeta}>
        {skill.is_official ? <span className={styles.badge}>Official</span> : null}
        <span>{categoryLabel(skill.category)}</span>
        <span>·</span>
        <span>★ {formatStars(skill.metadata?.stars || 0)}</span>
        {skill.authors?.[0] ? (
          <>
            <span>·</span>
            <span>{skill.authors[0]}</span>
          </>
        ) : null}
      </div>
    </button>
  );
}
