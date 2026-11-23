#!/usr/bin/env python3
"""Build immutable source/media artifacts and the Studio Samples manifest."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import zipfile
from pathlib import Path, PurePosixPath
from urllib.parse import quote

EXCLUDED_PARTS = {
    ".git", ".dart_tool", ".yoclip", ".yoclip_cache", ".fah",
    "build", "out", "output", "exports",
}
EXCLUDED_FILES = {".DS_Store"}


def safe_revision(value: str) -> str:
    result = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    if not result:
        raise ValueError(f"Invalid revision: {value!r}")
    return result


def source_files(project: Path) -> list[Path]:
    result = []
    for path in project.rglob("*"):
        relative = path.relative_to(project)
        if any(part in EXCLUDED_PARTS for part in relative.parts):
            continue
        if path.is_symlink() or not path.is_file() or path.name in EXCLUDED_FILES:
            continue
        result.append(path)
    result.sort(key=lambda item: item.relative_to(project).as_posix())
    if len(result) > 200:
        raise ValueError(f"{project} has {len(result)} source files; limit is 200")
    return result


def copy_required(source: Path, destination: Path) -> int:
    if not source.is_file() or source.stat().st_size == 0:
        raise FileNotFoundError(f"Required gallery artifact is missing: {source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    return destination.stat().st_size


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", default="gallery.json")
    parser.add_argument("--previews", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument(
        "--base-url", default="https://istin.github.io/yoclip-examples"
    )
    args = parser.parse_args()
    repo = Path.cwd()
    catalog = json.loads(Path(args.catalog).read_text())
    if catalog.get("schemaVersion") != 1:
        raise ValueError("Unsupported gallery schemaVersion")

    published = []
    for entry in catalog["samples"]:
        sample_id = entry["id"]
        if not re.fullmatch(r"[a-z0-9][a-z0-9_-]*", sample_id):
            raise ValueError(f"Invalid sample id: {sample_id}")
        revision = safe_revision(entry["revision"])
        project = repo / entry["project"]
        if not (project / "yoclip.yaml").is_file():
            raise FileNotFoundError(f"Sample has no yoclip.yaml: {project}")

        stem = f"{sample_id}-{revision}"
        archive_name = f"{stem}.zip"
        archive_path = args.output / "sources" / archive_name
        archive_path.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in source_files(project):
                relative = path.relative_to(project)
                archive.write(path, PurePosixPath(sample_id) / relative.as_posix())

        video_name = f"{stem}.mp4"
        poster_name = f"{stem}.png"
        video_bytes = copy_required(
            args.previews / f"{sample_id}.mp4", args.output / "media" / video_name
        )
        copy_required(
            args.previews / f"{sample_id}.png", args.output / "media" / poster_name
        )
        base = args.base_url.rstrip("/")
        published.append({
            "id": sample_id,
            "title": entry["title"],
            "description": entry.get("description", ""),
            "revision": entry["revision"],
            "archiveUrl": f"{base}/sources/{quote(archive_name)}",
            "archiveBytes": archive_path.stat().st_size,
            "sourceUrl": (
                "https://github.com/IstiN/yoclip-examples/tree/main/"
                f"{PurePosixPath(entry['project']).as_posix()}"
            ),
            "posterUrl": f"{base}/media/{quote(poster_name)}",
            "previewUrl": f"{base}/media/{quote(video_name)}",
            "previewBytes": video_bytes,
        })

    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {"schemaVersion": 1, "samples": published}
    temporary = args.output / "samples.json.part"
    temporary.write_text(json.dumps(manifest, indent=2) + "\n")
    temporary.replace(args.output / "samples.json")
    print(f"Published {len(published)} sample(s) to {args.output}")


if __name__ == "__main__":
    main()
