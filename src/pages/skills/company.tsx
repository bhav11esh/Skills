import React, { useMemo } from "react";
import { useLocation } from "@docusaurus/router";
import { SkillsShell, SkillGrid, useSkillPreview } from "@site/src/components/skills";
import { getSkillsByCompany } from "@site/src/api/skills";

export default function SkillsCompanyPage() {
  const { search } = useLocation();
  const id = useMemo(() => new URLSearchParams(search).get("id") || "", [search]);
  const { onOpen, drawer } = useSkillPreview();
  const skills = useMemo(() => (id ? getSkillsByCompany(id) : []), [id]);

  return (
    <SkillsShell title={id || "Publisher"} description={`Skills from ${id}`}>
      {!id ? <p>Missing publisher id.</p> : null}
      <SkillGrid skills={skills} onOpen={onOpen} />
      {drawer}
    </SkillsShell>
  );
}
