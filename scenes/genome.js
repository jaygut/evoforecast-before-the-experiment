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
    var fx = (p.width > 800 && band) ? band.right + 40 : 30;
    var fx1 = p.width - 44;
    var fw = Math.max(220, fx1 - fx);
    if (fw > 1000) { fw = 1000; fx1 = fx + fw; }
    var colGap = Math.min(66, fw * 0.10);
    var cw = (fw - colGap) * 0.44;
    var sxx = fx + cw + colGap, sw = fw - cw - colGap;
    var compact = p.height < 650, yTop = 140, chromStep = compact ? 14 : 20;
    var layerStep = compact ? 42 : 54, layerH = compact ? 34 : 42, i, w, y, hov = -1, pinned = -1;

    d.lineLabel(p, "PROPOSED CUTAWAY · " + chrom.length + " CHROMOSOMES · NOT BUILT", fx, yTop - 20, "#F2A24E");
    chrom.forEach(function (c, i) {
      y = yTop + i * chromStep;
      w = cw * Math.max(0.32, c.length_fraction);
      p.stroke("#1AA89B"); p.strokeWeight(6); p.line(fx, y, fx + w, y);
      d.dot(p, fx + w * 0.5, y, 2.4, "#3AD6A3");
    });
    if (compact) {
      d.label(p, "DIPLOID · SEXUAL", fx, yTop + chrom.length * chromStep + 10, { color: "#9FB4BD", size: 8 });
      d.label(p, "STANDING VARIATION ONLY", fx, yTop + chrom.length * chromStep + 22, { color: "#9FB4BD", size: 8 });
    } else { d.lineLabel(p, "DIPLOID · SEXUAL · STANDING VARIATION ONLY", fx, yTop + chrom.length * chromStep + 16, "#9FB4BD"); }

    for (i = 0; i < LAYERS.length; i += 1) {
      y = yTop + i * layerStep;
      if (local.hasPointer && local.mx >= sxx && local.mx <= sxx + sw && local.my >= y && local.my <= y + layerH) { hov = i; }
      if (local.clickX >= sxx && local.clickX <= sxx + sw && local.clickY >= y && local.clickY <= y + layerH) { pinned = i; }
    }
    var show = hov >= 0 ? hov : pinned;
    for (i = 0; i < LAYERS.length; i += 1) {
      y = yTop + i * layerStep;
      var lit = show === i;
      d.panel(p, sxx, y, sw, layerH, lit ? "rgba(26,168,155,.18)" : "rgba(14,42,71,.9)", lit ? "#F7F6F2" : LAYERS[i].c);
      d.label(p, LAYERS[i].k, sxx + 12, y + (compact ? 22 : 26), { color: lit ? "#F7F6F2" : LAYERS[i].c, size: compact ? 9 : 11 });
      if (i < LAYERS.length - 1) { p.stroke("rgba(26,168,155,.45)"); p.strokeWeight(1); p.line(sxx + sw / 2, y + layerH, sxx + sw / 2, y + layerStep); }
    }

    var py0 = yTop + LAYERS.length * layerStep + 12;
    if (py0 + 80 < p.height - 46) {
      if (show >= 0) {
        d.panel(p, fx, py0, fw, 76, "rgba(6,20,31,.94)", LAYERS[show].c);
        d.label(p, "TO PROVE " + LAYERS[show].k + (compact ? "" : ", A REAL STUDY NEEDS"), fx + 12, py0 + 20, { color: LAYERS[show].c, size: compact ? 8.5 : 11 });
        d.wrap(p, LAYERS[show].m, fx + 12, py0 + 28, fw - 24, 44, { color: "#EAF1F1", size: compact ? 9 : 11.5 });
      } else {
        d.panel(p, fx, py0, fw, 76, "rgba(6,20,31,.55)", "rgba(26,168,155,.4)");
        d.wrap(p, "HOVER OR CLICK A LAYER TO SEE WHAT A REAL STUDY WOULD HAVE TO PROVE", fx + 12, py0 + 13, fw - 24, 30, { color: "rgba(234,241,241,.55)", mono: true, size: compact ? 8 : 10 });
        d.wrap(p, "Software can build every layer. It cannot qualify any of them.", fx + 12, py0 + 45, fw - 24, 24, { color: "rgba(159,180,189,.8)", size: compact ? 9 : 11 });
      }
    }
    d.caveat(p, "NOT IMPLEMENTED OR CALIBRATED DAPHNIA GENOMICS · CLAIM EF-012");
  });
}());
