(function () {
  "use strict";
  var CTRL = {
    favorable: { k: "FAVORABLE CONTROL", event: "v3_positive", c: "#3AD6A3",
      note: "A deliberately planted, marker-encoded signal. A genome-aware forecaster recovered it over a pedigree-only baseline across the registered repeated runs. This shows the instrument can recover a planted software signal." },
    adverse: { k: "ADVERSE CONTROL", event: "v3_adverse", c: "#E8694D",
      note: "The same workflow with the planted signal removed. It came back empty. An instrument that cannot return empty cannot be trusted when it returns a result." },
    abstain: { k: "ABSTAIN", c: "#F7F6F2",
      note: "Both controls are software checks on marker-encoded signal. Neither estimates how much real DNA would predict in a living animal." }
  };
  function eventMetric(s, eventId) {
    var rows = s.timeline && s.timeline.events, row = null, match, i;
    for (i = 0; rows && i < rows.length; i += 1) { if (rows[i].id === eventId) { row = rows[i]; break; } }
    match = row && row.detail.match(/[+\-\u2212]?\d+(?:\.\d+)?%/);
    return match ? match[0].replace("\u2212", "-") : "NO REGISTERED VALUE";
  }

  window.EVO_SCENES.register("abstain", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var band = s.freeBands && s.freeBands.abstain;
    var fx0 = (p.width > 800 && band) ? band.right + 30 : 40;
    var fx1 = p.width - 40;
    if (fx1 - fx0 < 260) { fx0 = 30; fx1 = p.width - 24; }
    var cx = (fx0 + fx1) / 2, cy = p.height * 0.46, r = Math.min((fx1 - fx0) * 0.38, p.height * 0.26);

    function pickAt(mx, my) {
      var selected = "abstain", ang = Math.atan2(my - cy, mx - cx), rad = p.dist(mx, my, cx, cy);
      if (rad > r * 0.45 && rad < r * 1.45 && ang <= 0.15 && ang >= -Math.PI - 0.15) {
        if (ang < -Math.PI * 0.62) { selected = "favorable"; }
        else if (ang > -Math.PI * 0.38) { selected = "adverse"; }
      }
      return selected;
    }
    var hoverPick = (local.hasPointer && local.mx >= 0) ? pickAt(local.mx, local.my) : "abstain";
    var pinnedPick = local.clickX >= 0 ? pickAt(local.clickX, local.clickY) : "abstain";
    var pick = hoverPick !== "abstain" ? hoverPick : pinnedPick;
    var lit = pick !== "abstain";

    p.noFill(); p.stroke("rgba(234,241,241,.18)"); p.strokeWeight(16); p.arc(cx, cy, r * 2, r * 2, -Math.PI, 0);
    p.stroke(pick === "favorable" ? "#5BE8BC" : "#3AD6A3"); p.strokeWeight(pick === "favorable" ? 20 : 16);
    p.arc(cx, cy, r * 2, r * 2, -Math.PI, -Math.PI * .33 * d.fade(t, .05, .55) - Math.PI * .66);
    p.stroke(pick === "adverse" ? "#FF8467" : "#E8694D"); p.strokeWeight(pick === "adverse" ? 20 : 16);
    p.arc(cx, cy, r * 2, r * 2, -Math.PI * .33, 0);

    p.stroke("#F7F6F2"); p.strokeWeight(3);
    var angle = -Math.PI + Math.PI * d.fade(t, .1, .8) * .42;
    p.line(cx, cy, cx + Math.cos(angle) * r * .84, cy + Math.sin(angle) * r * .84);

    d.lineLabel(p, "FAVORABLE " + eventMetric(s, "v3_positive"), cx - r, cy + 44, pick === "favorable" ? "#5BE8BC" : "#3AD6A3");
    d.lineLabel(p, "ADVERSE " + eventMetric(s, "v3_adverse"), cx + r - 108, cy + 44, pick === "adverse" ? "#FF8467" : "#E8694D");
    d.lineLabel(p, "ABSTAIN", cx - 34, cy + 8, "#F7F6F2");

    var c = CTRL[pick], py0 = cy + 74, pw = Math.min(fx1 - fx0, 460), pxx = cx - pw / 2;
    if (py0 + 116 < p.height - 44) {
      d.panel(p, pxx, py0, pw, 112, "rgba(6,20,31,.94)", c.c);
      d.lineLabel(p, c.k + (c.event ? " · " + eventMetric(s, c.event) : ""), pxx + 12, py0 + 20, c.c);
      d.wrap(p, c.note, pxx + 12, py0 + 28, pw - 24, 76, { color: "#EAF1F1", size: 11.5 });
      if (!lit) { d.lineLabel(p, "HOVER OR CLICK EITHER CONTROL", pxx + 12, py0 + 104, "rgba(234,241,241,.42)"); }
    }
    d.caveat(p, "MATCHED SYNTHETIC CONTROLS · FAILURE IS A VALID RESULT · EF-009 / EF-010");
  });
}());
