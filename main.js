(function (root, doc) {
  "use strict";
  var config = root.EVO_CONFIG;
  var instances = {};
  var active = {};
  var rafPending = false;
  var reduced = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data = { phase: null, portfolio: null, timeline: null, genome: null, facts: null };
  var state = {
    phaseRows: [], phaseSelected: { cohort: "blind_v5", model: "GP1", arms: 16, horizon: 60 },
    portfolioRows: [], portfolioSelected: { package: "genome_plus_phenome", horizon: 60 },
    timeline: null, genome: null, facts: null, phaseThresholds: null, challengeMode: "blind", freeBands: {}
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function byId(id) { return doc.getElementById(id); }
  function text(id, value) { var n = byId(id); if (n) { n.textContent = value; } }
  function setStatus(message) { text("interaction-status", message); }
  function factRow(claimId) {
    var rows = data.facts && data.facts.claims;
    if (!rows) { return null; }
    return rows.find(function (row) { return row.claim_id === claimId; }) || null;
  }
  function timelineRow(eventId) {
    var rows = data.timeline && data.timeline.events;
    if (!rows) { return null; }
    return rows.find(function (row) { return row.id === eventId; }) || null;
  }
  function challengeValue(mode) {
    var row, match;
    if (mode === "positive" || mode === "adverse") {
      row = timelineRow(mode === "positive" ? "v3_positive" : "v3_adverse");
      match = row && row.detail.match(/[+\-\u2212]?\d+(?:\.\d+)?%/);
    } else {
      row = factRow("EF-003");
      match = row && row.text.match(/\d+\/\d+/);
    }
    return match ? match[0].replace("\u2212", "-").replace("/", " / ") : "registered row unavailable";
  }
  function updateChallengeReadout() {
    var m = config.challengeModes[state.challengeMode];
    text("challenge-readout", m.label + " · " + challengeValue(state.challengeMode) + " · " + m.note);
  }

  function loadJSON(url) {
    return root.fetch(url, { cache: "no-store" }).then(function (response) {
      if (!response.ok) { throw new Error(url + " returned " + response.status); }
      return response.json();
    });
  }

  // Prefer the embedded classic bundle (window.EVO_DATA) so the interactive
  // layer works from a file:// double-click, where fetch() is blocked by CORS.
  // fetch() is only an online fallback when the bundle is absent.
  function loadData() {
    var d = root.EVO_DATA;
    if (d && d.phase && d.portfolio && d.timeline && d.genome && d.facts) {
      state.dataSource = "embedded bundle";
      return Promise.resolve([d.phase, d.portfolio, d.timeline, d.genome, d.facts]);
    }
    state.dataSource = "fetched mirror";
    return Promise.all([
      loadJSON("data/phase_cells.json"), loadJSON("data/portfolio.json"), loadJSON("data/challenge_timeline.json"),
      loadJSON("data/genome_cutaway.json"), loadJSON("data/facts_digest.json")
    ]);
  }

  function hydrateCopy() {
    config.scenes.forEach(function (scene) {
      var section = byId(scene.id);
      if (!section) { return; }
      ["eyebrow", "title", "body", "proof", "claim", "badge"].forEach(function (key) {
        var node = section.querySelector("[data-field='" + key + "']");
        if (node) { node.textContent = scene[key]; }
      });
    });
    text("claim-boundary-text", config.boundary);
    text("final-sentence", config.finalSentence);
    text("snapshot-date", config.snapshot);
  }

  function getSceneProgress(section) {
    if (reduced) { return 1; }
    var rect = section.getBoundingClientRect();
    return clamp((root.innerHeight * .84 - rect.top) / Math.max(1, rect.height - root.innerHeight * .16), 0, 1);
  }

  function update() {
    rafPending = false;
    if (doc.hidden) { return; }
    config.scenes.forEach(function (scene) {
      var section = byId(scene.id);
      if (instances[scene.id]) { instances[scene.id].render(getSceneProgress(section)); }
    });
    var nearest = null, distance = Infinity;
    config.scenes.forEach(function (scene) {
      var rect = byId(scene.id).getBoundingClientRect();
      var next = Math.abs(rect.top - root.innerHeight * .32);
      if (next < distance) { distance = next; nearest = scene.id; }
    });
    doc.querySelectorAll(".scene-nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + nearest) { link.setAttribute("aria-current", "step"); }
      else { link.removeAttribute("aria-current"); }
    });
  }

  function requestUpdate() { if (!rafPending) { rafPending = true; root.requestAnimationFrame(update); } }

  function createScene(id) {
    if (instances[id]) { return; }
    var host = byId("visual-" + id);
    if (!host) { return; }
    var instance = root.EVO_SCENES.create(id, host, state);
    if (instance) { instances[id] = instance; }
  }

  function measureFreeBands() {
    config.scenes.forEach(function (scene) {
      var visual = byId("visual-" + scene.id);
      var section = byId(scene.id);
      var card = section && section.querySelector(".copy-card");
      if (!visual || !card) { return; }
      var vr = visual.getBoundingClientRect(), cr = card.getBoundingClientRect();
      state.freeBands[scene.id] = {
        left: clamp(cr.left - vr.left, 0, vr.width), right: clamp(cr.right - vr.left, 0, vr.width),
        top: clamp(cr.top - vr.top, 0, vr.height), bottom: clamp(cr.bottom - vr.top, 0, vr.height),
        canvasWidth: vr.width, canvasHeight: vr.height
      };
      if (instances[scene.id]) { instances[scene.id].setState(state); }
    });
  }

  function installObservers() {
    var observer = new root.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting) { createScene(id); active[id] = true; if (instances[id]) { instances[id].setActive(true); } }
        else { active[id] = false; if (instances[id]) { instances[id].setActive(false); } }
      });
      requestUpdate();
    }, { rootMargin: "25% 0px 25% 0px", threshold: [0, .01, .5] });
    config.scenes.forEach(function (scene) { observer.observe(byId(scene.id)); });
  }

  function phaseRow() {
    return state.phaseRows.find(function (row) {
      return row.model === state.phaseSelected.model && row.population_arms === String(state.phaseSelected.arms) && row.information_horizon_days === String(state.phaseSelected.horizon);
    });
  }
  function updatePhase() {
    var cohorts = data.phase.cohorts;
    state.phaseRows = cohorts[state.phaseSelected.cohort];
    var row = phaseRow();
    if (!row) { return; }
    text("phase-readout", state.phaseSelected.cohort.replace("_", " ").toUpperCase() + " · " + (config.modelLabels[state.phaseSelected.model] || state.phaseSelected.model) + " · " + state.phaseSelected.arms + " populations · day " + state.phaseSelected.horizon + " · single-cell lookup · combined-test probability " + (parseFloat(row.probability_meeting_definition) * 100).toFixed(1) + "% · accuracy gain " + (parseFloat(row.mean_relative_crps_gain) * 100).toFixed(1) + "% · coverage " + (parseFloat(row.coverage_90) * 100).toFixed(1) + "%");
    if (instances.phase) { instances.phase.setState(state); }
    setStatus("Phase cell updated. Lookup only; no values were recalculated.");
  }

  function updateFrontier() {
    state.portfolioRows = data.portfolio.cohorts.blind_v5;
    var matches = state.portfolioRows.filter(function (row) {
      return row.measurement_package === state.portfolioSelected.package && row.information_horizon_days === String(state.portfolioSelected.horizon);
    });
    var claim = data.facts.claims.find(function (row) { return row.claim_id === "EF-006"; });
    text("frontier-readout", config.packageLabels[state.portfolioSelected.package] + " · day " + state.portfolioSelected.horizon + (matches.length ? " · exact frozen rows across registered population counts · " + (claim ? claim.text : "See each row's stored status in the figure.") : " · no registered row"));
    if (instances.frontier) { instances.frontier.setState(state); }
    setStatus("Portfolio filter updated. Display remains a preregistered lookup.");
  }

  function installControls() {
    var arms = [8,16,24,48,96], horizons = [14,30,60,90];
    byId("phase-cohort").addEventListener("change", function (e) { state.phaseSelected.cohort = e.target.value; updatePhase(); });
    byId("phase-model").addEventListener("change", function (e) { state.phaseSelected.model = e.target.value; updatePhase(); });
    byId("phase-arms").addEventListener("input", function (e) { state.phaseSelected.arms = arms[parseInt(e.target.value,10)]; text("phase-arms-value", state.phaseSelected.arms); e.target.setAttribute("aria-valuetext", state.phaseSelected.arms + " populations"); updatePhase(); });
    byId("phase-horizon").addEventListener("input", function (e) { state.phaseSelected.horizon = horizons[parseInt(e.target.value,10)]; text("phase-horizon-value", state.phaseSelected.horizon); e.target.setAttribute("aria-valuetext", "day " + state.phaseSelected.horizon); updatePhase(); });
    byId("frontier-package").addEventListener("change", function (e) { state.portfolioSelected.package = e.target.value; updateFrontier(); });
    byId("frontier-horizon").addEventListener("input", function (e) { state.portfolioSelected.horizon = horizons[parseInt(e.target.value,10)]; text("frontier-horizon-value", state.portfolioSelected.horizon); e.target.setAttribute("aria-valuetext", "day " + state.portfolioSelected.horizon); updateFrontier(); });
    doc.querySelectorAll("[data-challenge-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.challengeMode = button.getAttribute("data-challenge-mode");
        doc.querySelectorAll("[data-challenge-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b === button ? "true" : "false"); });
        if (instances.challenge) { instances.challenge.setState(state); }
        var m = config.challengeModes[state.challengeMode];
        updateChallengeReadout();
        setStatus("Challenge reference changed to " + m.label + ".");
      });
    });
  }

  function installKeyboard() {
    doc.addEventListener("keydown", function (event) {
      if (/INPUT|SELECT|BUTTON|TEXTAREA/.test(doc.activeElement.tagName)) { return; }
      if (event.key !== "j" && event.key !== "k" && event.key !== "J" && event.key !== "K") { return; }
      event.preventDefault();
      var current = doc.querySelector(".scene-nav a[aria-current='step']");
      var index = current ? parseInt(current.getAttribute("data-index"), 10) : 0;
      index = clamp(index + (/j/i.test(event.key) ? 1 : -1), 0, config.scenes.length - 1);
      byId(config.scenes[index].id).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }

  function boot() {
    doc.documentElement.classList.add("js");
    hydrateCopy();
    loadData().then(function (values) {
      data.phase=values[0]; data.portfolio=values[1]; data.timeline=values[2]; data.genome=values[3]; data.facts=values[4];
      state.timeline=data.timeline; state.genome=data.genome; state.facts=data.facts; state.phaseThresholds=data.phase.thresholds; updatePhase(); updateFrontier(); updateChallengeReadout();
      installControls(); installObservers(); installKeyboard(); requestUpdate();
      measureFreeBands();
      if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(function () { measureFreeBands(); requestUpdate(); }); }
      text("load-status", "Evidence loaded from the " + (state.dataSource || "offline bundle") + " · " + data.facts.claims.length + " registered claims · lookup only");
      byId("load-status").classList.add("is-loaded");
    }).catch(function (error) {
      text("load-status", "Static reading remains available. Interactive evidence could not load: " + error.message);
      doc.documentElement.classList.add("load-failed");
    });
    root.addEventListener("scroll", requestUpdate, { passive: true });
    root.addEventListener("resize", function () { measureFreeBands(); Object.keys(instances).forEach(function (id) { if (instances[id]) { instances[id].resize(); } }); requestUpdate(); });
    doc.addEventListener("visibilitychange", function () { Object.keys(instances).forEach(function (id) { if (instances[id]) { instances[id].setActive(!doc.hidden && active[id]); } }); });
  }
  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", boot); } else { boot(); }
}(window, document));
