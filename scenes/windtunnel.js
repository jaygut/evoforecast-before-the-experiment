(function () {
  "use strict";
  window.EVO_SCENES.register("windtunnel", function (p, t, s, d) {
    p.background("#08203A");
    var labels = ["PARAMETERS", "SLiM 5.2", "LATENT WORLD", "OBSERVATION", "FORECAST", "DEPOSIT", "REVEAL", "SCORE", "DECIDE"];
    var band = s.freeBands && s.freeBands.windtunnel;
    var gx0 = (p.width > 800 && band) ? band.right + 30 : 34;
    var gx1 = p.width - 34, gap = 8, cols = 3;
    var w = Math.max(120, (gx1 - gx0 - gap * (cols - 1)) / cols), h = 62, i, row, col, x, y;
    for (i = 0; i < labels.length; i += 1) {
      row = Math.floor(i / 3); col = i % 3; x = gx0 + col * (w + gap); y = 100 + row * (h + 30);
      if (i < labels.length * d.fade(t, 0, .85)) {
        d.panel(p, x, y, w, h, "rgba(14,42,71,.94)", i === 1 ? "#3AD6A3" : "#1AA89B");
        d.lineLabel(p, String(i + 1).padStart(2, "0") + " · " + labels[i], x + 11, y + 22, i === 1 ? "#3AD6A3" : "#EAF1F1");
        if (col < 2 && i < labels.length - 1) { p.stroke("#1AA89B"); p.strokeWeight(1); p.line(x + w, y + h / 2, x + w + gap, y + h / 2); }
      }
    }
    d.lineLabel(p, "PYTHON ORCHESTRATES / RELEASES / SCORES", gx0, p.height - 62, "#E9E1CC");
    d.caveat(p, "SLiM IS THE SOLE BIOLOGICAL TRAJECTORY ENGINE · CLAIM EF-013");
  });
}());
