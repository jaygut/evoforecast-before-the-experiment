#!/usr/bin/env python3
"""Fail-closed semantic, lineage, deterministic-export, and static-site validation."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import subprocess
import tempfile
from pathlib import Path


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--evidence-root", type=Path, required=True)
    parser.add_argument("--rc01-root", type=Path, required=True)
    parser.add_argument("--wind-tunnel-brief", type=Path)
    parser.add_argument("--site-root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.site_root.resolve()
    failures: list[str] = []

    digest = json.loads((root / "data/facts_digest.json").read_text())
    audit_digest = json.loads((root / "audit/facts_digest.json").read_text())
    manifest = json.loads((root / "audit/source_manifest.json").read_text())
    phase = json.loads((root / "data/phase_cells.json").read_text())
    portfolio = json.loads((root / "data/portfolio.json").read_text())
    config = (root / "config.js").read_text()
    html = (root / "index.html").read_text()

    if digest != audit_digest:
        failures.append("data and audit facts digests differ")
    claims = {item["claim_id"]: item for item in digest["claims"]}
    if len(claims) != len(digest["claims"]):
        failures.append("duplicate claim IDs")
    sources = {item["source_id"] for item in manifest["sources"]}
    for claim in claims.values():
        if claim["source_id"] not in sources:
            failures.append("unknown source for " + claim["claim_id"])
        if not claim["allowed_wording"] or not claim["forbidden_wording"] or not claim["uncertainty_or_missingness"]:
            failures.append("incomplete ledger row " + claim["claim_id"])

    configured_ids = set(re.findall(r"EF-\d{3}", config))
    if not configured_ids <= set(claims):
        failures.append("config references unregistered claims: " + repr(sorted(configured_ids - set(claims))))
    if html.count('class="story-scene') != 12 or html.count('class="source-pill') != 12 or html.count('class="caveat') != 12:
        failures.append("twelve-scene honesty inventory mismatch")
    if len(list((root / "scenes").glob("*.js"))) != 12:
        failures.append("scene module count is not 12")
    if "M16,9 L5.5,17" not in html or "M16,9 L27,14.5" not in html or "M16,9 L15,26" not in html:
        failures.append("exact Graph of Life glyph geometry missing")
    if "overflow-x:clip" not in (root / "styles.css").read_text().replace(" ", ""):
        failures.append("sticky-safe overflow rule missing")

    v5 = phase["cohorts"]["blind_v5"]
    v3 = phase["cohorts"]["blind_v3"]
    prospective = [r for r in v5 if int(r["information_horizon_days"]) < 90]
    indicative = [r for r in v5 if float(r["probability_meeting_definition"]) >= .5]
    gp1_48_day60 = [
        r
        for r in v5
        if r["model"] == "GP1"
        and r["population_arms"] == "48"
        and r["information_horizon_days"] == "60"
    ]
    checks = {
        "v5_total": len(v5) == 80,
        "v5_prospective": len(prospective) == 60,
        "v5_prospective_indicative": sum(float(r["probability_meeting_definition"]) >= .5 for r in prospective) == 0,
        "v5_robust": sum(float(r["probability_meeting_definition"]) >= .8 for r in v5) == 0,
        "v3_indicative": sum(float(r["probability_meeting_definition"]) >= .5 for r in v3) == 5,
        "v3_robust": sum(float(r["probability_meeting_definition"]) >= .8 for r in v3) == 0,
        "frontier_total": len(portfolio["cohorts"]["blind_v5"]) == 120,
        "frontier_robust": sum(r["status"] == "robustly_pareto_optimal" for r in portfolio["cohorts"]["blind_v5"]) == 0,
        "sole_indicative_is_day90_52_5": len(indicative) == 1
            and indicative[0]["information_horizon_days"] == "90"
            and math.isclose(float(indicative[0]["probability_meeting_definition"]), .525),
        "48_arm_day60_cell_is_39_3_68_3": len(gp1_48_day60) == 1
            and math.isclose(float(gp1_48_day60[0]["mean_relative_crps_gain"]), .3930822711, abs_tol=5e-4)
            and math.isclose(float(gp1_48_day60[0]["coverage_90"]), .683, abs_tol=5e-4),
        "latest_runs_5600_of_5600": "5,600/5,600" in claims["EF-002"]["text"],
        "ladder_aggregate_47_5_80": claims["EF-007"]["denominator"] == "35 nuisance contexts"
            and "47.5%" in claims["EF-007"]["text"]
            and "80%" in claims["EF-007"]["text"],
        "r1_increment_0_0": claims["EF-008"]["denominator"] == "35 nuisance contexts"
            and "0.0%" in claims["EF-008"]["text"],
        "favorable_control_17_0": "17.0%" in claims["EF-009"]["text"],
        "adverse_control_minus_9_2": "-9.2%" in claims["EF-010"]["text"],
        "registered_round_engine": claims["EF-013"]["text"].startswith(
            "SLiM 5.2 is the registered biological trajectory engine for this round"
        ),
        "usd_context": "US dollars" in claims["EF-014"]["text"]
            and claims["EF-014"]["source_id"] == "WIND_TUNNEL_BRIEF",
    }
    failures.extend(name for name, passed in checks.items() if not passed)

    rendered_numbers = re.findall(r"(?<![A-Za-z])(?:−|\+)?\d[\d,.]*(?:%|m|/\d+)?", " ".join(re.findall(r'proof:\s*"([^"]+)"', config)))
    claim_corpus = " ".join(item["text"] + " " + item["allowed_wording"] + " " + item["units"] + " " + item["denominator"] for item in claims.values()).replace(",", "").replace("+", "").replace("−", "-")
    for number in rendered_numbers:
        normalized = number.replace(",", "").replace("≥", "").replace("+", "").replace("−", "-")
        if normalized not in claim_corpus and number not in {"80", "50%", "80%"}:
            failures.append("unregistered configured proof number: " + number)

    exporter = root / "tools/export_static_facts.py"
    with tempfile.TemporaryDirectory(prefix="evoforecast-export-a-") as a, tempfile.TemporaryDirectory(prefix="evoforecast-export-b-") as b:
        outputs = []
        for target in (Path(a), Path(b)):
            (target / "data").mkdir(); (target / "audit").mkdir()
            command = ["python3", str(exporter), "--repo", str(args.repo), "--evidence-root", str(args.evidence_root), "--rc01-root", str(args.rc01_root), "--site-root", str(target)]
            if args.wind_tunnel_brief is not None:
                command.extend(["--wind-tunnel-brief", str(args.wind_tunnel_brief)])
            subprocess.run(command, check=True, capture_output=True, text=True)
            outputs.append(target)
        compare = ["data/facts_digest.json", "data/phase_cells.json", "data/portfolio.json", "data/challenge_timeline.json", "data/trajectory_case.json", "audit/facts_digest.json", "audit/source_manifest.json", "audit/lineage_dag.json", "audit/claim_registry.tsv", "audit/environment.json"]
        for relative in compare:
            if sha(outputs[0] / relative) != sha(outputs[1] / relative):
                failures.append("non-deterministic export: " + relative)
            if relative != "audit/environment.json" and sha(root / relative) != sha(outputs[0] / relative):
                failures.append("checked-in export is stale: " + relative)

    if failures:
        raise SystemExit("VALIDATION FAILED\n- " + "\n- ".join(failures))
    print("bundle validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
