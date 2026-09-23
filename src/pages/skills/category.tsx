import React, { useMemo } from "react";
import { useLocation } from "@docusaurus/router";
import { SkillsShell, SkillGrid, useSkillPreview } from "@site/src/components/skills";
import { categoryLabel, getSkillsByCategory } from "@site/src/api/skills";

export default function SkillsCategoryPage() {
  const { search } = useLocation();
  const slug = useMemo(() => new URLSearchParams(search).get("slug") || "", [search]);
  const { onOpen, drawer } = useSkillPreview();
  const skills = useMemo(() => (slug ? getSkillsByCategory(slug) : []), [slug]);

  return (
    <SkillsShell title={slug ? categoryLabel(slug) : "Category"} description={`Skills in ${slug}`}>
      {!slug ? <p>Missing category.</p> : null}
      <SkillGrid skills={skills} onOpen={onOpen} />
      {drawer}
    </SkillsShell>
  );
}
