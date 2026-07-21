(function () {
  "use strict";
  var G_LO = -0.25, G_HI = 0.65, LADDER = ["P1", "G1", "GP1", "R1"];

  function findRow(rows, model, arms, horizon) {
    for (var i = 0; i < rows.length; i += 1) {
      var r = rows[i];
      if (r.model === model && r.population_arms === String(arms) && r.information_horizon_days === String(horizon)) { return r; }
    }
    return null;
  }
  function label(row) {
    var m = (window.EVO_CONFIG && window.EVO_CONFIG.modelLabels && window.EVO_CONFIG.modelLabels[row.model]) || row.model;
    return row.model + " · " + m + " · A" + row.population_arms + " · DAY " + row.information_horizon_days;
  }
  function signedPercent(value) { return (value >= 0 ? "+" : "") + (value * 100).toFixed(1) + "%"; }

  window.EVO_SCENES.register("phase", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var rows = s.phaseRows || [], sel = s.phaseSelected || {};
    var band = s.freeBands && s.freeBands.phase;
    var left = (p.width > 800 && band) ? band.right + 28 : 36;
    var right = p.width - 40;
    if (right - left < 280) { left = 36; right = p.width - 20; }
    var top = 118, bottom = p.height - 44, colW = right - left;
    var row = findRow(rows, sel.model, sel.arms, sel.horizon);
    if (!row) { d.caveat(p, "LOOKUP ONLY · NO REGISTERED CELL FOR THIS DESIGN"); return; }

    var gain = parseFloat(row.mean_relative_crps_gain);
    var ciLo = parseFloat(row.gain_ci_low), ciHi = parseFloat(row.gain_ci_high);
    var cov = parseFloat(row.coverage_90), prob = parseFloat(row.probability_meeting_definition);
    var thresholds = s.phaseThresholds || {};
    var indicative = parseFloat(thresholds.indicative), robust = parseFloat(thresholds.robust);

    // ---- Zone 1: exact selected row ---------------------------------------
    var vh = 52, mTop = top + vh + 22;
    var yA = mTop, yB = mTop + 52, yC = mTop + 104;
    var testNotes = [
      "GAIN AND ITS STORED INTERVAL ARE SHOWN WITHOUT A BROWSER VERDICT",
      "OBSERVED COVERAGE IS SHOWN AS RECORDED IN THIS CELL",
      "THE REGISTERED PROBABILITY IS SHOWN AGAINST FROZEN THRESHOLD MARKERS"
    ];
    var shortNotes = ["RAW GAIN + STORED INTERVAL", "RAW OBSERVED COVERAGE", "RAW COMBINED PROBABILITY"];
    var testHover = -1, testPinned = -1, ti, ty;
    for (ti = 0; ti < 3; ti += 1) {
      ty = mTop + ti * 52;
      if (local.hasPointer && local.mx >= left && local.mx <= right && local.my >= ty - 4 && local.my <= ty + 40) { testHover = ti; }
      if (local.clickX >= left && local.clickX <= right && local.clickY >= ty - 4 && local.clickY <= ty + 40) { testPinned = ti; }
    }
    var showTest = testHover >= 0 ? testHover : testPinned;
    d.panel(p, left, top, colW, vh, "rgba(14,42,71,.94)", "#1AA89B");
    p.noStroke(); p.fill("#1AA89B"); p.rect(left, top, 3, vh);
    d.lineLabel(p, p.width < 600 ? row.model + " · A" + row.population_arms + " · DAY " + row.information_horizon_days : label(row), left + 16, top + 19, "#EAF1F1");
    d.label(p, "P = " + (prob * 100).toFixed(1) + "%", right - 14, top + 19, { color: "#EAF1F1", size: 11, align: p.RIGHT });
    d.label(p, showTest >= 0 ? (p.width < 600 ? shortNotes[showTest] + " · NO BROWSER VERDICT" : testNotes[showTest]) : "FROZEN REGISTERED CELL · HOVER OR CLICK A LOOKUP ROW", left + 16, top + 41, { color: showTest >= 0 ? "#3AD6A3" : "#9FB4BD", size: p.width < 600 ? 8.2 : 10 });

    // ---- Zone 2: three sub-tests -----------------------------------------
    var gut = p.width < 600 ? Math.min(144, colW * 0.44) : Math.min(138, colW * 0.34);
    var tx0 = left + gut, tx1 = right - 10, tw = tx1 - tx0;
    var gx = function (g) { return tx0 + (d.clamp(g, G_LO, G_HI) - G_LO) / (G_HI - G_LO) * tw; };
    var cxp = function (c) { return tx0 + d.clamp(c, 0, 1) * tw; };
    var grow = d.fade(t, 0.10, 0.55);

    var zx = gx(0), aCol = "#1AA89B";
    d.lineLabel(p, "1 · ACCURACY GAIN", left, yA + 16, showTest === 0 ? "#F7F6F2" : "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yA + 6, tw, 12, 6);
    p.fill(aCol); p.rect(Math.min(zx, gx(gain * grow)), yA + 8, Math.abs(gx(gain * grow) - zx), 8, 4);
    p.stroke("#EAF1F1"); p.strokeWeight(1);
    p.line(gx(ciLo), yA + 12, gx(ciHi), yA + 12);
    p.line(gx(ciLo), yA + 6, gx(ciLo), yA + 18); p.line(gx(ciHi), yA + 6, gx(ciHi), yA + 18);
    p.stroke("#5C6E78"); p.line(zx, yA + 1, zx, yA + 23);
    d.lineLabel(p, signedPercent(gain) + "  CI " + signedPercent(ciLo) + " TO " + signedPercent(ciHi), tx0, yA + 34, aCol);

    var bCol = "#1AA89B";
    d.lineLabel(p, "2 · CALIBRATION", left, yB + 16, showTest === 1 ? "#F7F6F2" : "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yB + 6, tw, 12, 6);
    p.fill(bCol); p.rect(cxp(cov * grow) - 1.5, yB + 1, 3, 22, 1.5);
    d.lineLabel(p, "OBSERVED COVERAGE " + (cov * 100).toFixed(1) + "%", tx0, yB + 34, bCol);

    d.lineLabel(p, "3 · COMBINED GATE", left, yC + 16, showTest === 2 ? "#F7F6F2" : "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yC + 6, tw, 12, 6);
    p.fill("#1AA89B"); p.rect(tx0, yC + 6, tw * d.clamp(prob * grow, 0, 1), 12, 6);
    if (!isNaN(indicative)) { p.stroke("#F2A24E"); p.strokeWeight(1.5); p.line(tx0 + tw * indicative, yC + 1, tx0 + tw * indicative, yC + 23); }
    if (!isNaN(robust)) { p.stroke("#3AD6A3"); p.line(tx0 + tw * robust, yC + 1, tx0 + tw * robust, yC + 23); }
    d.label(p, (p.width < 600 ? "P " : "PROBABILITY ") + (prob * 100).toFixed(1) + "%  ·  " + (p.width < 600 ? "LIMITS " : "FROZEN THRESHOLDS ") + (indicative * 100).toFixed(0) + "% / " + (robust * 100).toFixed(0) + "%", tx0, yC + 34, { color: "#9FB4BD", size: p.width < 600 ? 8.5 : 11 });

    // ---- Zone 3: gain x coverage plane -----------------------------------
    var planeTop = mTop + 148 + 20, planeBottom = bottom - 24;
    if (planeBottom - planeTop > 150) {
      var pL = left + 46, pR = right - 12, pT = planeTop, pB = planeBottom;
      var px = function (g) { return pL + (d.clamp(g, G_LO, G_HI) - G_LO) / (G_HI - G_LO) * (pR - pL); };
      var py = function (c) { return pB - d.clamp(c, 0, 1) * (pB - pT); };
      p.stroke("rgba(234,241,241,.22)"); p.strokeWeight(1);
      p.line(pL, pB, pR, pB); p.line(pL, pT, pL, pB);
      d.lineLabel(p, "ACCURACY GAIN →", pL, pB + 22, "#9FB4BD");
      p.push(); p.translate(pL - 30, pB); p.rotate(-Math.PI / 2); d.lineLabel(p, "COVERAGE →", 0, 0, "#9FB4BD"); p.pop();

      var i, r2, hx, hy, hover = null, pinned = null, hd = 15, cd = 15, dd;
      for (i = 0; i < rows.length; i += 1) {
        r2 = rows[i]; hx = px(parseFloat(r2.mean_relative_crps_gain)); hy = py(parseFloat(r2.coverage_90));
        d.dot(p, hx, hy, 3.4, "rgba(92,110,120,.72)");
        if (local.hasPointer && local.mx >= 0) {
          dd = p.dist(local.mx, local.my, hx, hy);
          if (dd < hd) { hd = dd; hover = r2; }
        }
        if (local.clickX >= 0) {
          dd = p.dist(local.clickX, local.clickY, hx, hy);
          if (dd < cd) { cd = dd; pinned = r2; }
        }
      }
      var inspect = hover || pinned;
      p.stroke("#1AA89B"); p.strokeWeight(1.5); p.noFill();
      var prev = null, lr;
      for (i = 0; i < LADDER.length; i += 1) {
        lr = findRow(rows, LADDER[i], sel.arms, sel.horizon);
        if (!lr) { continue; }
        hx = px(parseFloat(lr.mean_relative_crps_gain)); hy = py(parseFloat(lr.coverage_90));
        if (prev) { p.stroke("#1AA89B"); p.strokeWeight(1.5); p.line(prev.x, prev.y, hx, hy); }
        prev = { x: hx, y: hy };
        d.lineLabel(p, LADDER[i], hx + 6, hy - 7, "#1AA89B");
      }
      hx = px(gain); hy = py(cov);
      p.stroke("rgba(247,246,242,.35)"); p.strokeWeight(1);
      p.line(pL, hy, hx, hy); p.line(hx, pB, hx, hy);
      p.noFill(); p.stroke("#F7F6F2"); p.strokeWeight(3); p.circle(hx, hy, 15);

      if (inspect) {
        var tw2 = 216, th = 74;
        var ax = hover ? local.mx : px(parseFloat(inspect.mean_relative_crps_gain));
        var ay = hover ? local.my : py(parseFloat(inspect.coverage_90));
        var bx = d.clamp(ax + 14, pL, Math.max(pL, pR - tw2)), by = d.clamp(ay - th - 8, pT, pB - th);
        d.panel(p, bx, by, tw2, th, "rgba(6,20,31,.95)", "#1AA89B");
        d.lineLabel(p, label(inspect), bx + 10, by + 18, "#F7F6F2");
        d.lineLabel(p, "GAIN " + signedPercent(parseFloat(inspect.mean_relative_crps_gain)) + "   COV " + (parseFloat(inspect.coverage_90) * 100).toFixed(1) + "%", bx + 10, by + 36, "#EAF1F1");
        var hp = parseFloat(inspect.probability_meeting_definition);
        d.lineLabel(p, "COMBINED PROBABILITY " + (hp * 100).toFixed(1) + "%", bx + 10, by + 54, "#1AA89B");
      } else {
        d.lineLabel(p, "HOVER OR CLICK A DESIGN", pR - 164, pT + 12, "rgba(234,241,241,.42)");
      }
    } else {
      var infoY = yC + 48;
      d.panel(p, left, infoY, colW, 62, "rgba(6,20,31,.76)", showTest >= 0 ? "#1AA89B" : "rgba(26,168,155,.4)");
      d.lineLabel(p, showTest >= 0 ? (showTest + 1) + " · " + shortNotes[showTest] : "HOVER OR CLICK ONE OF THE THREE LOOKUP ROWS", left + 12, infoY + 25, showTest >= 0 ? "#EAF1F1" : "rgba(234,241,241,.52)");
      d.lineLabel(p, "CELL PLANE NEEDS A TALLER VIEWPORT", left + 12, infoY + 47, "#9FB4BD");
    }
    d.caveat(p, "LOOKUP ONLY · FROZEN CELLS · PASS NEEDS GAIN, CALIBRATION AND THE GATE TOGETHER");
  });
}());
