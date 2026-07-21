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
  function robustMetric(d, s) {
    var row = d.fact(s, "EF-006"), match = row && row.text.match(/\d+\/\d+/);
    return match ? match[0].replace("/", " / ") : "NO REGISTERED PLAN";
  }

  window.EVO_SCENES.register("frontier", function (p, t, s, d, local) {
    local = local || {};
    p.background("#08203A");
    var rows = s.portfolioRows || [], sel = s.portfolioSelected || {};
    var band = s.freeBands && s.freeBands.frontier;
    var left = 46, right = (p.width > 800 && band) ? band.left - 28 : p.width - 40;
    if (right - left < 280) { left = 30; right = p.width - 20; }
    var top = 118, bottom = p.height - 44;
    if (!rows.length) { d.caveat(p, "LOOKUP ONLY · NO REGISTERED PORTFOLIO ROWS"); return; }
    var visibleRows = rows.filter(function (row) { return row.information_horizon_days === String(sel.horizon); });
    var i, r;
    d.lineLabel(p, "DAY " + sel.horizon + " · EXACT FROZEN ROWS · ROBUSTLY BEST " + robustMetric(d, s), left, top + 14, "#E9E1CC");

    var pL = left + 48, pR = right - 12, pT = top + 64, pB = bottom - 34;
    var px = function (u) { return pL + (d.clamp(u, RU_LO, RU_HI) - RU_LO) / (RU_HI - RU_LO) * (pR - pL); };
    var py = function (v) { return pB - (d.clamp(v, FU_LO, FU_HI) - FU_LO) / (FU_HI - FU_LO) * (pB - pT); };

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
    var hover = null, pinned = null, hd = 13, cd = 13, dd, x, y, on, col, appear = d.fade(t, 0.05, 0.7);
    for (i = 0; i < visibleRows.length; i += 1) {
      r = visibleRows[i];
      x = px(parseFloat(r.normalized_resource_units)); y = py(parseFloat(r.forecast_utility));
      if ((parseFloat(r.normalized_resource_units) - RU_LO) / (RU_HI - RU_LO) > appear) { continue; }
      on = (!sel.package || r.measurement_package === sel.package);
      col = FAM[r.measurement_package] || "#5C6E78";
      if (on) { d.dot(p, x, y, 4.2, col); }
      else { d.dot(p, x, y, 3, "rgba(92,110,120,.22)"); }
      if (local.hasPointer && local.mx >= 0) { dd = p.dist(local.mx, local.my, x, y); if (dd < hd) { hd = dd; hover = r; } }
      if (local.clickX >= 0) { dd = p.dist(local.clickX, local.clickY, x, y); if (dd < cd) { cd = dd; pinned = r; } }
    }
    var inspect = hover || pinned;

    // Legend
    var keys = Object.keys(FAM), lx = pL, ly = top + 32, k, wrapAt = p.width < 600 ? 2 : 3;
    for (i = 0; i < keys.length; i += 1) {
      k = keys[i];
      if (i > 0 && i % wrapAt === 0) { lx = pL; ly += 15; }
      d.dot(p, lx + 4, ly - 4, 3.4, FAM[k]);
      d.label(p, pkgLabel(k).toUpperCase(), lx + 12, ly, { color: k === sel.package ? "#F7F6F2" : "rgba(159,180,189,.75)", size: p.width < 600 ? 8.5 : 11 });
      lx += 8 + pkgLabel(k).length * (p.width < 600 ? 5.7 : 7.1);
    }

    if (inspect) {
      var tw = Math.min(244, pR - pL), th = 76;
      var ax = hover ? local.mx : px(parseFloat(inspect.normalized_resource_units));
      var ay = hover ? local.my : py(parseFloat(inspect.forecast_utility));
      var bx = d.clamp(ax + 14, pL, Math.max(pL, pR - tw)), by = d.clamp(ay - th - 8, pT, pB - th);
      d.panel(p, bx, by, tw, th, "rgba(6,20,31,.95)", "#1AA89B");
      d.lineLabel(p, pkgLabel(inspect.measurement_package).toUpperCase() + " · A" + inspect.population_arms + " · DAY " + inspect.information_horizon_days, bx + 10, by + 18, "#F7F6F2");
      d.lineLabel(p, "RESOURCE USE " + parseFloat(inspect.normalized_resource_units).toFixed(2) + "   VALUE " + parseFloat(inspect.forecast_utility).toFixed(4), bx + 10, by + 36, "#EAF1F1");
      d.lineLabel(p, inspect.status.replace(/_/g, " ").toUpperCase(), bx + 10, by + 54, inspect.status === "conditional_fragile" ? "#F2A24E" : "#5C6E78");
    } else {
      d.lineLabel(p, "HOVER OR CLICK A PLAN", pR - 156, pT + 12, "rgba(234,241,241,.42)");
    }
    d.caveat(p, "LOOKUP ONLY · " + robustMetric(d, s) + " CLASSIFIED ROBUSTLY BEST · CLAIM EF-006");
  });
}());
