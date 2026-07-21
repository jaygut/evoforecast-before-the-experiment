(function () {
  "use strict";
  var LAYERS = [
    { k: "STANDING VARIATION", c: "#F2A24E",
      m: "Exact founder identity, verified by fingerprinting, with a strain-matched genome rather than a public reference." },
    { k: "RECOMBINATION", c: "#F2A24E",
      m: "A chromosome-specific recombination map, qualified rather than assumed uniform across the genome." },
    { k: "PHENOTYPE + ECOLOGY", c: "#1AA89B",
      m: "Reaction norms and interaction effects measured in the intended environment, not transferred from a related taxon." },
    { k: "ASSAY OBSERVATION", c: "#1AA89B",
      m: "Detection limits, censoring, and batch drift, carried by an observation model that propagates real assay error." },
    { k: "BLIND SCORE", c: "#1AA89B",
      m: "Sealed outcomes under independent custody, revealed only after deposits close and scoring rules are frozen." }
  ];

  window.EVO_SCENES.register("genome", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var chrom = (s.genome && s.genome.chromosomes) || [];
    var band = s.freeBands && s.freeBands.genome;
    var fx = (p.width > 800 && band) ? band.right + 40 : p.width * 0.30;
    var fx1 = p.width - 44;
    var fw = Math.max(300, fx1 - fx);
    if (fw > 1000) { fw = 1000; fx1 = fx + fw; }
    var colGap = Math.min(66, fw * 0.10);
    var cw = (fw - colGap) * 0.44;
    var sxx = fx + cw + colGap, sw = fw - cw - colGap;
    var yTop = 140, i, w, y, hov = -1;

    d.lineLabel(p, "PROPOSED CUTAWAY · 10 CHROMOSOMES · NOT BUILT", fx, yTop - 20, "#F2A24E");
    chrom.forEach(function (c, i) {
      y = yTop + i * 20;
      w = cw * Math.max(0.32, c.length_fraction);
      p.stroke("#1AA89B"); p.strokeWeight(6); p.line(fx, y, fx + w, y);
      d.dot(p, fx + w * 0.5, y, 2.4, "#3AD6A3");
    });
    d.lineLabel(p, "DIPLOID · SEXUAL · STANDING VARIATION ONLY", fx, yTop + 10 * 20 + 16, "#9FB4BD");

    for (i = 0; i < LAYERS.length; i += 1) {
      y = yTop + i * 54;
      if (local.hasPointer && local.mx >= sxx && local.mx <= sxx + sw && local.my >= y && local.my <= y + 42) { hov = i; }
    }
    for (i = 0; i < LAYERS.length; i += 1) {
      y = yTop + i * 54;
      var lit = hov === i;
      d.panel(p, sxx, y, sw, 42, lit ? "rgba(26,168,155,.18)" : "rgba(14,42,71,.9)", lit ? "#F7F6F2" : LAYERS[i].c);
      d.lineLabel(p, LAYERS[i].k, sxx + 12, y + 26, lit ? "#F7F6F2" : LAYERS[i].c);
      if (i < LAYERS.length - 1) { p.stroke("rgba(26,168,155,.45)"); p.strokeWeight(1); p.line(sxx + sw / 2, y + 42, sxx + sw / 2, y + 54); }
    }

    var py0 = yTop + LAYERS.length * 54 + 22;
    if (py0 + 80 < p.height - 46) {
      if (hov >= 0) {
        d.panel(p, fx, py0, fw, 76, "rgba(6,20,31,.94)", LAYERS[hov].c);
        d.lineLabel(p, "TO PROVE " + LAYERS[hov].k + ", A REAL STUDY NEEDS", fx + 12, py0 + 20, LAYERS[hov].c);
        d.wrap(p, LAYERS[hov].m, fx + 12, py0 + 28, fw - 24, 44, { color: "#EAF1F1", size: 11.5 });
      } else {
        d.panel(p, fx, py0, fw, 76, "rgba(6,20,31,.55)", "rgba(26,168,155,.4)");
        d.lineLabel(p, "HOVER A LAYER TO SEE WHAT A REAL STUDY WOULD HAVE TO PROVE", fx + 12, py0 + 26, "rgba(234,241,241,.55)");
        d.lineLabel(p, "Software can build every layer. It cannot qualify any of them.", fx + 12, py0 + 50, "rgba(159,180,189,.8)");
      }
    }
    d.caveat(p, "NOT IMPLEMENTED OR CALIBRATED DAPHNIA GENOMICS · CLAIM EF-012");
  });
}());
