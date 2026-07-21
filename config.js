(function (root) {
  "use strict";
  root.EVO_CONFIG = {
    version: "scrolly.local-v2",
    snapshot: "21 JUL 2026",
    boundary: "SYNTHETIC SOFTWARE AND EXPERIMENT-DESIGN EVIDENCE · EMPIRICAL TESTING IS THE NEXT GATE · INDEPENDENT REVIEW PRECEDES ANY OPERATIONAL OR FUNDING CLAIM",
    thresholds: { indicative: 0.5, robust: 0.8 },
    colors: {
      navy: "#0E2A47", abyss: "#08203A", instrument: "#06141F", slate: "#243B4A",
      muted: "#5C6E78", teal: "#1AA89B", tealDeep: "#0E7A70", green: "#3AD6A3",
      greenDeep: "#0F8059", coral: "#E8694D", coralDeep: "#C2442A", amber: "#F2A24E",
      amberDeep: "#A86410", sand: "#E9E1CC", paper: "#F7F6F2", bone: "#FBFAF6",
      mist: "#EAF1F1", hairline: "#D7DEE2"
    },
    scenes: [
      {
        id: "hero", number: "01", eyebrow: "BEFORE THE EXPERIMENT · SYNTHETIC EVIDENCE · 21 JUL 2026",
        title: "Before you commit tens of millions of dollars to predict evolution, find out whether the experiment can teach you enough.",
        body: "A research director deciding whether to fund a large evolution experiment faces a question that becomes expensive to answer after the design is locked. Will the study separate a good forecast from a lucky guess, or spend tens of millions of dollars and leave the same uncertainty behind? EvoForecast tests that decision first in software. Its registered engine runs the proposed experiment in a synthetic world where the answer is known. The challenge harness then asks whether each design could recover it before a real programme begins.",
        proof: "5,600 OF 5,600 SIMULATED RUNS COMPLETED · 0 OF 60 FORWARD-LOOKING FORECAST TESTS PASSED",
        claim: "EF-001 · EF-002 · EF-003", badge: "SYNTHETIC SOFTWARE EVIDENCE"
      },
      {
        id: "stakes", number: "02", eyebrow: "THE COSTLY FAILURE · EXTERNAL CONTEXT",
        title: "A larger programme can still leave two forecasts indistinguishable.",
        body: "Every large evolution experiment locks in choices that are costly to reverse. Those choices include species, generations, independent populations, starting diversity, conditions, measurements, and automation. Measurement volume and discriminating power are different properties. A study can collect every planned sample while leaving its central forecast comparison unresolved. EvoForecast is designed to expose that failure while the programme can still change course.",
        proof: "A MAJOR PROGRAMME · TENS OF MILLIONS USD · ILLUSTRATIVE SCALE",
        claim: "EF-014", badge: "EXTERNAL CONTEXT"
      },
      {
        id: "blindspot", number: "03", eyebrow: "WHY AVERAGES MISLEAD · PROSPECTIVE DISCIPLINE",
        title: "A better average can still hide a forecast that misses too often.",
        body: "The model ladder compares tracks with progressively richer information. Across 35 synthetic contexts, the genome-plus-phenome track, which combines genome data with measured traits, improved mean forecast accuracy by 47.5 percent over the family-lineage baseline. This aggregate sits apart from every single design cell. Its ninety percent prediction range contained the truth eight times in ten, which signals overconfidence. Across the sixty prospective, or forward-looking, cells, zero designs cleared accuracy and calibrated uncertainty together. A held-out outcome stays sealed until scoring, protecting the test from explanations written after the result.",
        proof: "35-CONTEXT MODEL LADDER · +47.5% MEAN GAIN VS PEDIGREE · 80% COVERAGE OF A 90% RANGE · 0 / 60 PROSPECTIVE",
        claim: "EF-003 · EF-007", badge: "SYNTHETIC · INDICATIVE"
      },
      {
        id: "windtunnel", number: "04", eyebrow: "THE REHEARSAL · AUDITABLE CHAIN",
        title: "Rehearse the whole experiment in a world where the answer is already known.",
        body: "EvoForecast builds a synthetic population and advances it with SLiM 5.2, the registered trajectory engine for this round. The surrounding challenge software, or harness, is engine-agnostic, so other evolutionary simulators can enter future rounds and are under evaluation. Ecological network dynamics in a population context are a direction for later work. For each synthetic run, SLiM records the true outcome. The harness seals it while releasing the measurements a real study could observe. Competing designs deposit forecasts before reveal, then the harness compares learning, resource use, calibration, and failure.",
        proof: "DEFINE · SIMULATE (SLiM 5.2 THIS ROUND) · HIDE · FORECAST · REVEAL · SCORE · COMPARE LEARNING, COST, FAILURE",
        claim: "EF-013 · EF-002", badge: "REGISTERED ENGINE BOUNDARY"
      },
      {
        id: "abstain", number: "05", eyebrow: "V3 · THE POSITIVE CONTROL",
        title: "First, prove the instrument can find a signal that is really there.",
        body: "V3, V4, and V5 are successive challenge versions. Each starts by testing whether the software can recover a signal planted on purpose. In V3, the favorable control tied the signal to a known genetic marker. A forecaster using genome data improved the score by 17.0 percent over one limited to family lineage, across sixteen matched sets of runs. The matched control removed that signal and the same comparison fell by 9.2 percent. Together, these controls show that the workflow can recover a favorable software signal and return an adverse result. The value of DNA in living animals awaits measurement.",
        proof: "+17.0% FAVORABLE CONTROL · -9.2% MATCHED ADVERSE CONTROL · 16 SEED BLOCKS",
        claim: "EF-009 · EF-010", badge: "SYNTHETIC CONTROLS"
      },
      {
        id: "rejection", number: "06", eyebrow: "V4 · THE EVIDENCE WE THREW OUT",
        title: "Next, discard evidence that fails its test.",
        body: "V4 looked encouraging and was rejected. Independent review found three faults. The release exposed information reserved for the reveal. The paired comparisons departed from the analysis promised in advance. The cost estimates disagreed with the stated consequences of forecast error. Every V4 estimate was retired. The rejection shows that review can stop a flattering result before it shapes a programme.",
        proof: "V4 REJECTED · LEAKAGE · BROKEN PAIRING · INCOHERENT COST ANALYSIS · EVERY ESTIMATE RETIRED",
        claim: "REVIEW-V4 · EF-016", badge: "REJECTED COHORT"
      },
      {
        id: "challenge", number: "07", eyebrow: "V5 · THE SCALE-UP DECISION",
        title: "The clean run produced a stop decision.",
        body: "V5 was the version to act on because every forecast was locked before reveal. All 5,600 synthetic runs finished successfully. The genome-plus-phenome track improved the average model-ladder score, while the decision test required accuracy and calibrated uncertainty together. A pass required at least a fifty percent stored probability of meeting that joint definition. One of eighty design cells crossed the line. It was a day-90 nowcast at 52.5 percent, measured at the end of the same observation window. Prospective evidence remained at zero of sixty cells. Robust evidence remained at zero of eighty cells and zero of one hundred twenty experiment plans. The feedback track added 0.0 percent beyond genome plus phenome. The current decision is to delay molecular scale-up and design a stronger test.",
        proof: "5,600 / 5,600 CLEAN · MODEL LADDER GENOME + PHENOME +47.5% VS PEDIGREE, 80% COVERAGE · 1 / 80 INDICATIVE AT DAY 90 · 0 / 60 PROSPECTIVE · 0 / 80 ROBUST · 0 / 120 PLANS",
        claim: "EF-002 · EF-003 · EF-004 · EF-006 · EF-007 · EF-008", badge: "OUTCOME-UNSEEN · SYNTHETIC"
      },
      {
        id: "phase", number: "08", eyebrow: "BUILD THE EXPERIMENT · LOOKUP ONLY",
        title: "Build a design and read what the frozen challenge already found.",
        body: "Choose a measurement track, a number of independent populations, and how far ahead to forecast. The instrument returns the registered result for that exact design. Its three lookup rows show accuracy gain, observed coverage, and the stored probability of meeting the combined definition. Every value was computed and frozen before reveal. Each control selects another stored row, so the result stays fixed.",
        proof: "PASS AT 50% · ROBUST AT 80% · 80 REGISTERED DESIGNS",
        claim: "EF-003 · EF-004 · EF-005", badge: "FROZEN LOOKUP"
      },
      {
        id: "frontier", number: "09", eyebrow: "WHAT TO MEASURE NEXT · LOOKUP ONLY",
        title: "More measurement helps only when it changes the answer.",
        body: "Each point is a measurement plan with its modeled resource use and forecast value. Resource use rises to the right and forecast value rises upward. A robust plan would remain among the best choices despite uncertainty. In this synthetic challenge, zero of one hundred twenty plans met that standard. Across the 35-context model-ladder aggregate, the feedback track added 0.0 percent beyond genome plus phenome. The next step is to stage measurement and prove calibration before expanding.",
        proof: "0 / 120 ROBUSTLY BEST PLANS · FEEDBACK TRACK +0.0% BEYOND GENOME+PHENOME",
        claim: "EF-006 · EF-008", badge: "CONDITIONAL / FRAGILE"
      },
      {
        id: "ladder", number: "10", eyebrow: "WHAT WE CAN SAY NOW · CLAIM LADDER",
        title: "Software proof is in hand. Biological qualification is the next gate.",
        body: "The evidence reaches the second rung. Reproducible execution and source records checked by digital fingerprints support the software rung. These fingerprints, called hashes, reveal when a source file has changed. The synthetic challenges provide conditional evidence about experiment design. Empirical qualification requires real material, laboratory measurements, custody, an independent reveal, and outside reproduction. Reports preserve evidence. New empirical results advance maturity.",
        proof: "SOFTWARE PROOF SUPPORTED · INDICATIVE DESIGN EVIDENCE CONDITIONAL · EMPIRICAL QUALIFICATION BLOCKED",
        claim: "EF-002 · EF-011 · EF-015 · EF-017", badge: "CLAIM MATURITY"
      },
      {
        id: "trajectory", number: "11", eyebrow: "ONE REGISTERED CELL · ALL 32 TRAJECTORIES",
        title: "Watch identical starts become different evolutionary histories.",
        body: "Each Study E vessel starts with 80 age-synchronized grazers, ten from each of eight immutable founders. All 32 registered adaptive_E07 vessels retained grazers through day 90. Standing selection still reshuffled which founders dominated. Hover to scrub. Click to hold one vessel and inspect its composition. Practitioners must forecast this distribution because a smooth average hides the histories that real populations can take.",
        proof: "32 / 32 PERSISTED TO DAY 90 · 80 INITIAL GRAZERS · 8 IMMUTABLE FOUNDERS · STANDING SELECTION ONLY",
        claim: "EF-018", badge: "REGISTERED SYNTHETIC TRAJECTORIES"
      },
      {
        id: "ask", number: "12", eyebrow: "ONE BOUNDED NEXT STEP",
        title: "Run one small round together before anyone scales.",
        body: "Bring one candidate keystone organism whose effects shape its community, one contained stressor, one feasible budget stated in USD, and one outcome sealed until scoring. We rehearse the design, then run the smallest real round that can estimate calibration and forecast accuracy under an independent reveal. The first round asks which species, traits, and measurements earn predictive power. Later contained rounds can test whether a targeted intervention improves resilience, then add interacting species, genetic backgrounds, spatial structure, and small model ecosystems. Molecular measurements expand when they change the decision.",
        proof: "ONE ORGANISM · ONE BUDGET · ONE HELD-OUT CHALLENGE · STAGED, KEYSTONE-CENTERED",
        claim: "EF-001 · EF-015", badge: "PROPOSED NEXT STEP"
      }
    ],
    modelLabels: { P1: "PEDIGREE", G1: "GENOME", GP1: "GENOME + PHENOME", R1: "FEEDBACK" },
    packageLabels: {
      abundance_only: "Abundance only", lineage_identity: "Lineage identity", pooled_genomes: "Pooled genomes",
      strategic_omics_proxy: "Strategic omics proxy", deep_phenome: "Deep phenome", genome_plus_phenome: "Genome + phenome"
    },
    challengeModes: {
      positive: { label: "Positive control", note: "Favorable marker-encoded software control", tone: "green" },
      blind: { label: "Blind result", note: "Latest prospective cells at the indicative bar", tone: "amber" },
      adverse: { label: "Adverse control", note: "Matched control with the signal removed", tone: "coral" }
    },
    finalSentence: "EvoForecast turns prediction into a testable programme decision. Measure what can discriminate, seal the outcome, score the forecast, and scale only after the evidence earns it."
  };
}(window));
