#!/usr/bin/env python3
"""Export one registered synthetic trajectory case as a browser lookup.

The browser receives exact latent-state rows from the already-completed Study E
cell ``adaptive_E07``. This script performs no simulation, fitting, scoring, or
selection of a visually favourable replicate. It exports all 32 registered
replicates in manifest order and identifies the first one as the initial view.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path


SITE = Path(__file__).resolve().parents[1]
CELL_ID = "adaptive_E07"
FOUNDERS = [f"D{i:02d}" for i in range(1, 9)]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_jobs(source: Path) -> tuple[Path, list[dict[str, str]]]:
    index = source / "runs" / "manifests" / "job_index.tsv"
    with index.open(newline="", encoding="utf-8") as handle:
        jobs = [
            row for row in csv.DictReader(handle, delimiter="\t")
            if row["cell_id"] == CELL_ID and row["status"] == "passed"
        ]
    jobs.sort(key=lambda row: int(row["replicate"]))
    if len(jobs) != 32 or [int(row["replicate"]) for row in jobs] != list(range(32)):
        raise SystemExit("expected exactly 32 passed adaptive_E07 replicates numbered 0 to 31")
    return index, jobs


def export_replicate(source: Path, job: dict[str, str]) -> dict[str, object]:
    latent = source.parents[1] / job["scientific_output"]
    if not latent.is_file():
        raise SystemExit("missing latent state: " + str(latent))
    actual_hash = sha256(latent)
    if actual_hash != job["output_sha256"]:
        raise SystemExit("latent-state hash mismatch for " + job["job_id"])

    days: list[dict[str, object]] = []
    with latent.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["synthetic"] != "1" or row["all_invariants_ok"] != "1":
                raise SystemExit("invalid synthetic/invariant flag in " + job["job_id"])
            day = int(row["day"])
            counts = [int(float(row[f"daphnia_{founder}_count"])) for founder in FOUNDERS]
            frequencies = [float(row[f"daphnia_{founder}_frequency"]) for founder in FOUNDERS]
            dominant_index = max(range(len(counts)), key=lambda index: counts[index])
            days.append({
                "day": day,
                "daphnia_count": int(float(row["daphnia_count"])),
                "founder_counts": counts,
                "founder_percent_tenths": [round(value * 1000) for value in frequencies],
                "dominant_founder": FOUNDERS[dominant_index],
                "dominant_count": counts[dominant_index],
                "dominant_percent_tenths": round(frequencies[dominant_index] * 1000),
            })
    if [row["day"] for row in days] != list(range(91)):
        raise SystemExit("expected days 0 to 90 for " + job["job_id"])
    if days[0]["daphnia_count"] != 80 or days[-1]["daphnia_count"] <= 0:
        raise SystemExit("adaptive_E07 persistence invariant failed for " + job["job_id"])
    return {
        "job_id": job["job_id"],
        "replicate": int(job["replicate"]),
        "parameter_draw_id": job["parameter_draw_id"],
        "particle_count": int(job["particle_count"]),
        "source_sha256": actual_hash,
        "days": days,
    }


def payload(source: Path) -> dict[str, object]:
    index, jobs = load_jobs(source)
    replicates = [export_replicate(source, job) for job in jobs]
    source_members = [
        {
            "job_id": rep["job_id"],
            "bytes": (source.parents[1] / job["scientific_output"]).stat().st_size,
            "sha256": rep["source_sha256"],
        }
        for job, rep in zip(jobs, replicates, strict=True)
    ]
    collection_bytes = sum(member["bytes"] for member in source_members)
    collection_sha256 = hashlib.sha256(
        json.dumps(source_members, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()
    return {
        "schema_version": "evoforecast-trajectory-case.local-v1",
        "synthetic": True,
        "case_id": CELL_ID,
        "study": "E",
        "status": "registered persistence diagnostic",
        "selection_rule": "all passed adaptive_E07 replicates in job-manifest order",
        "featured_job_id": replicates[0]["job_id"],
        "founders": FOUNDERS,
        "summary": {
            "replicate_count": len(replicates),
            "present_day90": sum(rep["days"][-1]["daphnia_count"] > 0 for rep in replicates),
            "initial_daphnia_count": replicates[0]["days"][0]["daphnia_count"],
            "founder_count": len(FOUNDERS),
            "horizon_days": 90,
            "particle_count_per_producer_species": 400,
        },
        "provenance": {
            "source_id": "RC01_TRAJECTORY_CASE",
            "job_index_locator": "immutable-evidence://rc01/runs/manifests/job_index.tsv",
            "job_index_sha256": sha256(index),
            "source_collection": "immutable-evidence://rc01/runs/raw/adaptive_E07/latent_state.csv",
            "source_member_count": len(source_members),
            "source_collection_bytes": collection_bytes,
            "source_collection_sha256": collection_sha256,
            "transformation": "exact-row projection and JSON serialization",
            "randomness": "none",
        },
        "replicates": replicates,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-output", type=Path, required=True,
                        help="path to the immutable registered simulation output")
    parser.add_argument("--site-root", type=Path, default=SITE)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = (json.dumps(payload(args.source_output.resolve()), sort_keys=True,
                           separators=(",", ":")) + "\n").encode()
    output = args.site_root.resolve() / "data" / "trajectory_case.json"
    if args.check:
        if not output.is_file() or output.read_bytes() != rendered:
            raise SystemExit("trajectory_case.json is stale or missing")
        print("trajectory case verified: 32 registered replicates, 32 present at day 90")
        return 0
    output.write_bytes(rendered)
    print("trajectory case written: " + str(output))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
