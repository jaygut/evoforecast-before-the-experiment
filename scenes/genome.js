(function () {
  "use strict";
  window.EVO_SCENES.register("genome", function (p, t, s, d) {
    p.background("#08203A");
    var chrom = (s.genome && s.genome.chromosomes) || [];
    var band = s.freeBands && s.freeBands.genome;
    // Lay everything out in the free band beside the copy-card, never behind it.
    var fx = (p.width > 800 && band) ? band.right + 40 : p.width * 0.30;
    var fx1 = p.width - 44;
    var fw = Math.max(300, fx1 - fx);
    var colGap = Math.min(66, fw * 0.10);
    var cw = (fw - colGap) * 0.46;      // chromosome column width
    var sxx = fx + cw + colGap;          // stage column x
    var sw = fw - cw - colGap;           // stage column width
    var yTop = 128, i, w, y;
    d.lineLabel(p, "PROPOSED CUTAWAY · 10 CHROMOSOMES", fx, yTop - 22, "#F2A24E");
    chrom.forEach(function (c, i) {
      y = yTop + i * 20;
      w = cw * Math.max(0.32, c.length_fraction);
      p.stroke("#1AA89B"); p.strokeWeight(6); p.line(fx, y, fx + w, y);
      d.dot(p, fx + w * 0.5, y, 2.4, "#3AD6A3");
    });
    var stages = ["STANDING VARIATION", "RECOMBINATION", "PHENOTYPE + ECOLOGY", "ASSAY OBSERVATION", "BLIND SCORE"];
    stages.forEach(function (label, i) {
      y = yTop + i * 54;
      d.panel(p, sxx, y, sw, 42, "rgba(14,42,71,.9)", i < 2 ? "#F2A24E" : "#1AA89B");
      d.lineLabel(p, label, sxx + 12, y + 26, i < 2 ? "#F2A24E" : "#EAF1F1");
    });
    d.caveat(p, "NOT IMPLEMENTED OR CALIBRATED DAPHNIA GENOMICS · CLAIM EF-012");
  });
}());
