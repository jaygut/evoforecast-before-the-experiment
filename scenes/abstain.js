(function () {
  "use strict";
  var CTRL = {
    favorable: { k: "FAVORABLE CONTROL · +17.0%", c: "#3AD6A3",
      note: "A deliberately planted, marker-encoded signal. A genome-aware forecaster recovered it over a pedigree-only baseline across sixteen repeated runs. This proves the instrument can find a signal that is really there." },
    adverse: { k: "ADVERSE CONTROL · -9.2%", c: "#E8694D",
      note: "The same workflow with the planted signal removed. It came back empty. An instrument that cannot return empty cannot be trusted when it returns a result." },
    abstain: { k: "ABSTAIN", c: "#F7F6F2",
      note: "Both controls are software checks on marker-encoded signal. Neither estimates how much real DNA would predict in a living animal." }
  };

  window.EVO_SCENES.register("abstain", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var band = s.freeBands && s.freeBands.abstain;
    var fx0 = (p.width > 800 && band) ? band.right + 30 : 40;
    var fx1 = p.width - 40;
    if (fx1 - fx0 < 260) { fx0 = 30; fx1 = p.width - 24; }
    var cx = (fx0 + fx1) / 2, cy = p.height * 0.46, r = Math.min((fx1 - fx0) * 0.38, p.height * 0.26);

    // hover zone by angle around the dial
    var pick = "abstain", ang, rad;
    if (local.hasPointer && local.mx >= 0) {
      ang = Math.atan2(local.my - cy, local.mx - cx);
      rad = p.dist(local.mx, local.my, cx, cy);
      if (rad > r * 0.45 && rad < r * 1.45 && ang <= 0.15 && ang >= -Math.PI - 0.15) {
        if (ang < -Math.PI * 0.62) { pick = "favorable"; }
        else if (ang > -Math.PI * 0.38) { pick = "adverse"; }
      }
    }
    var lit = (local.hasPointer && pick !== "abstain");

    p.noFill(); p.stroke("rgba(234,241,241,.18)"); p.strokeWeight(16); p.arc(cx, cy, r * 2, r * 2, -Math.PI, 0);
    p.stroke(pick === "favorable" ? "#5BE8BC" : "#3AD6A3"); p.strokeWeight(pick === "favorable" ? 20 : 16);
    p.arc(cx, cy, r * 2, r * 2, -Math.PI, -Math.PI * .33 * d.fade(t, .05, .55) - Math.PI * .66);
    p.stroke(pick === "adverse" ? "#FF8467" : "#E8694D"); p.strokeWeight(pick === "adverse" ? 20 : 16);
    p.arc(cx, cy, r * 2, r * 2, -Math.PI * .33, 0);

    p.stroke("#F7F6F2"); p.strokeWeight(3);
    var angle = -Math.PI + Math.PI * d.fade(t, .1, .8) * .42;
    p.line(cx, cy, cx + Math.cos(angle) * r * .84, cy + Math.sin(angle) * r * .84);

    d.lineLabel(p, "FAVORABLE +17.0%", cx - r, cy + 44, pick === "favorable" ? "#5BE8BC" : "#3AD6A3");
    d.lineLabel(p, "ADVERSE -9.2%", cx + r - 108, cy + 44, pick === "adverse" ? "#FF8467" : "#E8694D");
    d.lineLabel(p, "ABSTAIN", cx - 34, cy + 8, "#F7F6F2");

    var c = CTRL[pick], py0 = cy + 74, pw = Math.min(fx1 - fx0, 460), pxx = cx - pw / 2;
    if (py0 + 78 < p.height - 44) {
      d.panel(p, pxx, py0, pw, 74, "rgba(6,20,31,.94)", c.c);
      d.lineLabel(p, c.k, pxx + 12, py0 + 20, c.c);
      d.wrap(p, c.note, pxx + 12, py0 + 28, pw - 24, 40, { color: "#EAF1F1", size: 11.5 });
      if (!lit) { d.lineLabel(p, "HOVER EITHER CONTROL", pxx + 12, py0 + 66, "rgba(234,241,241,.42)"); }
    }
    d.caveat(p, "MATCHED SYNTHETIC CONTROLS · FAILURE IS A VALID RESULT · EF-009 / EF-010");
  });
}());
