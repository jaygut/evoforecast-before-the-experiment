(function () {
  "use strict";
  var LEVELS = [
    { label: "SOFTWARE PROOF", short: "SOFTWARE PROOF", note: "REPRODUCIBLE / HASH-BOUND", c: "#3AD6A3", state: "SUPPORTED",
      moves: "Held by reproducible execution, hash-checked lineage, and a clean-room rebuild from the recorded provenance." },
    { label: "INDICATIVE DESIGN EVIDENCE", short: "INDICATIVE DESIGN", note: "SYNTHETIC / CONDITIONAL", c: "#F2A24E", state: "CONDITIONAL",
      moves: "Held by blind synthetic rounds. It strengthens with more environments, a transfer test, and a second engine." },
    { label: "EMPIRICAL QUALIFICATION", short: "EMPIRICAL", note: "BLOCKED", c: "#E8694D", state: "BLOCKED",
      moves: "Needs exact material, qualified assays, custody, and an independent reveal on living organisms." },
    { label: "OPERATIONAL FORECASTING", short: "OPERATIONAL", note: "FUTURE", c: "#E8694D", state: "FUTURE",
      moves: "Needs a qualified round reproduced by an outside group before anything informs a decision in the field." }
  ];

  window.EVO_SCENES.register("ladder", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var band = s.freeBands && s.freeBands.ladder;
    var x0 = 46, xr = (p.width > 800 && band) ? band.left - 34 : p.width - 44;
    if (xr - x0 < 260) { x0 = 30; xr = p.width - 24; }
    var compact = p.height < 650;
    var maxw = Math.max(190, xr - x0 - 3 * 26), top = compact ? 112 : 156, h = compact ? 56 : 62, gap = compact ? 8 : 22, i, y, hov = -1, pinned = -1;

    if (!compact) { d.lineLabel(p, "WHAT WOULD MOVE EACH RUNG", x0, top - 30, "#9FB4BD"); }

    for (i = 0; i < LEVELS.length; i += 1) {
      y = top + (LEVELS.length - 1 - i) * (h + gap);
      var xx = x0 + i * 26, ww = maxw - i * 6;
      if (local.hasPointer && local.mx >= xx && local.mx <= xx + ww && local.my >= y && local.my <= y + h) { hov = i; }
      if (local.clickX >= xx && local.clickX <= xx + ww && local.clickY >= y && local.clickY <= y + h) { pinned = i; }
    }
    var show = hov >= 0 ? hov : pinned;
    for (i = 0; i < LEVELS.length; i += 1) {
      var L = LEVELS[i];
      y = top + (LEVELS.length - 1 - i) * (h + gap);
      var xx = x0 + i * 26, ww = maxw - i * 6, lit = show === i;
      d.panel(p, xx, y, ww, h, lit ? "rgba(26,168,155,.18)" : "rgba(14,42,71,.94)", lit ? "#F7F6F2" : L.c);
      d.label(p, String(i + 1).padStart(2, "0") + " · " + (compact ? L.short : L.label), xx + 16, y + (compact ? 18 : 25), { color: L.c, size: p.width < 500 ? 8.2 : 11 });
      d.lineLabel(p, L.note, xx + 16, y + 45, "#EAF1F1");
      // state chip on the right edge of the rung
      var chw = L.state.length * (p.width < 500 ? 7 : 8) + 18;
      p.noFill(); p.stroke(L.c); p.strokeWeight(1); p.rect(xx + ww - chw - 12, y + (compact ? 5 : 20), chw, compact ? 18 : 22, 11);
      d.label(p, L.state, xx + ww - chw - 3, y + (compact ? 18 : 35), { color: L.c, size: compact ? 8 : 11 });
    }

    var py0 = top + LEVELS.length * h + (LEVELS.length - 1) * gap + 18;
    if (py0 + 88 < p.height - 46) {
      if (show >= 0) {
        d.panel(p, x0, py0, maxw, 84, "rgba(6,20,31,.94)", LEVELS[show].c);
        d.label(p, LEVELS[show].label, x0 + 12, py0 + 20, { color: LEVELS[show].c, size: compact ? 8.5 : 11 });
        d.wrap(p, LEVELS[show].moves, x0 + 12, py0 + 28, maxw - 24, 52, { color: "#EAF1F1", size: compact ? 9 : 11.5 });
      } else {
        d.panel(p, x0, py0, maxw, 72, "rgba(6,20,31,.55)", "rgba(26,168,155,.4)");
        d.wrap(p, "HOVER OR CLICK A RUNG TO SEE WHAT WOULD MOVE IT", x0 + 12, py0 + 13, maxw - 24, 26, { color: "rgba(234,241,241,.55)", mono: true, size: compact ? 8 : 10 });
        d.wrap(p, "A finished report moves nothing. Only evidence does.", x0 + 12, py0 + 42, maxw - 24, 24, { color: "rgba(159,180,189,.8)", size: compact ? 9 : 11 });
      }
    }
    d.caveat(p, "GREEN MARKS SUPPORTED SOFTWARE FACTS · NOT BIOLOGICAL VALIDATION · EF-015");
  });
}());
