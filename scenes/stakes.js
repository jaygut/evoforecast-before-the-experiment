(function () {
  "use strict";
  window.EVO_SCENES.register("stakes", function (p, t, s, d) {
    p.background("#0E2A47"); d.ambient(p, t, 4102);
    var labels = ["SPECIES", "GENERATIONS", "POPULATIONS", "DIVERSITY", "SELECTION", "ASSAYS", "AUTOMATION"];
    // Radial hub centered in the free band beside the copy-card, never behind it.
    var band = s.freeBands && s.freeBands.stakes;
    var fx0 = (p.width > 800 && band) ? band.right + 40 : 40, fx1 = p.width - 40;
    var cx = (fx0 + fx1) / 2, cy = p.height * .5, r = Math.min((fx1 - fx0) * 0.34, p.height * 0.28), i, a;
    p.stroke("rgba(26,168,155,.58)"); p.strokeWeight(1.2);
    for (i = 0; i < labels.length; i += 1) { a = -Math.PI / 2 + i * Math.PI * 2 / labels.length; p.line(cx, cy, cx + Math.cos(a) * r * d.fade(t, .08, .68), cy + Math.sin(a) * r * d.fade(t, .08, .68)); }
    d.dot(p, cx, cy, 10, "#1AA89B"); d.lineLabel(p, "DISCRIMINATE\nFORECASTS", cx - 48, cy + 30, "#F7F6F2");
    for (i = 0; i < labels.length; i += 1) { a = -Math.PI / 2 + i * Math.PI * 2 / labels.length; var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; d.dot(p, x, y, 5, i === 5 ? "#F2A24E" : "#3AD6A3"); d.lineLabel(p, labels[i], x - 36, y + (Math.sin(a) > 0 ? 22 : -12), "#EAF1F1"); }
    d.caveat(p, "PROGRAMME COST IS ILLUSTRATIVE EXTERNAL CONTEXT · CLAIM EF-014");
  });
}());
