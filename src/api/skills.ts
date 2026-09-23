/**
 * Skills catalog helpers — lists use skills-index.json; bodies lazy-load from /skills-data/<id>.json
 */
import skillsIndex from "@site/src/data/skills-index.json";
import skillsMeta from "@site/src/data/skills-meta.json";

export interface SkillSource {
  repo?: string;
  path?: string;
}

export interface SkillItem {
  id: string;
  display_name: string;
  description: string;
  authors: string[];
  is_official: boolean;
  tags: string[];
  category: string;
  source: SkillSource;
  metadata: { stars: number };
  added_at?: string;
  source_url?: string;
  body?: string;
}

export interface SkillsMeta {
  total: number;
  with_body: number;
  official: number;
  categories: { id: string; slug: string; count: number }[];
  companies: { id: string; name: string; count: number; stars: number; official: number }[];
  generated_at?: string;
}

const ALL: SkillItem[] = skillsIndex as SkillItem[];

export function getSkillsMeta(): SkillsMeta {
  return skillsMeta as SkillsMeta;
}

export function getAllSkills(): SkillItem[] {
  return ALL;
}

export function getSkillById(id: string): SkillItem | undefined {
  return ALL.find((s) => s.id === id);
}

export function getOfficialSkills(limit = 24): SkillItem[] {
  return ALL.filter((s) => s.is_official).slice(0, limit);
}

export function getBestSkills(limit = 48): SkillItem[] {
  return [...ALL].sort((a, b) => (b.metadata?.stars || 0) - (a.metadata?.stars || 0)).slice(0, limit);
}

export function getSkillsByCategory(category: string): SkillItem[] {
  return ALL.filter((s) => s.category === category);
}

export function getSkillsByCompany(companyId: string): SkillItem[] {
  const needle = companyId.toLowerCase();
  return ALL.filter((s) => {
    const author = (s.authors?.[0] || "").toLowerCase();
    const owner = (s.source?.repo || "").split("/")[0]?.toLowerCase();
    return author === needle || owner === needle;
  });
}

export function searchSkills(query: string, category?: string): SkillItem[] {
  const q = query.trim().toLowerCase();
  return ALL.filter((s) => {
    if (category && s.category !== category) return false;
    if (!q) return true;
    const hay = [s.display_name, s.description, s.id, ...(s.tags || []), ...(s.authors || [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export async function fetchSkillBody(id: string): Promise<{ body: string; source_url?: string; display_name?: string }> {
  const res = await fetch(`/skills-data/${encodeURIComponent(id)}.json`);
  if (!res.ok) {
    return { body: "" };
  }
  return res.json();
}

export const CATEGORY_LABELS: Record<string, string> = {
  coding: "Software Engineering",
  design: "Design & Creative",
  marketing: "Marketing & Sales",
  productivity: "Productivity",
  science: "Science & Research",
  "data-ai": "Data & AI",
  creative: "Creative",
  business: "Business",
  legal: "Legal & Compliance",
  health: "Health",
  miscellaneous: "Other",
};

export function categoryLabel(id: string): string {
  return CATEGORY_LABELS[id] || id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
