(function () {
  "use strict";
  var NODES = [
    { label: "SPECIES", note: "Choose organisms whose roles can be measured and distinguished." },
    { label: "GENERATIONS", note: "Allow enough time for the registered forecast horizon to become observable." },
    { label: "POPULATIONS", note: "Replication determines whether competing forecasts can be told apart." },
    { label: "DIVERSITY", note: "Founder diversity sets which standing differences the design can test." },
    { label: "SELECTION", note: "The environment must create a contrast that the held-out forecast can resolve." },
    { label: "ASSAYS", note: "Measurement error and detection limits determine what the forecaster actually sees." },
    { label: "AUTOMATION", note: "Automation expands throughput only after the informative comparisons are fixed." }
  ];

  window.EVO_SCENES.register("stakes", function (p, t, s, d, local) {
    local = local || {};
    p.background("#0E2A47"); d.ambient(p, t, 4102);
    // Radial hub centered in the free band beside the copy-card, never behind it.
    var band = s.freeBands && s.freeBands.stakes;
    var fx0 = (p.width > 800 && band) ? band.right + 40 : 40, fx1 = p.width - 40;
    if (fx1 - fx0 < 250) { fx0 = 28; fx1 = p.width - 28; }
    var cx = (fx0 + fx1) / 2, cy = p.height * (p.height < 650 ? .46 : .43), r = Math.min((fx1 - fx0) * 0.34, p.height * 0.24), i, a;
    var pts = [{ x: cx, y: cy, label: "DISCRIMINATE FORECASTS", note: "Fix the design choices that make rival forecasts separable before scale-up." }];
    for (i = 0; i < NODES.length; i += 1) {
      a = -Math.PI / 2 + i * Math.PI * 2 / NODES.length;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, label: NODES[i].label, note: NODES[i].note });
    }
    var hover = -1, pinned = -1, hd = 28, cd = 28, dd;
    if (local.hasPointer && local.mx >= 0) {
      for (i = 0; i < pts.length; i += 1) {
        dd = p.dist(local.mx, local.my, pts[i].x, pts[i].y);
        if (dd < hd) { hd = dd; hover = i; }
      }
    }
    if (local.clickX >= 0) {
      for (i = 0; i < pts.length; i += 1) {
        dd = p.dist(local.clickX, local.clickY, pts[i].x, pts[i].y);
        if (dd < cd) { cd = dd; pinned = i; }
      }
    }
    var show = hover >= 0 ? hover : pinned;
    p.stroke("rgba(26,168,155,.58)"); p.strokeWeight(1.2);
    for (i = 1; i < pts.length; i += 1) {
      p.line(cx, cy, d.lerp(cx, pts[i].x, d.fade(t, .08, .68)), d.lerp(cy, pts[i].y, d.fade(t, .08, .68)));
    }
    d.dot(p, cx, cy, show === 0 ? 13 : 10, "#1AA89B");
    d.label(p, "DISCRIMINATE", cx, cy + 28, { color: "#F7F6F2", size: 10, align: p.CENTER });
    d.label(p, "FORECASTS", cx, cy + 42, { color: "#F7F6F2", size: 10, align: p.CENTER });
    for (i = 1; i < pts.length; i += 1) {
      a = -Math.PI / 2 + (i - 1) * Math.PI * 2 / NODES.length;
      d.dot(p, pts[i].x, pts[i].y, show === i ? 8 : 5, i === 6 ? "#F2A24E" : "#3AD6A3");
      d.label(p, pts[i].label, pts[i].x, pts[i].y + (Math.sin(a) > 0 ? 22 : -12), { color: show === i ? "#F7F6F2" : "#EAF1F1", size: 10, align: p.CENTER });
    }
    var py0 = d.clamp(cy + r + 50, 286, p.height - 124), ph = 68;
    if (show >= 0) {
      d.panel(p, fx0, py0, fx1 - fx0, ph, "rgba(6,20,31,.94)", "#1AA89B");
      d.lineLabel(p, pts[show].label, fx0 + 12, py0 + 20, "#3AD6A3");
      d.wrap(p, pts[show].note, fx0 + 12, py0 + 28, fx1 - fx0 - 24, 34, { color: "#EAF1F1", size: 11.5 });
    } else {
      d.lineLabel(p, "HOVER OR CLICK A DESIGN CHOICE", fx0, py0 + 24, "rgba(234,241,241,.48)");
    }
    d.caveat(p, "PROGRAMME COST IS ILLUSTRATIVE EXTERNAL CONTEXT · CLAIM EF-014");
  });
}());
