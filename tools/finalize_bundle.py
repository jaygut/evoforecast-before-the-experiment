#!/usr/bin/env python3
"""Write the non-circular final bundle manifest."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest_path = root / "audit/bundle_manifest.json"
excluded = {manifest_path.resolve()}
files = []
for path in sorted(p for p in root.rglob("*") if p.is_file() and p.resolve() not in excluded):
    files.append({
        "path": path.relative_to(root).as_posix(),
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    })
payload = {
    "schema_version": "evoforecast-scrolly-bundle.local-v1",
    "created_at_utc": "2026-07-20T18:00:57Z",
    "excluded_to_avoid_circular_hash": ["audit/bundle_manifest.json"],
    "file_count": len(files),
    "files": files,
}
manifest_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print("bundle manifest written:", len(files), "files")
