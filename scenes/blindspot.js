(function () {
  "use strict";
  function matchFact(d, s, claimId, pattern, index) {
    var row = d.fact(s, claimId), match = row && row.text.match(pattern);
    return match ? match[index || 0] : "";
  }
  // Bar fractions are presentation geometry. Every evidence label is read from
  // its immutable claim row at draw time.
  var GATES = [
    { k: "1 · AVERAGE ACCURACY", claim: "EF-007", pattern: /(\d+\.\d+)%/, frac: 0.86, pass: true, col: "#3AD6A3",
      chip: "CLEARS", note: "The genome-plus-phenome track beat the pedigree baseline in the registered model-ladder aggregate." },
    { k: "2 · CALIBRATION", claim: "EF-007", pattern: /(\d+)% nominal-(\d+)%/, range: true, frac: 0.42, pass: false, col: "#E8694D",
      chip: "FAILS", note: "Its stated ninety percent range should hold the truth nine times in ten. It held it eight." },
    { k: "3 · COMBINED GATE", claim: "EF-003", pattern: /(\d+)\/(\d+)/, spaced: true, suffix: " PROSPECTIVE", frac: 0.02, pass: false, col: "#E8694D",
      chip: "EMPTY", note: "A design passes only when accuracy and honest uncertainty clear together. None did." }
  ];

  window.EVO_SCENES.register("blindspot", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var band = s.freeBands && s.freeBands.blindspot;
    var left = 46, right = (p.width > 800 && band) ? band.left - 34 : p.width - 44;
    if (right - left < 260) { left = 30; right = p.width - 24; }
    var compact = p.height < 650;
    var w = right - left, top = compact ? 142 : 150, rowH = compact ? 56 : 62, gap = compact ? 22 : 40;

    d.lineLabel(p, "THREE SEPARATE TESTS, TAKEN IN ORDER", left, top - 24, "#9FB4BD");

    var i, y, g, bw, hover = -1, pinned = -1, grow;
    for (i = 0; i < GATES.length; i += 1) {
      y = top + i * (rowH + gap);
      if (local.hasPointer && local.my >= y - 6 && local.my <= y + rowH && local.mx >= left && local.mx <= right) { hover = i; }
      if (local.clickX >= left && local.clickX <= right && local.clickY >= y - 6 && local.clickY <= y + rowH) { pinned = i; }
    }
    var show = hover >= 0 ? hover : pinned;
    for (i = 0; i < GATES.length; i += 1) {
      g = GATES[i]; y = top + i * (rowH + gap);
      var m = matchFact(d, s, g.claim, g.pattern, g.index);
      if (g.range && m) { m = m.replace(" nominal-", " OF A ") + " RANGE"; }
      if (g.spaced && m) { m = m.replace("/", " / "); }
      var value = m ? (g.prefix || "") + m + (g.suffix || "") : "REGISTERED VALUE UNAVAILABLE";
      grow = d.fade(t, 0.05 + i * 0.14, 0.45 + i * 0.14);
      // funnel: each gate is narrower than the one above it
      bw = w * (1 - i * 0.14);
      p.noStroke(); p.fill("#243B4A"); p.rect(left, y + 14, bw, 16, 8);
      p.fill(g.col); p.rect(left, y + 14, Math.max(4, bw * g.frac * grow), 16, 8);
      d.lineLabel(p, g.k, left, y + 8, show === i ? "#F7F6F2" : "#EAF1F1");
      d.lineLabel(p, value, left, y + 46, g.col);
      // verdict chip
      var cw = g.chip.length * 8 + 18;
      p.noFill(); p.stroke(g.col); p.strokeWeight(1); p.rect(left + bw - cw, y + 38, cw, 20, 10);
      d.lineLabel(p, g.chip, left + bw - cw + 9, y + 52, g.col);
      // collapse connector
      if (i < GATES.length - 1) {
        p.stroke("rgba(232,105,77,.5)"); p.strokeWeight(1);
        p.line(left + bw * 0.5, y + rowH, left + w * (1 - (i + 1) * 0.14) * 0.5, y + rowH + gap - 8);
      }
    }
    var py0 = top + 3 * rowH + 2 * gap + 12;
    if (py0 + 68 < p.height - 44) {
      if (show >= 0) {
        d.panel(p, left, py0, w, 64, "rgba(6,20,31,.94)", GATES[show].col);
        d.wrap(p, GATES[show].note, left + 12, py0 + 10, w - 24, 52, { color: "#EAF1F1", size: 12 });
      } else {
        d.lineLabel(p, "HOVER OR CLICK A TEST", left, py0 + 24, "rgba(234,241,241,.42)");
      }
    }
    d.caveat(p, "A GOOD AVERAGE IS ONE TEST OF THREE · EF-003 / EF-007");
  });
}());
