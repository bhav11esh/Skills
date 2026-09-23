import React, { useCallback, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { App } from "antd";
import { CatalogModeSwitch } from "./CatalogModeSwitch";
import { SkillCard } from "./SkillCard";
import { SkillPreviewDrawer } from "./SkillPreviewDrawer";
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
    <Layout title={title} description={description}>
      <App>
        <main className={styles.skillsPage}>
          <div className={styles.hero}>
            <CatalogModeSwitch active="skills" />
            {showHero ? (
              <>
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
              </>
            ) : (
              <h1 style={{ fontSize: "1.75rem", marginBottom: 8 }}>{title}</h1>
            )}
            <nav className={styles.navRow} aria-label="Skills sections">
              <Link className={styles.navChip} to="/skills">
                Home
              </Link>
              <Link className={styles.navChip} to="/skills/explore">
                Explore
              </Link>
              <Link className={styles.navChip} to="/skills/best">
                Best
              </Link>
              <Link className={styles.navChip} to="/skills/companies">
                Companies
              </Link>
            </nav>
          </div>
          {children}
        </main>
      </App>
    </Layout>
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
