(function () {
  "use strict";
  window.EVO_SCENES.register("abstain", function (p, t, s, d) {
    p.background("#06141F");
    // Center the gauge in the free band beside the copy-card, never behind it.
    var band = s.freeBands && s.freeBands.abstain;
    var fx0 = (p.width > 800 && band) ? band.right + 30 : 40;
    var fx1 = p.width - 40;
    var cx = (fx0 + fx1) / 2, cy = p.height * 0.5, r = Math.min((fx1 - fx0) * 0.40, p.height * 0.30);
    p.noFill(); p.stroke("rgba(234,241,241,.18)"); p.strokeWeight(16); p.arc(cx, cy, r * 2, r * 2, -Math.PI, 0);
    p.stroke("#3AD6A3"); p.arc(cx, cy, r * 2, r * 2, -Math.PI, -Math.PI * .33 * d.fade(t, .05, .55) - Math.PI * .66);
    p.stroke("#E8694D"); p.arc(cx, cy, r * 2, r * 2, -Math.PI * .33, 0);
    p.stroke("#F7F6F2"); p.strokeWeight(3); var angle = -Math.PI + Math.PI * d.fade(t, .1, .8) * .42; p.line(cx, cy, cx + Math.cos(angle) * r * .84, cy + Math.sin(angle) * r * .84);
    d.lineLabel(p, "FAVORABLE +17.0%", cx - r, cy + 44, "#3AD6A3"); d.lineLabel(p, "ADVERSE -9.2%", cx + r - 108, cy + 44, "#E8694D");
    d.lineLabel(p, "ABSTAIN", cx - 34, cy + 8, "#F7F6F2");
    d.caveat(p, "MATCHED SYNTHETIC CONTROLS · FAILURE IS A VALID RESULT · EF-009 / EF-010");
  });
}());
