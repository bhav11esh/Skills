import React from "react";
import Navbar from "@theme-original/Navbar";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function stripLocalePrefix(pathname: string, locales: readonly string[]): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && locales.includes(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname || "/";
}

function isCatalogRoute(pathname: string, locales: readonly string[]): boolean {
  const p = stripLocalePrefix(pathname, locales);
  return p === "/" || p === "" || p.startsWith("/skills");
}

/**
 * Hide Infima navbar on Prompts/Skills catalog surfaces — CatalogShell owns chrome there.
 */
export default function NavbarWrapper(props: React.ComponentProps<typeof Navbar>): React.ReactNode {
  const { pathname } = useLocation();
  const {
    i18n: { locales },
  } = useDocusaurusContext();

  if (isCatalogRoute(pathname, locales)) {
    return null;
  }

  return <Navbar {...props} />;
}
