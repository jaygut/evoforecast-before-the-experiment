#!/usr/bin/env python3
"""Write or verify the non-circular manifest for the publishable Git tree."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest_path = root / "audit/bundle_manifest.json"


def publishable_files() -> list[Path]:
    """Return tracked files, falling back to a dot-directory-safe tree walk."""
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "ls-files", "-z"],
            check=True,
            capture_output=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        return sorted(
            path
            for path in root.rglob("*")
            if path.is_file()
            and ".git" not in path.relative_to(root).parts
            and "__pycache__" not in path.relative_to(root).parts
        )
    return sorted(
        root / relative.decode("utf-8")
        for relative in result.stdout.split(b"\0")
        if relative and (root / relative.decode("utf-8")).is_file()
    )


parser = argparse.ArgumentParser()
parser.add_argument("--check", action="store_true", help="verify without rewriting")
args = parser.parse_args()

files = []
for path in publishable_files():
    if path.resolve() == manifest_path.resolve():
        continue
    files.append({
        "path": path.relative_to(root).as_posix(),
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    })
payload = {
    "schema_version": "evoforecast-scrolly-bundle.local-v1",
    "source_snapshot_created_at_utc": "2026-07-20T18:00:57Z",
    "manifest_audit_date": "2026-07-21",
    "excluded_to_avoid_circular_hash": ["audit/bundle_manifest.json"],
    "file_count": len(files),
    "files": files,
}
manifest_bytes = (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")
if args.check:
    if not manifest_path.is_file() or manifest_path.read_bytes() != manifest_bytes:
        raise SystemExit("bundle manifest is stale or missing; re-run without --check")
    print("bundle manifest verified:", len(files), "files")
    raise SystemExit(0)
manifest_path.write_bytes(manifest_bytes)
print("bundle manifest written:", len(files), "files")
