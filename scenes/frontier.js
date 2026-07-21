(function () {
  "use strict";
  var RU_LO = 1.6, RU_HI = 8.8, FU_LO = -0.11, FU_HI = 0.055;
  var FAM = {
    abundance_only: "#5C6E78",
    lineage_identity: "#0E7A70",
    pooled_genomes: "#1AA89B",
    deep_phenome: "#E9E1CC",
    genome_plus_phenome: "#3AD6A3",
    strategic_omics_proxy: "#E8694D"
  };
  function pkgLabel(k) {
    return (window.EVO_CONFIG && window.EVO_CONFIG.packageLabels && window.EVO_CONFIG.packageLabels[k]) || k;
  }

  window.EVO_SCENES.register("frontier", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var rows = s.portfolioRows || [], sel = s.portfolioSelected || {};
    var band = s.freeBands && s.freeBands.frontier;
    var left = 46, right = (p.width > 800 && band) ? band.left - 28 : p.width - 40;
    if (right - left < 280) { left = 30; right = p.width - 20; }
    var top = 118, bottom = p.height - 44;
    if (!rows.length) { d.caveat(p, "LOOKUP ONLY · 0 / 120 CLASSIFIED ROBUSTLY BEST · CLAIM EF-006"); return; }

    // Counters over frozen status labels (presentation count, no scoring).
    var nRobust = 0, nFragile = 0, nDom = 0, i, r, maxFU = -Infinity, ceilLo = Infinity, ceilHi = -Infinity;
    for (i = 0; i < rows.length; i += 1) {
      r = rows[i];
      if (r.status === "robustly_pareto_optimal") { nRobust += 1; }
      else if (r.status === "conditional_fragile") { nFragile += 1; }
      else { nDom += 1; }
      if (parseFloat(r.forecast_utility) > maxFU) { maxFU = parseFloat(r.forecast_utility); }
    }
    for (i = 0; i < rows.length; i += 1) {
      r = rows[i];
      if (Math.abs(parseFloat(r.forecast_utility) - maxFU) < 1e-9) {
        ceilLo = Math.min(ceilLo, parseFloat(r.normalized_resource_units));
        ceilHi = Math.max(ceilHi, parseFloat(r.normalized_resource_units));
      }
    }

    // Counter strip
    var cy0 = top + 4;
    d.lineLabel(p, "ROBUST " + nRobust + " / " + rows.length, left, cy0 + 10, "#E8694D");
    d.lineLabel(p, "CONDITIONAL " + nFragile, left + 150, cy0 + 10, "#F2A24E");
    d.lineLabel(p, "DOMINATED " + nDom, left + 280, cy0 + 10, "#5C6E78");

    var pL = left + 48, pR = right - 12, pT = top + 64, pB = bottom - 34;
    var px = function (u) { return pL + (d.clamp(u, RU_LO, RU_HI) - RU_LO) / (RU_HI - RU_LO) * (pR - pL); };
    var py = function (v) { return pB - (d.clamp(v, FU_LO, FU_HI) - FU_LO) / (FU_HI - FU_LO) * (pB - pT); };

    // Nothing reaches above the ceiling: shade it and say so.
    p.noStroke(); p.fill("rgba(232,105,77,.08)"); p.rect(pL, pT, pR - pL, py(maxFU) - pT);
    p.stroke("#E8694D"); p.strokeWeight(1.2);
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([5, 4]); }
    p.line(pL, py(maxFU), pR, py(maxFU));
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([]); }
    d.lineLabel(p, "VALUE CEILING · NO PLAN REACHES HIGHER", pL + 8, py(maxFU) - 8, "#E8694D");

    // Break-even
    p.stroke("rgba(92,110,120,.7)"); p.strokeWeight(1);
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([3, 4]); }
    p.line(pL, py(0), pR, py(0));
    if (p.drawingContext.setLineDash) { p.drawingContext.setLineDash([]); }
    d.lineLabel(p, "BREAK-EVEN", pR - 88, py(0) - 6, "#5C6E78");

    // Axes
    p.stroke("rgba(234,241,241,.22)"); p.strokeWeight(1);
    p.line(pL, pB, pR, pB); p.line(pL, pT, pL, pB);
    d.lineLabel(p, "RESOURCE USE (MODELLED) →", pL, pB + 24, "#9FB4BD");
    p.push(); p.translate(pL - 32, pB); p.rotate(-Math.PI / 2); d.lineLabel(p, "FORECAST VALUE →", 0, 0, "#9FB4BD"); p.pop();

    // Marks
    var hover = null, hd = 13, dd, x, y, on, col, appear = d.fade(t, 0.05, 0.7);
    for (i = 0; i < rows.length; i += 1) {
      r = rows[i];
      x = px(parseFloat(r.normalized_resource_units)); y = py(parseFloat(r.forecast_utility));
      if ((parseFloat(r.normalized_resource_units) - RU_LO) / (RU_HI - RU_LO) > appear) { continue; }
      on = (!sel.package || r.measurement_package === sel.package);
      col = FAM[r.measurement_package] || "#5C6E78";
      if (on) { d.dot(p, x, y, 4.2, col); }
      else { d.dot(p, x, y, 3, "rgba(92,110,120,.22)"); }
      if (on && parseFloat(r.pareto_membership_probability) >= 0.8) {
        p.noFill(); p.stroke("#F2A24E"); p.strokeWeight(1.4); p.circle(x, y, 14);
      }
      if (local.hasPointer && local.mx >= 0) { dd = p.dist(local.mx, local.my, x, y); if (dd < hd) { hd = dd; hover = r; } }
    }

    // Legend
    var keys = Object.keys(FAM), lx = pL, ly = top + 32, k;
    for (i = 0; i < keys.length; i += 1) {
      k = keys[i];
      if (i === 3) { lx = pL; ly += 15; }
      d.dot(p, lx + 4, ly - 4, 3.4, FAM[k]);
      d.lineLabel(p, pkgLabel(k).toUpperCase(), lx + 12, ly, k === sel.package ? "#F7F6F2" : "rgba(159,180,189,.75)");
      lx += 8 + pkgLabel(k).length * 7.1;
    }

    if (hover) {
      var tw = 232, th = 76;
      var bx = d.clamp(local.mx + 14, pL, Math.max(pL, pR - tw)), by = d.clamp(local.my - th - 8, pT, pB - th);
      d.panel(p, bx, by, tw, th, "rgba(6,20,31,.95)", "#1AA89B");
      d.lineLabel(p, pkgLabel(hover.measurement_package).toUpperCase(), bx + 10, by + 18, "#F7F6F2");
      d.lineLabel(p, "COST " + parseFloat(hover.normalized_resource_units).toFixed(2) + "   VALUE " + parseFloat(hover.forecast_utility).toFixed(4), bx + 10, by + 36, "#EAF1F1");
      d.lineLabel(p, hover.status.replace(/_/g, " ").toUpperCase(), bx + 10, by + 54, hover.status === "conditional_fragile" ? "#F2A24E" : "#5C6E78");
    } else {
      d.lineLabel(p, "HOVER A PLAN", pR - 96, pT + 12, "rgba(234,241,241,.42)");
    }
    d.caveat(p, "LOOKUP ONLY · " + nRobust + " / " + rows.length + " CLASSIFIED ROBUSTLY BEST · CLAIM EF-006");
  });
}());
