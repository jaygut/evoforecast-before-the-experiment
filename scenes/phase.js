(function () {
  "use strict";
  var G_LO = -0.10, G_HI = 0.55, LADDER = ["P1", "G1", "GP1", "R1"];

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
    var vCol = prob >= 0.8 ? "#3AD6A3" : (prob >= 0.5 ? "#F2A24E" : "#E8694D");
    var vWord = prob >= 0.8 ? "ROBUST" : (prob >= 0.5 ? "INDICATIVE ONLY" : "NOT READY · REDESIGN");

    // ---- Zone 1: verdict stamp -------------------------------------------
    var vh = 48, drop = d.fade(t, 0.02, 0.35);
    d.panel(p, left, top, colW, vh, "rgba(14,42,71,.94)", vCol);
    p.noStroke(); p.fill(vCol); p.rect(left, top, 3, vh);
    d.lineLabel(p, label(row), left + 16, top + 19, "#EAF1F1");
    d.label(p, "P = " + (prob * 100).toFixed(1) + "%", right - 14, top + 19, { color: "#EAF1F1", size: 11, align: p.RIGHT });
    p.noStroke(); p.fill(vCol); p.textFont("IBM Plex Mono"); p.textSize(13); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.BASELINE);
    p.text(vWord, left + 16, top + 39 + (1 - drop) * 6);

    // ---- Zone 2: three sub-tests -----------------------------------------
    var mTop = top + vh + 22, gut = Math.min(138, colW * 0.34);
    var tx0 = left + gut, tx1 = right - 10, tw = tx1 - tx0;
    var gx = function (g) { return tx0 + (d.clamp(g, G_LO, G_HI) - G_LO) / (G_HI - G_LO) * tw; };
    var cxp = function (c) { return tx0 + d.clamp(c, 0, 1) * tw; };
    var grow = d.fade(t, 0.10, 0.55);

    var yA = mTop, zx = gx(0);
    var aState = ciLo > 0 ? 2 : (gain > 0 ? 1 : 0);
    var aCol = aState === 2 ? "#3AD6A3" : (aState === 1 ? "#F2A24E" : "#E8694D");
    d.lineLabel(p, "1 · ACCURACY GAIN", left, yA + 16, "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yA + 6, tw, 12, 6);
    p.fill(aCol); p.rect(Math.min(zx, gx(gain * grow)), yA + 8, Math.abs(gx(gain * grow) - zx), 8, 4);
    p.stroke("#EAF1F1"); p.strokeWeight(1);
    p.line(gx(ciLo), yA + 12, gx(ciHi), yA + 12);
    p.line(gx(ciLo), yA + 6, gx(ciLo), yA + 18); p.line(gx(ciHi), yA + 6, gx(ciHi), yA + 18);
    p.stroke("#5C6E78"); p.line(zx, yA + 1, zx, yA + 23);
    d.lineLabel(p, (gain >= 0 ? "+" : "") + (gain * 100).toFixed(1) + "%  " + (aState === 2 ? "INTERVAL CLEARS ZERO" : "INTERVAL STILL TOUCHES ZERO"), tx0, yA + 34, aCol);

    var yB = mTop + 52;
    var bCol = (cov >= 0.85 && cov <= 0.95) ? "#3AD6A3" : (cov < 0.85 ? "#E8694D" : "#F2A24E");
    d.lineLabel(p, "2 · CALIBRATION", left, yB + 16, "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yB + 6, tw, 12, 6);
    p.fill("rgba(58,214,163,.30)"); p.rect(cxp(0.85), yB + 3, cxp(0.95) - cxp(0.85), 18, 3);
    p.fill(bCol); p.rect(cxp(cov * grow) - 1.5, yB + 1, 3, 22, 1.5);
    d.lineLabel(p, (cov * 100).toFixed(1) + "% OF A 90% RANGE  " + (bCol === "#3AD6A3" ? "CALIBRATED" : (cov < 0.85 ? "OVER-CONFIDENT" : "UNDER-CONFIDENT")), tx0, yB + 34, bCol);

    var yC = mTop + 104;
    d.lineLabel(p, "3 · COMBINED GATE", left, yC + 16, "#EAF1F1");
    p.noStroke(); p.fill("#243B4A"); p.rect(tx0, yC + 6, tw, 12, 6);
    p.fill(vCol); p.rect(tx0, yC + 6, tw * d.clamp(prob * grow, 0, 1), 12, 6);
    p.stroke("#F2A24E"); p.strokeWeight(1.5); p.line(tx0 + tw * 0.5, yC + 1, tx0 + tw * 0.5, yC + 23);
    p.stroke("#3AD6A3"); p.line(tx0 + tw * 0.8, yC + 1, tx0 + tw * 0.8, yC + 23);
    d.lineLabel(p, "INDICATIVE 50%   ROBUST 80%", tx0 + tw * 0.5 + 6, yC + 34, "#9FB4BD");

    // ---- Zone 3: gain x coverage plane -----------------------------------
    var planeTop = mTop + 148 + 20, planeBottom = bottom - 24;
    if (planeBottom - planeTop > 150) {
      var pL = left + 46, pR = right - 12, pT = planeTop, pB = planeBottom;
      var px = function (g) { return pL + (d.clamp(g, G_LO, G_HI) - G_LO) / (G_HI - G_LO) * (pR - pL); };
      var py = function (c) { return pB - d.clamp(c, 0, 1) * (pB - pT); };
      p.noStroke(); p.fill("rgba(58,214,163,.13)"); p.rect(pL, py(0.95), pR - pL, py(0.85) - py(0.95));
      p.fill("rgba(58,214,163,.20)"); p.rect(px(0), py(0.95), pR - px(0), py(0.85) - py(0.95));
      p.noFill(); p.stroke("#3AD6A3"); p.strokeWeight(1);
      if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([4, 4]); }
      p.rect(px(0), py(0.95), pR - px(0), py(0.85) - py(0.95));
      if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([]); }
      d.lineLabel(p, "PASS REGION · EMPTY", px(0) + 8, py(0.95) - 7, "#3AD6A3");
      p.stroke("rgba(234,241,241,.22)"); p.strokeWeight(1);
      p.line(pL, pB, pR, pB); p.line(pL, pT, pL, pB);
      d.lineLabel(p, "ACCURACY GAIN →", pL, pB + 22, "#9FB4BD");
      p.push(); p.translate(pL - 30, pB); p.rotate(-Math.PI / 2); d.lineLabel(p, "COVERAGE →", 0, 0, "#9FB4BD"); p.pop();

      var i, r2, hx, hy, hover = null, hd = 15, dd, pr;
      for (i = 0; i < rows.length; i += 1) {
        r2 = rows[i]; hx = px(parseFloat(r2.mean_relative_crps_gain)); hy = py(parseFloat(r2.coverage_90));
        pr = parseFloat(r2.probability_meeting_definition);
        d.dot(p, hx, hy, 3.4, pr >= 0.8 ? "#3AD6A3" : (pr >= 0.5 ? "#F2A24E" : "rgba(92,110,120,.55)"));
        if (local.hasPointer && local.mx >= 0) {
          dd = p.dist(local.mx, local.my, hx, hy);
          if (dd < hd) { hd = dd; hover = r2; }
        }
      }
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

      if (hover) {
        var tw2 = 216, th = 74;
        var bx = d.clamp(local.mx + 14, pL, Math.max(pL, pR - tw2)), by = d.clamp(local.my - th - 8, pT, pB - th);
        d.panel(p, bx, by, tw2, th, "rgba(6,20,31,.95)", "#1AA89B");
        d.lineLabel(p, label(hover), bx + 10, by + 18, "#F7F6F2");
        d.lineLabel(p, "GAIN " + (parseFloat(hover.mean_relative_crps_gain) * 100).toFixed(1) + "%   COV " + (parseFloat(hover.coverage_90) * 100).toFixed(1) + "%", bx + 10, by + 36, "#EAF1F1");
        var hp = parseFloat(hover.probability_meeting_definition);
        d.lineLabel(p, "COMBINED " + (hp * 100).toFixed(1) + "%  " + (hp >= 0.5 ? "INDICATIVE" : "BELOW GATE"), bx + 10, by + 54, hp >= 0.5 ? "#F2A24E" : "#E8694D");
      } else {
        d.lineLabel(p, "HOVER A DESIGN", pR - 110, pT + 12, "rgba(234,241,241,.42)");
      }
    }
    d.caveat(p, "LOOKUP ONLY · FROZEN CELLS · PASS NEEDS GAIN, CALIBRATION AND THE GATE TOGETHER");
  });
}());
