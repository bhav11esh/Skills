import React, { useEffect, useState } from "react";
import { Drawer, Button, Space, Spin, Typography, message } from "antd";
import copy from "copy-text-to-clipboard";
import type { SkillItem } from "@site/src/api/skills";
import { fetchSkillBody } from "@site/src/api/skills";
import styles from "./skills.module.css";

const { Paragraph, Title } = Typography;

export function SkillPreviewDrawer({
  skill,
  open,
  onClose,
}: {
  skill: SkillItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!skill || !open) return;
    let cancelled = false;
    setLoading(true);
    setBody("");
    fetchSkillBody(skill.id)
      .then((data) => {
        if (cancelled) return;
        setBody(data.body || "");
        setSourceUrl(data.source_url || skill.source_url);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skill, open]);

  const handleCopy = () => {
    if (!body) {
      message.warning("Skill body unavailable — open on GitHub instead");
      return;
    }
    const ok = copy(body);
    if (ok) message.success("Skill copied");
    else message.error("Copy failed");
  };

  return (
    <Drawer
      title={skill?.display_name || "Skill"}
      open={open}
      onClose={onClose}
      width={Math.min(720, typeof window !== "undefined" ? window.innerWidth - 24 : 720)}
      destroyOnClose
      extra={
        <Space>
          {sourceUrl ? (
            <Button href={sourceUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          ) : null}
          <Button type="primary" onClick={handleCopy} disabled={!body && !loading}>
            Copy
          </Button>
        </Space>
      }>
      {skill ? (
        <>
          <Paragraph type="secondary">{skill.description}</Paragraph>
          <Title level={5} style={{ marginTop: 16 }}>
            Instructions
          </Title>
          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <Spin />
            </div>
          ) : body ? (
            <pre className={styles.drawerBody}>{body}</pre>
          ) : (
            <Paragraph type="secondary">
              Body not in snapshot.{" "}
              {sourceUrl ? (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              ) : (
                "No source URL."
              )}
            </Paragraph>
          )}
        </>
      ) : null}
    </Drawer>
  );
}
