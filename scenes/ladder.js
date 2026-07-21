(function () {
  "use strict";
  window.EVO_SCENES.register("ladder", function (p, t, s, d) {
    p.background("#08203A");
    var levels = [
      { label: "SOFTWARE PROOF", note: "REPRODUCIBLE / HASH-BOUND", c: "#3AD6A3" },
      { label: "INDICATIVE DESIGN EVIDENCE", note: "SYNTHETIC / CONDITIONAL", c: "#F2A24E" },
      { label: "EMPIRICAL QUALIFICATION", note: "BLOCKED", c: "#E8694D" },
      { label: "OPERATIONAL FORECASTING", note: "FUTURE", c: "#E8694D" }
    ];
    // Staircase lives in the free band beside the copy-card, never behind it.
    var band = s.freeBands && s.freeBands.ladder;
    var x0 = 46, xr = (p.width > 800 && band) ? band.left - 34 : p.width - 44;
    var maxw = Math.max(240, xr - x0 - 3 * 28), y = p.height - 120, h = 56;
    levels.forEach(function (level, i) {
      var yy = y - i * (h + 18), ww = maxw - i * 8, xx = x0 + i * 28;
      d.panel(p, xx, yy, ww, h, "rgba(14,42,71,.94)", level.c);
      d.lineLabel(p, String(i + 1).padStart(2, "0") + " · " + level.label, xx + 16, yy + 23, level.c);
      d.lineLabel(p, level.note, xx + 16, yy + 43, "#EAF1F1");
    });
    d.caveat(p, "GREEN MARKS SUPPORTED SOFTWARE FACTS · NOT BIOLOGICAL VALIDATION · EF-015");
  });
}());
