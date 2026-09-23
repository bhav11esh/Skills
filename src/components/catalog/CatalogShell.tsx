import React from "react";
import Layout from "@theme/Layout";
import type { CatalogMode } from "@site/src/components/catalog/types";
import { CatalogTopBar } from "./CatalogTopBar";
import { SiteFooter } from "./SiteFooter";
import styles from "./CatalogShell.module.css";

export type { CatalogMode };

export function CatalogShell({
  mode,
  title,
  description,
  children,
}: {
  mode: CatalogMode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Layout title={title} description={description} noFooter wrapperClassName="catalog-chrome">
      <div className={styles.shell}>
        <CatalogTopBar mode={mode} />
        <div className={styles.body}>{children}</div>
        <SiteFooter />
      </div>
    </Layout>
  );
}
