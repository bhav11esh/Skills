import React, { useMemo } from "react";
import { useLocation } from "@docusaurus/router";
import { SkillsShell, SkillGrid, useSkillPreview } from "@site/src/components/skills";
import { searchSkills } from "@site/src/api/skills";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SkillsExplorePage() {
  const q = useQuery();
  const officialOnly = q.get("official") === "1";
  const query = q.get("q") || "";
  const { onOpen, drawer } = useSkillPreview();

  const results = useMemo(() => {
    let list = searchSkills(query);
    if (officialOnly) list = list.filter((s) => s.is_official);
    return list.slice(0, 120);
  }, [query, officialOnly]);

  return (
    <SkillsShell title="Explore skills" description="Search the agent skills catalog">
      <p style={{ color: "var(--cat-muted, var(--ifm-color-content-secondary))", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
        Showing {results.length} skills{officialOnly ? " (official)" : ""}
        {query ? ` for “${query}”` : ""}
      </p>
      <SkillGrid skills={results} onOpen={onOpen} />
      {drawer}
    </SkillsShell>
  );
}
