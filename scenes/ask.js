(function () {
  "use strict";
  var ITEMS = [
    { n: "01", k: "ONE CANDIDATE KEYSTONE ORGANISM",
      s: "A functionally influential species whose keystone role can be established experimentally, so the network has an interface." },
    { n: "02", k: "ONE SPENDABLE BUDGET",
      s: "A budget that can actually be committed, so the design is bounded by what is real rather than by ambition." },
    { n: "03", k: "ONE HELD-OUT CHALLENGE",
      s: "Targets sealed before any forecast is deposited, so the result cannot be talked into existence afterwards." }
  ];

  window.EVO_SCENES.register("ask", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F"); d.ambient(p, t, 4111);
    var band = s.freeBands && s.freeBands.ask, x0, x1;
    if (p.width > 800 && band) {
      if ((p.width - band.right) >= band.left) { x0 = band.right + 34; x1 = p.width - 40; }
      else { x0 = 40; x1 = band.left - 34; }
    } else { x0 = 30; x1 = p.width - 30; }
    if (x1 - x0 < 240) { x0 = 30; x1 = p.width - 30; }
    var w = Math.min(x1 - x0, 520), cw = w, cx0 = x0 + (x1 - x0 - w) / 2;
    var top = 150, ch = 62, gap = 20, i, y, hov = -1;

    for (i = 0; i < ITEMS.length; i += 1) {
      y = top + i * (ch + gap);
      if (local.hasPointer && local.mx >= cx0 && local.mx <= cx0 + cw && local.my >= y && local.my <= y + ch) { hov = i; }
    }
    for (i = 0; i < ITEMS.length; i += 1) {
      y = top + i * (ch + gap);
      var lit = hov === i, appear = d.fade(t, 0.05 + i * 0.12, 0.4 + i * 0.12);
      if (appear < 0.02) { continue; }
      d.panel(p, cx0, y, cw, ch, lit ? "rgba(26,168,155,.20)" : "rgba(14,42,71,.94)", lit ? "#F7F6F2" : (i === 2 ? "#3AD6A3" : "#1AA89B"));
      d.lineLabel(p, ITEMS[i].n, cx0 + 16, y + 26, i === 2 ? "#3AD6A3" : "#1AA89B");
      d.lineLabel(p, ITEMS[i].k, cx0 + 44, y + 26, lit ? "#F7F6F2" : "#EAF1F1");
      if (lit) { d.wrap(p, ITEMS[i].s, cx0 + 44, y + 34, cw - 60, 26, { color: "#9FB4BD", size: 11 }); }
      if (i < ITEMS.length - 1) { p.stroke("rgba(26,168,155,.5)"); p.strokeWeight(1); p.line(cx0 + cw / 2, y + ch, cx0 + cw / 2, y + ch + gap); }
    }

    var oy = top + 3 * (ch + gap) + 8;
    if (oy + 70 < p.height - 46) {
      p.noFill(); p.stroke("#3AD6A3"); p.strokeWeight(1.4);
      if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([5, 4]); }
      p.rect(cx0, oy, cw, 62, 8);
      if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([]); }
      d.lineLabel(p, "THEN REHEARSE IT, THEN RUN THE SMALLEST REAL ROUND", cx0 + 16, oy + 26, "#3AD6A3");
      d.lineLabel(p, "that can estimate calibration under an independent reveal.", cx0 + 16, oy + 46, "#9FB4BD");
    }
    if (hov < 0) { d.lineLabel(p, "HOVER AN INPUT", cx0, top - 16, "rgba(234,241,241,.42)"); }
    d.caveat(p, "PROPOSED BOUNDED CO-DESIGN · EMPIRICAL QUALIFICATION REMAINS BLOCKED");
  });
}());
