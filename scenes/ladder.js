(function () {
  "use strict";
  var LEVELS = [
    { label: "SOFTWARE PROOF", note: "REPRODUCIBLE / HASH-BOUND", c: "#3AD6A3", state: "SUPPORTED",
      moves: "Held by reproducible execution, hash-checked lineage, and a clean-room rebuild from the recorded provenance." },
    { label: "INDICATIVE DESIGN EVIDENCE", note: "SYNTHETIC / CONDITIONAL", c: "#F2A24E", state: "CONDITIONAL",
      moves: "Held by blind synthetic rounds. It strengthens with more environments, a transfer test, and a second engine." },
    { label: "EMPIRICAL QUALIFICATION", note: "BLOCKED", c: "#E8694D", state: "BLOCKED",
      moves: "Needs exact material, qualified assays, custody, and an independent reveal on living organisms." },
    { label: "OPERATIONAL FORECASTING", note: "FUTURE", c: "#E8694D", state: "FUTURE",
      moves: "Needs a qualified round reproduced by an outside group before anything informs a decision in the field." }
  ];

  window.EVO_SCENES.register("ladder", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var band = s.freeBands && s.freeBands.ladder;
    var x0 = 46, xr = (p.width > 800 && band) ? band.left - 34 : p.width - 44;
    if (xr - x0 < 260) { x0 = 30; xr = p.width - 24; }
    var maxw = Math.max(240, xr - x0 - 3 * 26), top = 156, h = 62, gap = 22, i, y, hov = -1;

    d.lineLabel(p, "WHAT WOULD MOVE EACH RUNG", x0, 126, "#9FB4BD");

    for (i = 0; i < LEVELS.length; i += 1) {
      y = top + (LEVELS.length - 1 - i) * (h + gap);
      var xx = x0 + i * 26, ww = maxw - i * 6;
      if (local.hasPointer && local.mx >= xx && local.mx <= xx + ww && local.my >= y && local.my <= y + h) { hov = i; }
    }
    for (i = 0; i < LEVELS.length; i += 1) {
      var L = LEVELS[i];
      y = top + (LEVELS.length - 1 - i) * (h + gap);
      var xx = x0 + i * 26, ww = maxw - i * 6, lit = hov === i;
      d.panel(p, xx, y, ww, h, lit ? "rgba(26,168,155,.18)" : "rgba(14,42,71,.94)", lit ? "#F7F6F2" : L.c);
      d.lineLabel(p, String(i + 1).padStart(2, "0") + " · " + L.label, xx + 16, y + 25, L.c);
      d.lineLabel(p, L.note, xx + 16, y + 45, "#EAF1F1");
      // state chip on the right edge of the rung
      var chw = L.state.length * 8 + 18;
      p.noFill(); p.stroke(L.c); p.strokeWeight(1); p.rect(xx + ww - chw - 12, y + 20, chw, 22, 11);
      d.lineLabel(p, L.state, xx + ww - chw - 3, y + 35, L.c);
    }

    var py0 = top + LEVELS.length * (h + gap) + 10;
    if (py0 + 76 < p.height - 46) {
      if (hov >= 0) {
        d.panel(p, x0, py0, maxw, 72, "rgba(6,20,31,.94)", LEVELS[hov].c);
        d.lineLabel(p, LEVELS[hov].label, x0 + 12, py0 + 20, LEVELS[hov].c);
        d.wrap(p, LEVELS[hov].moves, x0 + 12, py0 + 28, maxw - 24, 40, { color: "#EAF1F1", size: 11.5 });
      } else {
        d.panel(p, x0, py0, maxw, 72, "rgba(6,20,31,.55)", "rgba(26,168,155,.4)");
        d.lineLabel(p, "HOVER A RUNG TO SEE WHAT WOULD MOVE IT", x0 + 12, py0 + 26, "rgba(234,241,241,.55)");
        d.lineLabel(p, "A finished report moves nothing. Only evidence does.", x0 + 12, py0 + 48, "rgba(159,180,189,.8)");
      }
    }
    d.caveat(p, "GREEN MARKS SUPPORTED SOFTWARE FACTS · NOT BIOLOGICAL VALIDATION · EF-015");
  });
}());
