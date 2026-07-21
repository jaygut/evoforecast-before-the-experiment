(function () {
  "use strict";
  var STAGES = [
    { n: "01", k: "PARAMETERS", s: "Registered design and priors, frozen before any run.", rel: "the registered design", hid: "nothing yet" },
    { n: "02", k: "SLiM 5.2", s: "The registered engine for this round builds a world whose true answer exists by construction. The harness is engine-agnostic and other simulators are under evaluation.", rel: "engine version and seed roles", hid: "the true trajectory" },
    { n: "03", k: "LATENT WORLD", s: "Ground truth is recorded in full, then sealed.", rel: "nothing", hid: "every latent state" },
    { n: "04", k: "OBSERVATION", s: "Only what a real study could actually measure is released.", rel: "noisy observations at registered horizons", hid: "the latent truth" },
    { n: "05", k: "FORECAST", s: "Competing measurement designs predict the held-out targets.", rel: "the released observations", hid: "the answer" },
    { n: "06", k: "DEPOSIT", s: "Predictions are locked and hashed before anything is revealed.", rel: "immutable deposits", hid: "the answer" },
    { n: "07", k: "REVEAL", s: "Only now is the sealed outcome opened.", rel: "the sealed outcome", hid: "nothing further" },
    { n: "08", k: "SCORE", s: "Proper scoring against ground truth, on rules frozen in advance.", rel: "scores and calibration", hid: "nothing" },
    { n: "09", k: "DECIDE", s: "Learning, cost and failure compared, then scale or redesign.", rel: "the verdict", hid: "nothing" }
  ];

  window.EVO_SCENES.register("windtunnel", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var band = s.freeBands && s.freeBands.windtunnel;
    var gx0 = (p.width > 800 && band) ? band.right + 30 : 30;
    var gx1 = p.width - 34;
    if (gx1 - gx0 < 280) { gx0 = 24; gx1 = p.width - 24; }
    // Cap the grid and centre it in the free band so it never overruns wide screens.
    var avail = gx1 - gx0, gw = Math.min(avail, 1020);
    gx0 = gx0 + (avail - gw) / 2; gx1 = gx0 + gw;
    var gap = 9, cols = 3;
    var w = Math.max(96, (gx1 - gx0 - gap * (cols - 1)) / cols), h = 56;
    var top = 132, rowGap = 56;

    var i, row, col, x, y, hovered = -1, boxes = [];
    for (i = 0; i < STAGES.length; i += 1) {
      row = Math.floor(i / 3); col = i % 3;
      x = gx0 + col * (w + gap);
      y = top + row * (h + rowGap);
      boxes.push({ x: x, y: y, w: w, h: h });
      if (local.hasPointer && local.mx >= x && local.mx <= x + w && local.my >= y && local.my <= y + h) { hovered = i; }
    }
    var pinned = -1;
    if (local.clickX >= 0) {
      for (i = 0; i < boxes.length; i += 1) {
        if (local.clickX >= boxes[i].x && local.clickX <= boxes[i].x + boxes[i].w && local.clickY >= boxes[i].y && local.clickY <= boxes[i].y + boxes[i].h) { pinned = i; }
      }
    }
    var show = hovered >= 0 ? hovered : pinned;

    // The blind boundary: everything above is done without seeing the answer.
    // Sits exactly midway between the deposit row and the reveal row.
    var by = top + 2 * (h + rowGap) - rowGap / 2;
    p.stroke("#E8694D"); p.strokeWeight(1.4);
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([6, 5]); }
    p.line(gx0, by, gx1, by);
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([]); }
    d.label(p, "BLIND BOUNDARY · PREDICTIONS ARE DEPOSITED ABOVE THIS LINE", (gx0 + gx1) / 2, by - 11, { color: "#E8694D", size: 11, align: p.CENTER });

    var reveal = d.fade(t, 0, 0.85);
    for (i = 0; i < STAGES.length; i += 1) {
      if (i >= STAGES.length * reveal + 0.001 && reveal < 1) { continue; }
      var b = boxes[i], lit = (show === i);
      var edge = i === 1 ? "#3AD6A3" : (i >= 6 ? "#1AA89B" : "#1AA89B");
      d.panel(p, b.x, b.y, b.w, b.h, lit ? "rgba(26,168,155,.20)" : "rgba(14,42,71,.94)", lit ? "#F7F6F2" : edge);
      d.lineLabel(p, STAGES[i].n + " · " + STAGES[i].k, b.x + 11, b.y + 22, lit ? "#F7F6F2" : (i === 1 ? "#3AD6A3" : "#EAF1F1"));
      if (i % 3 < 2) { p.stroke("#1AA89B"); p.strokeWeight(1); p.line(b.x + b.w, b.y + b.h / 2, b.x + b.w + gap, b.y + b.h / 2); }
    }

    // Disclosure panel: what this stage releases, and what it withholds.
    var py0 = top + 3 * (h + rowGap) + 6, ph = 82;
    if (py0 + ph < p.height - 46) {
      if (show >= 0) {
        var st = STAGES[show];
        d.panel(p, gx0, py0, gx1 - gx0, ph, "rgba(6,20,31,.94)", "#1AA89B");
        d.lineLabel(p, st.n + " · " + st.k, gx0 + 12, py0 + 20, "#F7F6F2");
        d.wrap(p, st.s, gx0 + 12, py0 + 28, gx1 - gx0 - 24, 26, { color: "#EAF1F1", size: 11.5 });
        d.lineLabel(p, "RELEASED: " + st.rel, gx0 + 12, py0 + 60, "#3AD6A3");
        d.lineLabel(p, "HIDDEN: " + st.hid, gx0 + 12, py0 + 74, "#E8694D");
      } else {
        d.panel(p, gx0, py0, gx1 - gx0, ph, "rgba(6,20,31,.55)", "rgba(26,168,155,.4)");
        d.lineLabel(p, "HOVER A STAGE TO SEE WHAT IT RELEASES AND WHAT IT HIDES", gx0 + 12, py0 + 24, "rgba(234,241,241,.55)");
        d.lineLabel(p, "The truth exists from stage 03. It stays sealed until stage 07.", gx0 + 12, py0 + 46, "rgba(159,180,189,.8)");
      }
    }

    d.lineLabel(p, "PYTHON ORCHESTRATES / RELEASES / SCORES", gx0, p.height - 60, "#E9E1CC");
    d.caveat(p, "SLiM 5.2 IS THE REGISTERED ENGINE THIS ROUND · HARNESS IS ENGINE-AGNOSTIC · EF-013");
  });
}());
