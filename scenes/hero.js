(function () {
  "use strict";
  function prospectiveMetric(d, s) {
    var row = d.fact(s, "EF-003"), match = row && row.text.match(/\d+\/\d+/);
    return match ? match[0].replace("/", " / ") : "NO REGISTERED VALUE";
  }
  window.EVO_SCENES.register("hero", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    d.ambient(p, t, 4101);

    // Canonical Graph of Life mark. Coordinates are balanced around a known
    // centroid so the bounding box is centered by construction and cannot clip.
    var nodes = [
      { x: 0, y: 0, c: "#1AA89B", key: "FORECAST", note: "the network is the unit of prediction" },
      { x: -4.4, y: -1.8, c: "#F7F6F2", key: "GENOTYPE", note: "standing founder variation" },
      { x: 4.4, y: -1.2, c: "#3AD6A3", key: "PHENOTYPE + FUNCTION", note: "measured signal" },
      { x: 0.6, y: 3.4, c: "#E8694D", key: "INTERACTIONS + KEYSTONE", note: "keystone at risk · " + prospectiveMetric(d, s) + " cleared before reveal" }
    ];
    var gW = 8.8, gH = 5.2, gcx = 0, gcy = 0.8, padU = 1.6;

    // Use the wider free gap beside the copy-card; never draw behind it.
    var band = s.freeBands && s.freeBands.hero, rx0, rx1;
    if (p.width > 800 && band) {
      if ((p.width - band.right) >= band.left) { rx0 = band.right + 28; rx1 = p.width - 28; }
      else { rx0 = 28; rx1 = band.left - 28; }
    } else { rx0 = 24; rx1 = p.width - 24; }
    if (rx1 - rx0 < 200) { rx0 = 24; rx1 = p.width - 24; }
    var ry0 = 136, ry1 = p.height - 56;
    var cx = (rx0 + rx1) / 2, cy = (ry0 + ry1) / 2;
    var scale = d.clamp(Math.min((rx1 - rx0) / (gW + 2 * padU), (ry1 - ry0) / (gH + 2 * padU)), 14, 46);
    var rNode = d.clamp(scale * 0.42, 7, 20), hitR = rNode + 18;

    var hasP = !!local.hasPointer && local.mx >= 0;
    var pts = [], i, n, bx, by, dx, dy, dist, mag;
    for (i = 0; i < nodes.length; i += 1) {
      n = nodes[i];
      bx = cx + (n.x - gcx) * scale; by = cy + (n.y - gcy) * scale;
      if (hasP) { // gentle repel so the whole graph responds to the cursor
        dx = bx - local.mx; dy = by - local.my; dist = Math.sqrt(dx * dx + dy * dy) || 1;
        mag = 5 * Math.exp(-Math.pow(dist / 110, 2));
        bx += (dx / dist) * mag; by += (dy / dist) * mag;
      }
      pts.push({ x: bx, y: by, c: n.c, key: n.key, note: n.note, r: (i === 0 ? rNode * 1.15 : rNode) });
    }

    var hover = -1, bestD = hitR, pin = -1, cd = hitR, dd;
    if (hasP) { for (i = 0; i < pts.length; i += 1) { dd = p.dist(local.mx, local.my, pts[i].x, pts[i].y); if (dd < bestD) { bestD = dd; hover = i; } } }
    if (local.clickX >= 0) { for (i = 0; i < pts.length; i += 1) { dd = p.dist(local.clickX, local.clickY, pts[i].x, pts[i].y); if (dd < cd) { cd = dd; pin = i; } } }
    var show = hover >= 0 ? hover : pin;
    if (hover >= 0 && hasP) { // hovered node leans toward the cursor
      dx = local.mx - pts[hover].x; dy = local.my - pts[hover].y; dist = Math.sqrt(dx * dx + dy * dy) || 1;
      mag = Math.min(6, 0.18 * dist);
      pts[hover].x += (dx / dist) * mag; pts[hover].y += (dy / dist) * mag;
    }

    var alpha = 0.2 + 0.6 * d.fade(t, .12, .65), lit, f, bxx, byy;
    for (i = 1; i < pts.length; i += 1) {
      lit = (show === i || show === 0);
      p.stroke(lit ? "rgba(26,168,155,.9)" : "rgba(26,168,155," + alpha.toFixed(3) + ")");
      p.strokeWeight(lit ? 2.6 : 1.6); p.strokeCap(p.ROUND);
      p.line(pts[0].x, pts[0].y, pts[i].x, pts[i].y);
      f = (t * 0.9 + i * 0.33) % 1; // deterministic bead, driven by scroll only
      bxx = d.lerp(pts[0].x, pts[i].x, f); byy = d.lerp(pts[0].y, pts[i].y, f);
      d.dot(p, bxx, byy, 3, pts[i].c);
    }
    for (i = 0; i < pts.length; i += 1) {
      p.noFill(); p.stroke(show === i ? "rgba(234,241,241,.5)" : "rgba(234,241,241,.12)"); p.strokeWeight(1);
      p.circle(pts[i].x, pts[i].y, (pts[i].r + 12) * 2);
      d.dot(p, pts[i].x, pts[i].y, pts[i].r, pts[i].c);
    }

    d.lineLabel(p, "FIELD · GRAPH · FORECAST TEST", rx0, 114, "#3AD6A3");
    if (show >= 0) {
      var lx = Math.min(Math.max(pts[show].x + pts[show].r + 16, rx0), Math.max(rx0, rx1 - 260));
      var ly = d.clamp(pts[show].y - 4, ry0 + 10, ry1 - 26);
      d.lineLabel(p, pts[show].key, lx, ly, "#F7F6F2");
      if (p.width < 680) {
        d.wrap(p, pts[show].note, lx, ly + 8, Math.max(80, rx1 - lx), 30, { color: "#9FB4BD", mono: true, size: 8.5 });
      } else {
        d.lineLabel(p, pts[show].note, lx, ly + 17, "#9FB4BD");
      }
    } else {
      d.lineLabel(p, "HOVER A NODE", rx0, 134, "rgba(234,241,241,.42)");
    }
    d.caveat(p, "SYNTHETIC · EXACT GRAPH OF LIFE GEOMETRY · CLAIM EF-001");
  });
}());
