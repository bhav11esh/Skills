import React from "react";
import Link from "@docusaurus/Link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <p className={styles.heading}>Product</p>
          <Link className={styles.link} to="/">
            Prompts
          </Link>
          <Link className={styles.link} to="/skills">
            Skills
          </Link>
          <Link className={styles.link} to="/docs">
            Docs
          </Link>
        </div>
        <div className={styles.col}>
          <p className={styles.heading}>Community</p>
          <Link className={styles.link} to="/community-prompts">
            Community prompts
          </Link>
          <Link className={styles.link} to="/feedback">
            Feedback
          </Link>
          <a className={styles.link} href="https://github.com/rockbenben/ChatGPT-Shortcut" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className={styles.col}>
          <p className={styles.heading}>Account</p>
          <Link className={styles.link} to="/user">
            My account
          </Link>
        </div>
        <p className={styles.copy}>
          Copyright © {year} AiShort (ChatGPT Shortcut) · User content represents its authors
        </p>
      </div>
    </footer>
  );
}
