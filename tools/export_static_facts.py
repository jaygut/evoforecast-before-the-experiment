#!/usr/bin/env python3
"""Deterministically export the public synthetic evidence used by the site.

This script performs no fitting and no biological simulation. It copies registered,
precomputed cells from immutable evidence and derives only explicit counts or ratios.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import platform
import sys
from pathlib import Path


SNAPSHOT_DATE = "2026-07-20"
SCHEMA = "evoforecast-scrolly-facts.local-v1"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_tsv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def write_json(path: Path, payload: object) -> None:
    path.write_text(
        json.dumps(payload, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def claim(
    claim_id: str,
    text: str,
    status: str,
    source_id: str,
    units: str,
    denominator: str,
    allowed: str,
    forbidden: str,
    uncertainty: str,
) -> dict[str, str]:
    return {
        "claim_id": claim_id,
        "text": text,
        "status": status,
        "source_id": source_id,
        "units": units,
        "denominator": denominator,
        "snapshot_date": SNAPSHOT_DATE,
        "allowed_wording": allowed,
        "forbidden_wording": forbidden,
        "uncertainty_or_missingness": uncertainty,
        "owner": "EvoForecast computational evidence owner",
        "verification_status": "computationally verified from hash-bound source",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--evidence-root", type=Path, required=True)
    parser.add_argument("--rc01-root", type=Path, required=True)
    parser.add_argument(
        "--wind-tunnel-brief",
        type=Path,
        help=(
            "path to the internal design wind-tunnel brief; defaults to "
            "<repo>/internal/design_wind_tunnel_brief.md"
        ),
    )
    parser.add_argument("--site-root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()

    site = args.site_root.resolve()
    data_dir = site / "data"
    audit_dir = site / "audit"
    data_dir.mkdir(parents=True, exist_ok=True)
    audit_dir.mkdir(parents=True, exist_ok=True)

    wind_tunnel_brief = (
        args.wind_tunnel_brief
        if args.wind_tunnel_brief is not None
        else args.repo / "internal/design_wind_tunnel_brief.md"
    )
    sources = {
        "PROMPT": args.repo / "ai_docs/prompts/evoforecast_graph_of_life_scrollytelling_story_system.md",
        "GT01_PRD": args.repo / "docs/workstreams/gt01_daphnia_genome_phenome_forecasting_prd.md",
        "WIND_TUNNEL_BRIEF": wind_tunnel_brief,
        "BLIND_V3_RUN": args.evidence_root / "theory-poc-v5-blind-v3/design/blind_v3_run_manifest.json",
        "BLIND_V3_PHASE": args.evidence_root / "theory-poc-v5-blind-v3/derived/forecastability_phase_diagram.tsv",
        "BLIND_V3_FRONTIER": args.evidence_root / "theory-poc-v5-blind-v3/derived/experiment_portfolio_frontier.tsv",
        "BLIND_V3_LADDER": args.evidence_root / "theory-poc-v5-blind-v3/scores/model_ladder_summary.tsv",
        "BLIND_V5_RUN": args.evidence_root / "theory-poc-v5-blind-v5/design/blind_v5_run_manifest.json",
        "BLIND_V5_PHASE": args.evidence_root / "theory-poc-v5-blind-v5/derived/forecastability_phase_diagram.tsv",
        "BLIND_V5_FRONTIER": args.evidence_root / "theory-poc-v5-blind-v5/derived/experiment_portfolio_frontier.tsv",
        "BLIND_V5_LADDER": args.evidence_root / "theory-poc-v5-blind-v5/derived/model_ladder_summary_corrected.tsv",
        "POSITIVE_CONTROL": args.evidence_root / "theory-poc-v3-successor/derived/summary.json",
        "ADVERSE_CONTROL": args.evidence_root / "theory-poc-v3-successor-attempt1-no-positive-recovery/derived/summary.json",
        "RC01_SUMMARY": args.rc01_root / "derived/derived_results_summary.json",
        "RC01_ENDPOINTS": args.rc01_root / "derived/endpoint_summary.tsv",
        "RC01_JOBS": args.rc01_root / "runs/manifests/job_index.tsv",
        "BRAND_SNAPSHOT": args.evidence_root.parent / "presentation_v6/evidence/brand_visual_system_snapshot.md",
        "VOICE_SNAPSHOT": args.evidence_root.parent / "presentation_v6/evidence/writing_style_guide_snapshot.md",
    }
    missing = [str(path) for path in sources.values() if not path.is_file()]
    if missing:
        raise SystemExit("Missing required sources:\n" + "\n".join(missing))

    v3_phase = read_tsv(sources["BLIND_V3_PHASE"])
    v5_phase = read_tsv(sources["BLIND_V5_PHASE"])
    v3_frontier = read_tsv(sources["BLIND_V3_FRONTIER"])
    v5_frontier = read_tsv(sources["BLIND_V5_FRONTIER"])
    v5_ladder = read_tsv(sources["BLIND_V5_LADDER"])
    v5_run = json.loads(sources["BLIND_V5_RUN"].read_text())
    positive = json.loads(sources["POSITIVE_CONTROL"].read_text())
    adverse = json.loads(sources["ADVERSE_CONTROL"].read_text())
    rc01 = json.loads(sources["RC01_SUMMARY"].read_text())

    def count_gate(rows: list[dict[str, str]], threshold: float) -> int:
        return sum(float(row["probability_meeting_definition"]) >= threshold for row in rows)

    prospective = [row for row in v5_phase if int(row["information_horizon_days"]) < 90]
    v5_gp1 = next(row for row in v5_ladder if row["model"] == "GP1")
    v5_r1 = next(row for row in v5_ladder if row["model"] == "R1")
    if v5_gp1["registered_comparator"] != "P1":
        raise SystemExit("GP1 model-ladder row does not use the registered P1 comparator")
    if v5_r1["registered_comparator"] != "GP1":
        raise SystemExit("R1 model-ladder row does not use the registered GP1 comparator")

    claims = [
        claim("EF-001", "EvoForecast is a synthetic digital wind tunnel for testing experimental-design informativeness before scale-up.", "synthetic", "PROMPT", "concept", "not applicable", "synthetic design instrument", "validated biological forecasting system", "No real laboratory outcomes are present."),
        claim("EF-002", f"The latest blind package completed {v5_run['successful_trajectories']:,}/{v5_run['genuine_slim_trajectories']:,} SLiM trajectories with {v5_run['failed_trajectories']} failures.", "synthetic", "BLIND_V5_RUN", "trajectories", str(v5_run["genuine_slim_trajectories"]), "completed synthetic SLiM trajectories", "successful Daphnia experiments", "Execution success is software evidence, not forecast skill."),
        claim("EF-003", f"In blind v5, {count_gate(prospective, .5)}/{len(prospective)} prospective cells met the indicative ≥50% joint gate.", "indicative", "BLIND_V5_PHASE", "registered cells", str(len(prospective)), "prospective blind-v5 synthetic cells", "evolution was not forecastable", "The definition is scenario- and threshold-specific."),
        claim("EF-004", f"Across blind-v5 phase cells, {count_gate(v5_phase, .5)}/{len(v5_phase)} met the indicative gate and {count_gate(v5_phase, .8)}/{len(v5_phase)} met the robust gate.", "indicative", "BLIND_V5_PHASE", "registered cells", str(len(v5_phase)), "blind-v5 synthetic joint-gate results", "biological validation", "The sole indicative cell is a day-90 nowcast, not prospective evidence."),
        claim("EF-005", f"Blind v3 had {count_gate(v3_phase, .5)}/{len(v3_phase)} indicative cells and {count_gate(v3_phase, .8)}/{len(v3_phase)} robust cells.", "indicative", "BLIND_V3_PHASE", "registered cells", str(len(v3_phase)), "blind-v3 synthetic joint-gate results", "validated evolutionary forecasts", "Blind-v3 and blind-v5 are different synthetic challenge packages."),
        claim("EF-006", f"No blind-v5 policy was classified robustly Pareto optimal: 0/{len(v5_frontier)}.", "indicative", "BLIND_V5_FRONTIER", "policy cells", str(len(v5_frontier)), "no robustly Pareto-optimal synthetic policy", "no experiment can work", "Some policies are conditional/fragile; none satisfy the robust classification."),
        claim("EF-007", f"The blind-v5 GP1 summary reports a {100*float(v5_gp1['relative_crps_gain_vs_registered_comparator']):.1f}% mean CRPS gain versus P1 with {100*float(v5_gp1['coverage_90']):.0f}% nominal-90% coverage.", "indicative", "BLIND_V5_LADDER", "percent", "35 nuisance contexts", "synthetic aggregate model comparison", "genomes predict Daphnia evolution", "Aggregate gain coexists with no prospective phase cell meeting the indicative gate."),
        claim("EF-008", f"R1 adds {100*float(v5_r1['relative_crps_gain_vs_registered_comparator']):.1f}% mean CRPS gain beyond GP1 in blind v5.", "indicative", "BLIND_V5_LADDER", "percent", "35 nuisance contexts", "no detectable incremental synthetic gain", "feedback never matters", "This is specific to the synthetic challenge and registered comparator."),
        claim("EF-009", f"The corrected favorable control shows a {100*positive['relative_genome_crps_gain']:.1f}% genome-versus-pedigree CRPS gain.", "synthetic", "POSITIVE_CONTROL", "percent", str(positive["main_seed_blocks"]) + " seed blocks", "favorable marker-encoded software control", "DNA adds 17% biological forecast value", positive["claim_boundary"]),
        claim("EF-010", f"The matched adverse control shows a {100*adverse['relative_genome_crps_gain']:.1f}% genome-versus-pedigree CRPS gain.", "synthetic", "ADVERSE_CONTROL", "percent", str(adverse["main_seed_blocks"]) + " seed blocks", "adverse marker-encoded software control", "genomic data are harmful in biology", "A negative control demonstrates that the workflow can expose failure."),
        claim("EF-011", f"The earlier RC01 synthetic POC verified {rc01['jobs']:,} immutable jobs.", "synthetic", "RC01_SUMMARY", "jobs", str(rc01["jobs"]), "earlier RC01 software-verification jobs", "empirical experiments", "Execution count is software evidence; biological validation remains blocked."),
        claim("EF-012", "The proposed GT01 theoretical cutaway uses diploid, ten-chromosome, sexual recombination and standing variation.", "proposed", "GT01_PRD", "chromosomes", "10", "proposed post-RC01 theoretical design", "implemented or calibrated Daphnia genome model", "GT01 is gated and does not alter the frozen clonal RC01 production model."),
        claim("EF-013", "SLiM 5.2 is the registered biological trajectory engine for this round; Python orchestrates, exports, and scores.", "synthetic", "GT01_PRD", "engine boundary", "not applicable", "registered software boundary for this round", "Python simulates the biological reference world", "This site performs lookup only and contains no simulator."),
        claim("EF-014", "An illustrative large-programme budget on the order of tens of millions of US dollars, used as external context only, not a committed budget or an engine recommendation.", "external", "WIND_TUNNEL_BRIEF", "programme scale", "external context only", "illustrative external context", "a committed or endorsed programme budget", "No authoritative budget source is embedded in this bundle."),
        claim("EF-015", "Empirical qualification has not been achieved.", "blocked", "GT01_PRD", "maturity state", "not applicable", "empirical qualification is blocked", "validated, qualified, or operational", "Requires controlled material, accepted evidence, real assays, custody, independent prospective reveal, and external reproduction."),
        claim("EF-016", "V3–V5 describe software and challenge-design maturation, not biological generations.", "synthetic", "PROMPT", "chronology", "software snapshots", "software/challenge chronology", "biological evolutionary sequence", "Cohorts differ in registered synthetic design and scoring treatment."),
        claim("EF-017", f"The earlier RC01 synthetic POC verified {sum(1 for _ in sources['RC01_ENDPOINTS'].open(encoding='utf-8')) - 1:,} run-horizon endpoint records.", "synthetic", "RC01_ENDPOINTS", "endpoint records", "12,304", "earlier RC01 run-horizon endpoint records", "empirical measurements", "Records are synthetic endpoints at four registered horizons."),
    ]

    budget_boundary = "a committed or endorsed programme budget"
    do_not_say = sorted(
        {c["forbidden_wording"] for c in claims},
        key=lambda text: (text != budget_boundary, text),
    ) + [
        "EvoForecast predicts evolution",
        "an external funder result",
        "real Daphnia forecast",
        "world first",
        "biologically validated",
    ]
    digest = {
        "schema_version": SCHEMA,
        "snapshot_date": SNAPSHOT_DATE,
        "claim_boundary": "Synthetic software and experimental-design evidence only; no empirical Daphnia forecast skill, GT01/G1 qualification, or external endorsement.",
        "claims": claims,
        "do_not_say": do_not_say,
    }
    write_json(data_dir / "facts_digest.json", digest)
    write_json(audit_dir / "facts_digest.json", digest)

    phase_fields = ["model", "comparator", "population_arms", "information_horizon_days", "n_nuisance_contexts", "mean_relative_crps_gain", "gain_ci_low", "gain_ci_high", "coverage_90", "probability_meeting_definition", "supported", "synthetic"]
    phase_payload = {
        "schema_version": SCHEMA,
        "source_claim_ids": ["EF-003", "EF-004", "EF-005"],
        "thresholds": {"indicative": 0.5, "robust": 0.8},
        "cohorts": {
            "blind_v5": [{k: row.get(k, "") for k in phase_fields} for row in v5_phase],
            "blind_v3": [{k: row.get(k, "") for k in phase_fields} for row in v3_phase],
        },
    }
    write_json(data_dir / "phase_cells.json", phase_payload)

    frontier_fields = ["policy_id", "measurement_package", "model", "population_arms", "information_horizon_days", "mean_crps", "coverage_90", "policy_regret", "forecast_utility", "normalized_resource_units", "matched_nuisance_contexts", "pareto_membership_probability", "status"]
    write_json(data_dir / "portfolio.json", {
        "schema_version": SCHEMA,
        "source_claim_id": "EF-006",
        "cohorts": {
            "blind_v5": [{k: row[k] for k in frontier_fields} for row in v5_frontier],
            "blind_v3": [{k: row[k] for k in frontier_fields} for row in v3_frontier],
        },
    })

    write_json(data_dir / "challenge_timeline.json", {
        "schema_version": SCHEMA,
        "source_claim_ids": ["EF-005", "EF-009", "EF-010", "EF-011", "EF-016", "EF-017"],
        "events": [
            {"id": "rc01", "label": "RC01 synthetic POC", "state": "software proof", "detail": "3,076 jobs · 12,304 endpoints"},
            {"id": "v3_adverse", "label": "Corrected adverse control", "state": "failure exposed", "detail": "−9.2% genome-vs-pedigree CRPS gain"},
            {"id": "v3_positive", "label": "Corrected favorable control", "state": "positive control", "detail": "+17.0% genome-vs-pedigree CRPS gain"},
            {"id": "blind_v3", "label": "Blind v3", "state": "blind challenge", "detail": "5/80 indicative · 0/80 robust"},
            {"id": "blind_v5", "label": "Blind v5", "state": "latest challenge", "detail": "0/60 prospective indicative · 0/80 robust"},
        ],
    })
    write_json(data_dir / "genome_cutaway.json", {
        "schema_version": SCHEMA,
        "source_claim_id": "EF-012",
        "status": "proposed",
        "chromosomes": [{"id": str(i), "length_fraction": round(1 - (i - 1) * 0.055, 3)} for i in range(1, 11)],
        "layers": ["standing founder variation", "sexual recombination", "phenotype/ecology", "sampling/assay observation", "blind forecast/scoring"],
    })

    locator_map = {
        "PROMPT": "repo://ai_docs/prompts/evoforecast_graph_of_life_scrollytelling_story_system.md",
        "GT01_PRD": "repo://docs/workstreams/gt01_daphnia_genome_phenome_forecasting_prd.md",
        "WIND_TUNNEL_BRIEF": "repo://internal/design_wind_tunnel_brief.md",
    }
    def locator(source_id: str, path: Path) -> str:
        if source_id in locator_map:
            return locator_map[source_id]
        try:
            return "immutable-evidence://outputs/" + path.relative_to(args.evidence_root).as_posix()
        except ValueError:
            pass
        try:
            return "immutable-evidence://rc01/" + path.relative_to(args.rc01_root).as_posix()
        except ValueError:
            pass
        try:
            return "immutable-evidence://" + path.relative_to(args.evidence_root.parent).as_posix()
        except ValueError:
            return "immutable-evidence://" + path.name

    manifest = {
        "schema_version": SCHEMA,
        "snapshot_date": SNAPSHOT_DATE,
        "sources": [
            {
                "source_id": sid,
                "locator": locator(sid, path),
                "basename": (
                    "design_wind_tunnel_brief.md"
                    if sid == "WIND_TUNNEL_BRIEF"
                    else path.name
                ),
                "sha256": sha256(path),
                "bytes": path.stat().st_size,
                "mutable": False,
            }
            for sid, path in sorted(sources.items())
        ],
    }
    write_json(audit_dir / "source_manifest.json", manifest)
    write_json(audit_dir / "lineage_dag.json", {
        "schema_version": SCHEMA,
        "nodes": [{"id": s["source_id"], "kind": "immutable_source", "sha256": s["sha256"]} for s in manifest["sources"]] + [
            {"id": "facts_digest", "kind": "derived_public_data"},
            {"id": "phase_cells", "kind": "derived_public_data"},
            {"id": "portfolio", "kind": "derived_public_data"},
            {"id": "site", "kind": "rendered_artifact"},
        ],
        "edges": [
            {"from": sid, "to": "facts_digest", "operation": "verified extraction"} for sid in sorted(sources)
        ] + [
            {"from": "BLIND_V3_PHASE", "to": "phase_cells", "operation": "field projection"},
            {"from": "BLIND_V5_PHASE", "to": "phase_cells", "operation": "field projection"},
            {"from": "BLIND_V3_FRONTIER", "to": "portfolio", "operation": "field projection"},
            {"from": "BLIND_V5_FRONTIER", "to": "portfolio", "operation": "field projection"},
            {"from": "facts_digest", "to": "site", "operation": "config-bound rendering"},
            {"from": "phase_cells", "to": "site", "operation": "lookup-only rendering"},
            {"from": "portfolio", "to": "site", "operation": "lookup-only rendering"},
        ],
    })

    with (audit_dir / "claim_registry.tsv").open("w", encoding="utf-8", newline="") as handle:
        fields = list(claims[0])
        writer = csv.DictWriter(handle, delimiter="\t", fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(claims)

    write_json(audit_dir / "environment.json", {
        "schema_version": SCHEMA,
        "python": sys.version.split()[0],
        "platform": platform.platform(),
        "exporter_sha256": sha256(Path(__file__)),
        "randomness": "none",
        "network": "not used",
    })
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
