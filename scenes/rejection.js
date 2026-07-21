(function () {
  "use strict";
  window.EVO_SCENES.register("rejection", function (p, t, s, d) {
    p.background("#06141F");
    var band = s.freeBands && s.freeBands.rejection;
    // Draw in the free band on whichever side the copy-card is not.
    var x0, x1;
    if (p.width > 800 && band) {
      if ((band.left + band.right) / 2 > p.width * 0.5) { x0 = 48; x1 = band.left - 34; }
      else { x0 = band.right + 34; x1 = p.width - 44; }
    } else { x0 = 48; x1 = p.width - 44; }
    var w = Math.max(180, x1 - x0);
    var defects = [
      "HIDDEN INFO REACHED THE FORECASTER",
      "PAIRED COMPARISONS BROKE THE UNIT",
      "COST AND EXPECTED LOSS DID NOT COHERE",
      "UNCERTAINTY COULD NOT DECIDE"
    ];
    var top = p.height * 0.18, rowH = 38, gap = 13, i, y, reveal;
    for (i = 0; i < defects.length; i += 1) {
      y = top + i * (rowH + gap);
      reveal = d.fade(t, 0.05 + i * 0.11, 0.34 + i * 0.11);
      d.panel(p, x0, y, w * Math.max(0.08, reveal), rowH, "rgba(14,42,71,.92)", "#E8694D");
      if (reveal > 0.55) {
        d.lineLabel(p, defects[i], x0 + 14, y + 23, "#EAF1F1");
        p.stroke("#E8694D"); p.strokeWeight(1.5);
        p.line(x0 + 8, y + rowH * 0.5, x0 + 8 + (w - 16) * d.fade(t, 0.30 + i * 0.10, 0.58 + i * 0.10), y + rowH * 0.5);
      }
    }
    var sy = top + defects.length * (rowH + gap) + 18;
    var stampT = d.fade(t, 0.55, 0.82);
    if (stampT > 0.02) {
      p.noFill(); p.stroke("#E8694D"); p.strokeWeight(2.5); p.rect(x0, sy, 176, 42, 6);
      d.lineLabel(p, "V4 REJECTED", x0 + 18, sy + 27, "#E8694D");
      d.lineLabel(p, "NO ESTIMATE CARRIED FORWARD", x0 + 18, sy + 66, "#EAF1F1");
    }
    d.caveat(p, "INDEPENDENT REVIEW DISPOSITION · V4 ESTIMATES ARE NOT SCIENTIFIC EVIDENCE · REVIEW-V4");
  });
}());
