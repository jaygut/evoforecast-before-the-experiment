(function () {
  "use strict";

  var FOUNDER_COLORS = ["#3AD6A3", "#1AA89B", "#F2A24E", "#E8694D", "#8BC5E8", "#C9A6E8", "#D3D86D", "#F7F6F2"];

  function two(value) { return String(value).padStart(2, "0"); }

  window.EVO_SCENES.register("trajectory", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var source = s.trajectory;
    var reps = source && source.replicates;
    if (!reps || !reps.length) { return; }

    var band = s.freeBands && s.freeBands.trajectory;
    var compact = p.width < 680;
    var x0 = compact ? 28 : 46;
    var x1 = compact ? p.width - 28 : ((band && band.left > 520) ? band.left - 34 : p.width * 0.55);
    var y0 = compact ? 136 : 128;
    var y1 = compact ? p.height - 190 : Math.min(p.height - 190, y0 + 330);
    var horizon = source.summary.horizon_days;
    var populationMax = source.summary.initial_daphnia_count;
    var revealDay = Math.max(1, Math.round(horizon * d.clamp(t * 1.16, 0, 1)));
    var selectedReplicate = d.clamp(s.trajectorySelected.replicate, 0, reps.length - 1);
    var selectedDay = d.clamp(s.trajectorySelected.day, 0, horizon);
    var hoverReplicate = -1;
    var clickReplicate = -1;

    function px(day) { return d.lerp(x0, x1, day / horizon); }
    function py(count) { return d.lerp(y1, y0, count / populationMax); }
    function nearestAt(mx, my) {
      var day = d.clamp(Math.round((mx - x0) / Math.max(1, x1 - x0) * horizon), 0, horizon);
      var best = -1, distance = Infinity;
      reps.forEach(function (rep, index) {
        var next = Math.abs(py(rep.days[day].daphnia_count) - my);
        if (next < distance) { distance = next; best = index; }
      });
      return { replicate: best, day: day };
    }

    if (local.hasPointer && local.mx >= x0 && local.mx <= x1 && local.my >= y0 - 14 && local.my <= y1 + 14) {
      var hovered = nearestAt(local.mx, local.my);
      hoverReplicate = hovered.replicate;
      selectedDay = hovered.day;
    }
    if (local.clickX >= x0 && local.clickX <= x1 && local.clickY >= y0 - 14 && local.clickY <= y1 + 14) {
      var clicked = nearestAt(local.clickX, local.clickY);
      clickReplicate = clicked.replicate;
      if (hoverReplicate < 0) { selectedDay = clicked.day; }
    }
    selectedReplicate = hoverReplicate >= 0 ? hoverReplicate : (clickReplicate >= 0 ? clickReplicate : selectedReplicate);
    if (clickReplicate >= 0 && typeof s.selectTrajectoryFromCanvas === "function" &&
        (s.trajectorySelected.replicate !== clickReplicate || s.trajectorySelected.day !== selectedDay)) {
      s.selectTrajectoryFromCanvas(clickReplicate, selectedDay);
    }

    p.stroke("rgba(159,180,189,.22)"); p.strokeWeight(1);
    p.line(x0, y0, x0, y1); p.line(x0, y1, x1, y1);
    d.label(p, "REGISTERED STUDY E CELL · ALL " + source.summary.replicate_count + " VESSELS", x0, y0 - 24, { color: "#3AD6A3", size: compact ? 8 : 10 });
    d.label(p, populationMax + " GRAZERS", x0, y0 - 7, { color: "#9FB4BD", size: compact ? 7 : 9 });
    d.label(p, "DAY " + reps[0].days[0].day, x0, y1 + 18, { color: "#9FB4BD", size: compact ? 7 : 9 });
    d.label(p, "DAY " + reps[0].days[horizon].day, x1, y1 + 18, { color: "#9FB4BD", size: compact ? 7 : 9, align: p.RIGHT });

    reps.forEach(function (rep, index) {
      p.noFill();
      p.stroke(index === selectedReplicate ? "rgba(58,214,163,.98)" : "rgba(139,197,232,.19)");
      p.strokeWeight(index === selectedReplicate ? 2.8 : 1);
      p.beginShape();
      rep.days.slice(0, revealDay + 1).forEach(function (row) { p.vertex(px(row.day), py(row.daphnia_count)); });
      p.endShape();
    });

    var rep = reps[selectedReplicate];
    var row = rep.days[selectedDay];
    var cx = px(row.day), cy = py(row.daphnia_count);
    p.stroke("rgba(247,246,242,.32)"); p.strokeWeight(1); p.line(cx, y0, cx, y1);
    d.dot(p, cx, cy, compact ? 4 : 5, "#3AD6A3", "#F7F6F2");

    var infoY = y1 + 42;
    d.panel(p, x0, infoY, x1 - x0, compact ? 88 : 104, "rgba(14,42,71,.94)", "rgba(58,214,163,.65)");
    d.label(p, "VESSEL " + two(rep.replicate + 1) + " · DAY " + row.day + " · " + row.daphnia_count + " GRAZERS", x0 + 12, infoY + 20, { color: "#F7F6F2", size: compact ? 8 : 10 });
    d.label(p, "FOUNDER COMPOSITION", x0 + 12, infoY + 38, { color: "#9FB4BD", size: compact ? 7 : 8 });
    var barX = x0 + 12, barY = infoY + 47, barW = x1 - x0 - 24, cursor = barX;
    row.founder_counts.forEach(function (count, index) {
      var width = row.daphnia_count > 0 ? barW * count / row.daphnia_count : 0;
      p.noStroke(); p.fill(FOUNDER_COLORS[index]); p.rect(cursor, barY, width, compact ? 12 : 15);
      cursor += width;
    });
    d.label(p, row.dominant_founder + " LEADS · " + (row.dominant_percent_tenths / 10).toFixed(1) + "%", x0 + 12, infoY + (compact ? 78 : 88), { color: "#F2A24E", size: compact ? 7.5 : 9 });
    d.label(p, local.hasPointer ? "HOVER REVEALS · CLICK HOLDS" : "HOVER A PATH · CLICK TO HOLD", x1 - 12, infoY + (compact ? 78 : 88), { color: "#9FB4BD", size: compact ? 7 : 8, align: p.RIGHT });

    d.caveat(p, "FROZEN SYNTHETIC LOOKUP · CLONAL STANDING SELECTION · CLAIM EF-018");
  });
}());
