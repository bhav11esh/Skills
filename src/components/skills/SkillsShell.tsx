import React, { useCallback, useState } from "react";
import { App } from "antd";
import { CatalogShell } from "@site/src/components/catalog/CatalogShell";
import { SkillCard } from "./SkillCard";
import { SkillPreviewDrawer } from "./SkillPreviewDrawer";
import { SkillsSearch } from "./SkillsSearch";
import type { SkillItem } from "@site/src/api/skills";
import { getSkillsMeta } from "@site/src/api/skills";
import styles from "./skills.module.css";

export function SkillsShell({
  title,
  description,
  children,
  showHero = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  showHero?: boolean;
}) {
  const meta = getSkillsMeta();
  return (
    <CatalogShell mode="skills" title={title} description={description}>
      <App>
        <main className={styles.skillsPage}>
          {showHero ? (
            <div className={styles.hero}>
              <h1>Agent Skills Library</h1>
              <p>
                Browse and copy {meta.total.toLocaleString()} agent skills — curated from open GitHub sources, updated
                automatically.
              </p>
              <div className={styles.stats}>
                <span>{meta.total} skills</span>
                <span>·</span>
                <span>{meta.official} official</span>
                <span>·</span>
                <span>{meta.companies.length} publishers</span>
              </div>
              <SkillsSearch />
            </div>
          ) : (
            <div className={styles.hero}>
              <h1 className={styles.pageTitle}>{title}</h1>
              <SkillsSearch />
            </div>
          )}
          {children}
        </main>
      </App>
    </CatalogShell>
  );
}

export function useSkillPreview() {
  const [skill, setSkill] = useState<SkillItem | null>(null);
  const [open, setOpen] = useState(false);
  const onOpen = useCallback((s: SkillItem) => {
    setSkill(s);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => setOpen(false), []);
  const drawer = <SkillPreviewDrawer skill={skill} open={open} onClose={onClose} />;
  return { onOpen, drawer };
}

export function SkillGrid({ skills, onOpen }: { skills: SkillItem[]; onOpen: (s: SkillItem) => void }) {
  return (
    <div className={styles.grid}>
      {skills.map((s) => (
        <SkillCard key={s.id} skill={s} onOpen={onOpen} />
      ))}
    </div>
  );
}
