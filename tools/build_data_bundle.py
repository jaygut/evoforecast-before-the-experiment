#!/usr/bin/env python3
"""Generate data/bundle-data.js (window.EVO_DATA) from the frozen data/*.json mirrors.

Deterministic. No network, no randomness. The classic JS bundle is a canonical semantic
mirror of the JSON files so a file:// double-click carries the same data an HTTP load
would. The immutable-evidence products are hash-bound upstream; this tool binds the JS
bundle to the already-frozen JSON re-exports and asserts round-trip parity so the two
halves of the pipeline can never silently diverge.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

# window.EVO_DATA key -> data/<file>.json ; keys must match main.js loadData().
KEYS = {
    "phase": "phase_cells.json",
    "portfolio": "portfolio.json",
    "timeline": "challenge_timeline.json",
    "trajectory": "trajectory_case.json",
    "facts": "facts_digest.json",
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_json(raw: bytes, source: str) -> object:
    def no_duplicate_keys(pairs: list[tuple[str, object]]) -> dict[str, object]:
        result: dict[str, object] = {}
        for key, value in pairs:
            if key in result:
                raise SystemExit("duplicate JSON key in " + source + ": " + key)
            result[key] = value
        return result

    def no_nonfinite(token: str) -> None:
        raise SystemExit("non-finite JSON number in " + source + ": " + token)

    return json.loads(
        raw.decode("utf-8"),
        object_pairs_hook=no_duplicate_keys,
        parse_constant=no_nonfinite,
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--check", action="store_true", help="verify parity without rewriting")
    args = parser.parse_args()

    site = args.site_root.resolve()
    data_dir = site / "data"
    audit_dir = site / "audit"

    payload: dict[str, object] = {}
    source_hashes: dict[str, str] = {}
    for key, fname in KEYS.items():
        raw = (data_dir / fname).read_bytes()
        payload[key] = load_json(raw, fname)
        source_hashes[fname] = sha256_bytes(raw)

    json_str = json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    js_body = "window.EVO_DATA=" + json_str + ";\n"
    js_bytes = js_body.encode("utf-8")

    # Round-trip parity: the JS payload must parse back to exactly each JSON file's content.
    parsed = json.loads(json_str)
    for key, fname in KEYS.items():
        if parsed[key] != load_json((data_dir / fname).read_bytes(), fname):
            raise SystemExit("PARITY FAILURE: bundle key '" + key + "' != " + fname)

    out = data_dir / "bundle-data.js"
    manifest = {
        "schema_version": "evoforecast-scrolly-bundle.local-v1",
        "generator": "tools/build_data_bundle.py",
        "window_var": "EVO_DATA",
        "keys": KEYS,
        "source_json_sha256": source_hashes,
        "bundle_js_sha256": sha256_bytes(js_bytes),
        "bundle_js_bytes": len(js_bytes),
        "randomness": "none",
        "network": "not used",
    }
    manifest_path = audit_dir / "bundle_data_manifest.json"
    manifest_bytes = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8")

    if args.check:
        if not out.is_file() or out.read_bytes() != js_bytes:
            raise SystemExit("bundle-data.js is stale or missing; re-run without --check")
        if not manifest_path.is_file() or manifest_path.read_bytes() != manifest_bytes:
            raise SystemExit("bundle_data_manifest.json is stale or missing; re-run without --check")
        print("bundle-data.js and manifest parity OK; sha256=" + manifest["bundle_js_sha256"])
        return 0

    out.write_bytes(js_bytes)
    manifest_path.write_bytes(manifest_bytes)
    print("wrote " + str(out) + " (" + str(len(js_bytes)) + " bytes); sha256=" + manifest["bundle_js_sha256"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
