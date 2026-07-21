(function () {
  "use strict";
  window.EVO_SCENES.register("blindspot", function (p, t, s, d) {
    p.background("#06141F");
    // Bars live in the free band beside the copy-card, never behind it.
    var band = s.freeBands && s.freeBands.blindspot;
    var x = 44, xr = (p.width > 800 && band) ? band.left - 34 : p.width - 44, w = Math.max(260, xr - x);
    var y1 = p.height * .36, y2 = p.height * .62;
    d.lineLabel(p, "AGGREGATE SCORE", x, y1 - 26, "#EAF1F1"); d.lineLabel(p, "JOINT PROSPECTIVE GATE", x, y2 - 26, "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(x, y1, w, 18, 9); p.rect(x, y2, w, 18, 9);
    p.fill("#3AD6A3"); p.rect(x, y1, w * .475 * d.fade(t, .08, .55), 18, 9);
    p.fill("#E8694D"); p.rect(x, y2, Math.max(3, w * .02 * d.fade(t, .35, .75)), 18, 9);
    d.lineLabel(p, "+47.5% MEAN ACCURACY GAIN", x, y1 + 42, "#3AD6A3");
    d.lineLabel(p, "0 / 60 PROSPECTIVE CELLS PASSED", x, y2 + 42, "#F7F6F2");
    p.stroke("#F2A24E"); p.strokeWeight(2); p.line(x + w * .5, y2 - 8, x + w * .5, y2 + 26); d.lineLabel(p, "INDICATIVE 50%", x + w * .5 - 54, y2 + 62, "#F2A24E");
    d.caveat(p, "AVERAGE, CALIBRATION, AND THE COMBINED GATE ARE SEPARATE TESTS · EF-003 / EF-007");
  });
}());
