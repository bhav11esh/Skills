import React from "react";
import { SkillsShell, SkillGrid, useSkillPreview } from "@site/src/components/skills";
import { getBestSkills } from "@site/src/api/skills";

export default function SkillsBestPage() {
  const { onOpen, drawer } = useSkillPreview();
  const skills = getBestSkills(96);
  return (
    <SkillsShell title="Best skills" description="Top agent skills by GitHub stars">
      <SkillGrid skills={skills} onOpen={onOpen} />
      {drawer}
    </SkillsShell>
  );
}
