(function (root) {
  "use strict";
  root.EVO_CONFIG = {
    version: "scrolly.local-v2",
    snapshot: "20 JUL 2026",
    boundary: "SYNTHETIC SOFTWARE AND DESIGN EVIDENCE · NOT A FORECAST OF ANY REAL ORGANISM · NOT AN ENDORSEMENT, PARTNERSHIP, OR FUNDING CLAIM",
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
        id: "hero", number: "01", eyebrow: "BEFORE THE EXPERIMENT · SYNTHETIC EVIDENCE · 20 JUL 2026",
        title: "Before you commit tens of millions of pounds to predict evolution, find out whether the experiment can teach you enough.",
        body: "A research director deciding whether to fund a large evolution experiment faces a question money cannot answer after the fact. Will the experiment actually separate a good forecast from a lucky guess, or will it cost a fortune and end in the same uncertainty it started with? EvoForecast answers that question first, in software, by rehearsing the whole experiment in a synthetic world where the true outcome is already known.",
        proof: "5,600 OF 5,600 SIMULATED RUNS COMPLETED · NO DESIGN CLEARED THE BAR BEFORE THE OUTCOME WAS REVEALED",
        claim: "EF-001 · EF-002 · EF-003", badge: "SYNTHETIC SOFTWARE EVIDENCE"
      },
      {
        id: "stakes", number: "02", eyebrow: "THE COSTLY FAILURE · EXTERNAL CONTEXT",
        title: "A programme can spend more and still not tell two forecasts apart.",
        body: "Every large evolution experiment locks in choices that are hard to reverse. Which species. How many generations. How many independent populations. How much starting diversity. Which conditions, which measurements, how much automation. Spend more on any of these and you can still end up unable to say whether one model predicted better than another. Worse than a wrong answer is an experiment that cannot tell two answers apart. That is the failure worth spending to avoid.",
        proof: "A MAJOR PROGRAMME · TENS OF MILLIONS OF POUNDS · ILLUSTRATIVE, NOT A COMMITTED BUDGET",
        claim: "EF-014", badge: "EXTERNAL CONTEXT"
      },
      {
        id: "blindspot", number: "03", eyebrow: "WHY AVERAGES MISLEAD · PROSPECTIVE DISCIPLINE",
        title: "A better average can still hide a forecast that misses too often.",
        body: "In the latest synthetic challenge the richest measurement package improved the average accuracy of its forecasts by 47.5 percent over the simplest baseline. The same package was wrong about its own uncertainty. Its ninety percent prediction range should have held the truth nine times in ten. It held it eight times in ten. A design that scores well on average can still fail the test that decides a programme, which is whether its stated confidence can be trusted before the outcome is known.",
        proof: "+47.5% AVERAGE ACCURACY GAIN · 80% COVERAGE OF A 90% RANGE · 0 / 60 PROSPECTIVE CELLS PASSED",
        claim: "EF-003 · EF-007", badge: "SYNTHETIC · INDICATIVE"
      },
      {
        id: "windtunnel", number: "04", eyebrow: "THE REHEARSAL · AUDITABLE CHAIN",
        title: "Rehearse the whole experiment in a world where the answer is already known.",
        body: "EvoForecast builds a synthetic population and evolves it with SLiM 5.2, the same forward-evolution engine used in population genetics. It records the true outcome, hides it, and releases only what a real study would measure. Competing forecasters deposit predictions before the answer is revealed. Then it scores them and lines up three things a real programme cares about. How much each design learns. What each design costs. How each design fails. Because the truth is known by construction, the rehearsal can show which measurements earn their place and which only add expense.",
        proof: "DEFINE · SIMULATE WITH SLiM 5.2 · HIDE · FORECAST · REVEAL · SCORE · COMPARE LEARNING, COST, FAILURE",
        claim: "EF-013 · EF-002", badge: "REGISTERED ENGINE BOUNDARY"
      },
      {
        id: "abstain", number: "05", eyebrow: "V3 · THE POSITIVE CONTROL",
        title: "First, prove the instrument can find a signal that is really there.",
        body: "V3, V4, and V5 are successive versions of the challenge, and each had to earn trust from the start. The software has to pass an easy test before any hard one counts. In V3, EvoForecast planted a deliberately favorable, marker-encoded signal and checked that a genome-aware forecaster could recover it. It did, by 17.0 percent over a pedigree-only baseline across sixteen repeated runs. A matched control that removed the signal returned minus 9.2 percent, so the same workflow can also come back empty. This is a software control. It says nothing yet about how much real DNA would predict in a living animal.",
        proof: "+17.0% FAVORABLE CONTROL · -9.2% MATCHED ADVERSE CONTROL · 16 SEED BLOCKS",
        claim: "EF-009 · EF-010", badge: "SYNTHETIC CONTROLS"
      },
      {
        id: "rejection", number: "06", eyebrow: "V4 · THE EVIDENCE WE THREW OUT",
        title: "Next, throw out the evidence that cannot be trusted.",
        body: "V4 looked like progress and was rejected. An independent review found that the release had exposed information a forecaster should not have seen, that paired comparisons no longer matched the comparison committed in advance, and that the cost and expected-loss numbers did not hold together. None of its estimates were carried forward. A tool that keeps its own flattering but broken results is worse than no tool. The rejection belongs in the evidence, because it shows the review can stop a bad result before it reaches a decision.",
        proof: "V4 REJECTED · LEAKAGE · BROKEN PAIRING · INCOHERENT EXPECTED LOSS AND COST · NO ESTIMATE CARRIED FORWARD",
        claim: "REVIEW-V4 · EF-016", badge: "REJECTED COHORT"
      },
      {
        id: "challenge", number: "07", eyebrow: "V5 · THE SCALE-UP DECISION",
        title: "The clean run that said do not scale yet.",
        body: "V5 was the version to act on, because its predictions were locked in before the answer was revealed. The computation was clean. All 5,600 simulated runs finished with none failed. The richest design still improved the average score. The combined test asks whether a design beats the simple baseline on accuracy and on honest uncertainty at the same time. The mark is a probability, and fifty percent is no better than a coin toss. No design passed it. Zero of sixty forward-looking cells reached the fifty percent mark, where one cell is one design at one forecast horizon. Zero of eighty cells were robust. Zero of one hundred twenty experiment plans were robustly best. The added feedback measurement bought nothing beyond genome plus phenome. A clean and expensive run produced a clear instruction. Do not scale a molecular forecasting programme on this evidence yet.",
        proof: "5,600 / 5,600 CLEAN · 0 / 60 PROSPECTIVE · 0 / 80 ROBUST · 0 / 120 PLANS · +47.5% AVG, 80% COVERAGE",
        claim: "EF-002 · EF-003 · EF-004 · EF-006 · EF-007 · EF-008", badge: "OUTCOME-UNSEEN · SYNTHETIC"
      },
      {
        id: "phase", number: "08", eyebrow: "BUILD THE EXPERIMENT · LOOKUP ONLY",
        title: "Build a design and read what the frozen challenge already found.",
        body: "Choose a measurement track, a number of independent populations, and how far ahead to forecast. The instrument returns the registered result for that exact design. Position shows how much it improved and how well its uncertainty held. The ring shows the chance it passed the combined test. Every value was computed and frozen before the outcome was revealed. Moving a control looks up a stored row. It does not compute a new one.",
        proof: "PASS >= 50% INDICATIVE · ROBUST >= 80% · 80 REGISTERED DESIGNS",
        claim: "EF-003 · EF-004 · EF-005", badge: "EXPLORE · NOT SCORE"
      },
      {
        id: "frontier", number: "09", eyebrow: "WHAT TO MEASURE NEXT · LOOKUP ONLY",
        title: "More measurement helps only when it changes the answer.",
        body: "Each point is a measurement plan with its modeled resource use and its forecast value. Resource use rises to the right and forecast value rises upward. A plan earns its place only when it moves a design across the line, not when it simply adds more observations. In this synthetic challenge no plan out of one hundred twenty was robustly best, and the added feedback measurement bought nothing beyond genome plus phenome. That is the signal to stage measurement and prove calibration before expanding.",
        proof: "0 / 120 ROBUSTLY BEST PLANS · FEEDBACK TRACK +0.0% BEYOND GENOME+PHENOME",
        claim: "EF-006 · EF-008", badge: "CONDITIONAL / FRAGILE"
      },
      {
        id: "ladder", number: "10", eyebrow: "WHAT WE CAN SAY NOW · CLAIM LADDER",
        title: "The software claim is solid. The biology claim is not, yet.",
        body: "Two of these rungs are supported and two are not. Reproducible execution and hash-checked lineage support the software rung. The synthetic challenges support indicative design evidence on the second. Real material, qualified assays, custody, an independent reveal, and outside reproduction still block every empirical and operational claim. A finished report does not move a claim up this ladder. Only evidence does.",
        proof: "SOFTWARE PROOF SUPPORTED · INDICATIVE DESIGN EVIDENCE CONDITIONAL · EMPIRICAL QUALIFICATION BLOCKED",
        claim: "EF-002 · EF-011 · EF-015 · EF-017", badge: "MATURITY · NOT A SCORE"
      },
      {
        id: "genome", number: "11", eyebrow: "WHAT A REAL EXPERIMENT MUST SHOW · PROPOSED / BLOCKED",
        title: "The hard part a real study still has to prove.",
        body: "The proposed next design is diploid, ten-chromosome, sexual, and limited to standing variation. It would connect founder genomes through recombination to phenotype, ecology, the error an assay actually makes, and a blind score. None of it is built or calibrated. It marks the exact place where real material, real assays, and independent review would have to do the work software cannot.",
        proof: "10 CHROMOSOMES · PROPOSED DESIGN · RC01 REMAINS CLONAL · NOT IMPLEMENTED",
        claim: "EF-012 · EF-015", badge: "PROPOSED · EMPIRICAL GATE BLOCKED"
      },
      {
        id: "ask", number: "12", eyebrow: "ONE BOUNDED NEXT STEP",
        title: "Run one small round together before anyone scales.",
        body: "Bring one candidate keystone organism, one budget you can actually spend, and one held-out challenge. We rehearse it in the wind tunnel, then run the smallest real round that can estimate its calibration and forecast accuracy under an independent reveal. Only after that first round clears every gate do we stage up, building a network of interacting species around the keystone organism and adding several genetic backgrounds, controlled conditions, spatial structure, and small controlled model ecosystems one step at a time. Molecular layers expand last.",
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
      positive: { label: "Positive control", value: "+17.0%", note: "Favorable marker-encoded software control", tone: "green" },
      blind: { label: "Blind result", value: "0 / 60", note: "Latest prospective cells at the indicative bar", tone: "amber" },
      adverse: { label: "Adverse control", value: "-9.2%", note: "Matched control with the signal removed", tone: "coral" }
    },
    finalSentence: "EvoForecast does not claim that evolution is predictable. It shows what a real experiment would have to measure to find out, and it reports plainly when a design is not ready."
  };
}(window));
