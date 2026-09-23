import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import styles from "./skills.module.css";

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && (/^[a-z]{2}$/.test(first) || first === "ind" || /^zh-Han[st]$/.test(first))) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname || "/";
}

/** Centered skills search — on home navigates to Explore; on Explore syncs `?q=` live. */
export function SkillsSearch() {
  const history = useHistory();
  const location = useLocation();
  const path = stripLocalePrefix(location.pathname);
  const isExplore = path.startsWith("/skills/explore");
  const urlQ = new URLSearchParams(location.search).get("q") || "";
  const [value, setValue] = useState(urlQ);

  useEffect(() => {
    setValue(urlQ);
  }, [urlQ]);

  const commit = (raw: string) => {
    const q = raw.trim();
    if (isExplore) {
      const next = new URLSearchParams(location.search);
      if (q) next.set("q", q);
      else next.delete("q");
      const search = next.toString();
      const current = location.search.replace(/^\?/, "");
      if (search !== current) {
        history.replace({ ...location, search });
      }
      return;
    }
    history.push(q ? `/skills/explore?q=${encodeURIComponent(q)}` : "/skills/explore");
  };

  return (
    <form
      className={styles.searchBar}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        commit(value);
      }}>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="Search agent skills…"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          if (isExplore) commit(next);
        }}
        aria-label="Search agent skills"
      />
    </form>
  );
}
