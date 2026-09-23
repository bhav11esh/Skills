#!/usr/bin/env python3
"""Build src/data/skills.json with metadata + SKILL.md bodies.

Adapted from TrueFoundry Skills Registry (Apache-2.0):
https://github.com/truefoundry/tfy-skills-repo

Default mode: seed from TrueFoundry dist/ai-skills.json (or local cache),
then fetch each skill's SKILL.md body for offline copy/preview.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import ssl
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    import yaml  # noqa: F401 — reserved for future sources.yaml scan mode
except ImportError:
    yaml = None

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("skills.build")

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_FILE = REPO_ROOT / "src" / "data" / "skills.json"  # full snapshot (CI/cache)
INDEX_FILE = REPO_ROOT / "src" / "data" / "skills-index.json"  # no bodies — UI lists
META_FILE = REPO_ROOT / "src" / "data" / "skills-meta.json"
BODIES_DIR = REPO_ROOT / "static" / "skills-data"
DEFAULT_SEED = (
    "https://raw.githubusercontent.com/truefoundry/tfy-skills-repo/main/dist/ai-skills.json"
)

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n?", re.DOTALL)


def strip_frontmatter(text: str) -> str:
    text = text.lstrip("\ufeff")
    return FRONTMATTER_RE.sub("", text, count=1).strip()


def github_headers() -> dict[str, str]:
    headers = {
        "User-Agent": "aishort-skills-catalog/1.0",
        "Accept": "application/vnd.github.raw",
    }
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _ssl_context() -> ssl.SSLContext:
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except Exception:  # noqa: BLE001
        return ssl.create_default_context()


def http_get(url: str, timeout: float = 30.0) -> str:
    # raw.githubusercontent.com prefers a plain browser UA; GitHub API Accept breaks some CDN paths
    headers = {
        "User-Agent": "aishort-skills-catalog/1.0",
        "Accept": "text/plain, text/markdown, */*",
    }
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
        return resp.read().decode("utf-8", errors="replace")


def skill_raw_urls(skill: dict) -> list[str]:
    """Candidate raw.githubusercontent.com URLs for SKILL.md."""
    source = skill.get("source") or {}
    repo = source.get("repo") or ""
    path = (source.get("path") or "/").rstrip("/")
    filename = source.get("skill_filename") or "SKILL.md"
    if path in ("", "/"):
        suffixes = [f"/{filename}"]
    else:
        suffixes = [f"{path}/{filename}", f"{path}"]
    urls = []
    for ref in ("HEAD", "main", "master"):
        for suf in suffixes:
            urls.append(f"https://raw.githubusercontent.com/{repo}/{ref}{suf}")
    return urls


def source_page_url(skill: dict) -> str:
    source = skill.get("source") or {}
    repo = source.get("repo") or ""
    path = (source.get("path") or "").strip("/")
    if not repo:
        return ""
    if not path:
        return f"https://github.com/{repo}"
    return f"https://github.com/{repo}/tree/HEAD/{path}"


def fetch_body(skill: dict) -> str:
    last_err = None
    for url in skill_raw_urls(skill):
        try:
            raw = http_get(url)
            if raw.strip().startswith("<!DOCTYPE") or "<html" in raw[:200].lower():
                continue
            return strip_frontmatter(raw)
        except Exception as exc:  # noqa: BLE001 — collect and try next URL
            last_err = exc
            time.sleep(0.05)
    if last_err:
        logger.debug("body miss %s: %s", skill.get("id"), last_err)
    return ""


def normalize_skill(raw: dict, body: str) -> dict:
    source = raw.get("source") or {}
    meta = raw.get("metadata") or {}
    return {
        "id": raw.get("id"),
        "display_name": raw.get("display_name") or raw.get("name") or raw.get("id"),
        "description": raw.get("description") or "",
        "authors": raw.get("authors") or [],
        "is_official": bool(raw.get("is_official")),
        "tags": raw.get("tags") or [],
        "category": raw.get("category") or "miscellaneous",
        "source": {
            "repo": source.get("repo"),
            "path": source.get("path"),
        },
        "metadata": {"stars": int((meta.get("stars") or 0) or 0)},
        "added_at": raw.get("added_at"),
        "source_url": source_page_url(raw),
        "body": body or "",
    }


def build_meta(skills: list[dict]) -> dict:
    categories: dict[str, int] = {}
    companies: dict[str, dict] = {}
    for s in skills:
        cat = s.get("category") or "miscellaneous"
        categories[cat] = categories.get(cat, 0) + 1
        authors = s.get("authors") or []
        owner = authors[0] if authors else (s.get("source") or {}).get("repo", "").split("/")[0]
        if not owner:
            continue
        bucket = companies.setdefault(
            owner,
            {"id": owner, "name": owner, "count": 0, "stars": 0, "official": 0},
        )
        bucket["count"] += 1
        bucket["stars"] = max(bucket["stars"], int((s.get("metadata") or {}).get("stars") or 0))
        if s.get("is_official"):
            bucket["official"] += 1
    company_list = sorted(companies.values(), key=lambda c: (-c["stars"], -c["count"], c["id"]))
    return {
        "total": len(skills),
        "with_body": sum(1 for s in skills if s.get("body")),
        "official": sum(1 for s in skills if s.get("is_official")),
        "categories": [
            {"id": k, "slug": k, "count": v}
            for k, v in sorted(categories.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "companies": company_list,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def load_seed(seed: str) -> list[dict]:
    if seed.startswith("http://") or seed.startswith("https://"):
        logger.info("Downloading seed catalog: %s", seed)
        text = http_get(seed, timeout=120)
        return json.loads(text)
    path = Path(seed)
    logger.info("Loading seed catalog: %s", path)
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--seed",
        default=os.environ.get("SKILLS_SEED_URL", DEFAULT_SEED),
        help="URL or path to ai-skills.json seed",
    )
    parser.add_argument("--workers", type=int, default=16)
    parser.add_argument("--limit", type=int, default=0, help="Limit skills (debug)")
    parser.add_argument("--skip-bodies", action="store_true")
    parser.add_argument("--keep-existing-bodies", action="store_true")
    args = parser.parse_args()

    seed = load_seed(args.seed)
    if not isinstance(seed, list):
        logger.error("Seed must be a JSON array")
        return 1
    if args.limit > 0:
        seed = seed[: args.limit]

    existing_bodies: dict[str, str] = {}
    if args.keep_existing_bodies and OUT_FILE.exists():
        try:
            prev = json.loads(OUT_FILE.read_text(encoding="utf-8"))
            for item in prev:
                if item.get("id") and item.get("body"):
                    existing_bodies[item["id"]] = item["body"]
            logger.info("Reusing %d existing bodies", len(existing_bodies))
        except Exception as exc:  # noqa: BLE001
            logger.warning("Could not read existing catalog: %s", exc)

    bodies: dict[str, str] = {}
    if args.skip_bodies:
        bodies = {s["id"]: existing_bodies.get(s["id"], "") for s in seed if s.get("id")}
    else:
        to_fetch = []
        for s in seed:
            sid = s.get("id")
            if not sid:
                continue
            if sid in existing_bodies:
                bodies[sid] = existing_bodies[sid]
            else:
                to_fetch.append(s)
        logger.info("Fetching %d skill bodies (%d cached)...", len(to_fetch), len(bodies))
        ok = 0
        with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
            futures = {pool.submit(fetch_body, s): s for s in to_fetch}
            for fut in as_completed(futures):
                skill = futures[fut]
                sid = skill.get("id")
                try:
                    body = fut.result()
                except Exception as exc:  # noqa: BLE001
                    logger.warning("fetch failed %s: %s", sid, exc)
                    body = ""
                bodies[sid] = body
                if body:
                    ok += 1
                if (ok + len(futures) - len([f for f in futures if not f.done()])) % 50 == 0:
                    logger.info("progress bodies ok=%d / %d", ok, len(to_fetch))
        logger.info("Fetched bodies: %d/%d new", ok, len(to_fetch))

    skills = [normalize_skill(s, bodies.get(s.get("id"), "")) for s in seed if s.get("id")]
    skills.sort(key=lambda s: (-int((s.get("metadata") or {}).get("stars") or 0), s.get("id") or ""))

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    BODIES_DIR.mkdir(parents=True, exist_ok=True)

    # Full snapshot for offline tooling / CI diffs (may be large)
    OUT_FILE.write_text(json.dumps(skills, ensure_ascii=False) + "\n", encoding="utf-8")

    # Slim index for the web app (no bodies)
    index = [{k: v for k, v in s.items() if k != "body"} for s in skills]
    INDEX_FILE.write_text(json.dumps(index, ensure_ascii=False) + "\n", encoding="utf-8")

    # Per-skill body files for lazy fetch from /skills-data/<id>.json
    for s in skills:
        sid = s["id"]
        payload = {
            "id": sid,
            "display_name": s.get("display_name"),
            "body": s.get("body") or "",
            "source_url": s.get("source_url"),
        }
        (BODIES_DIR / f"{sid}.json").write_text(
            json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8"
        )

    meta = build_meta(skills)
    META_FILE.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    logger.info(
        "Wrote %d skills (%d with body) → index %s + %s bodies",
        meta["total"],
        meta["with_body"],
        INDEX_FILE.relative_to(REPO_ROOT),
        meta["with_body"],
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
