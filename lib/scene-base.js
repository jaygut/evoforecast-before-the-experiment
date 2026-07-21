(function (root) {
  "use strict";
  var registry = {};

  function clamp(value, lo, hi) { return Math.max(lo, Math.min(hi, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function fade(t, a, b) { return smooth((t - a) / (b - a)); }

  function register(id, painter) { registry[id] = painter; }

  function create(id, node, context) {
    if (!registry[id] || !root.p5) { return null; }
    var progress = 0;
    var active = false;
    var state = context || {};
    var sketch = new root.p5(function (p) {
      p.setup = function () {
        var box = node.getBoundingClientRect();
        var canvas = p.createCanvas(Math.max(320, box.width), Math.max(360, box.height));
        canvas.attribute("aria-hidden", "true");
        p.pixelDensity(Math.min(2, root.devicePixelRatio || 1));
        p.noLoop();
      };
      p.draw = function () {
        registry[id](p, progress, state, root.EVO_DRAW);
      };
      p.windowResized = function () {
        var box = node.getBoundingClientRect();
        p.resizeCanvas(Math.max(320, box.width), Math.max(360, box.height));
        p.redraw();
      };
    }, node);
    return {
      render: function (t) { progress = clamp(t, 0, 1); if (active) { sketch.redraw(); } },
      setActive: function (value) { active = value; if (active) { sketch.redraw(); } else { sketch.noLoop(); } },
      setState: function (next) { state = next; if (active) { sketch.redraw(); } },
      resize: function () { sketch.windowResized(); }
    };
  }

  function lineLabel(p, text, x, y, color) {
    p.noStroke(); p.fill(color); p.textFont("IBM Plex Mono"); p.textSize(11); p.textStyle(p.BOLD);
    p.text(text, x, y);
  }
  function panel(p, x, y, w, h, fillColor, strokeColor) {
    p.fill(fillColor); p.stroke(strokeColor); p.strokeWeight(1); p.rect(x, y, w, h, 8);
  }
  function dot(p, x, y, r, fillColor, strokeColor) {
    if (strokeColor) { p.stroke(strokeColor); p.strokeWeight(1.4); } else { p.noStroke(); }
    p.fill(fillColor); p.circle(x, y, r * 2);
  }
  function caveat(p, text) {
    p.noStroke(); p.fill("rgba(6,20,31,.82)"); p.rect(12, p.height - 34, p.width - 24, 22, 4);
    lineLabel(p, text, 22, p.height - 19, "#E9E1CC");
  }
  function ambient(p, t, seed) {
    var rand = root.EVO_PRNG.create(seed);
    var pts = [], i, j, d, nearest, best;
    p.stroke("rgba(26,168,155,.13)"); p.strokeWeight(1);
    for (i = 0; i < 24; i += 1) { pts.push({ x: rand() * p.width, y: rand() * p.height }); }
    for (i = 0; i < pts.length; i += 1) {
      nearest = null; best = Infinity;
      for (j = 0; j < pts.length; j += 1) {
        if (i === j) { continue; }
        d = p.dist(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
        if (d < best) { best = d; nearest = pts[j]; }
      }
      if (nearest) { p.line(pts[i].x, pts[i].y, lerp(pts[i].x, nearest.x, fade(t, 0, .7)), lerp(pts[i].y, nearest.y, fade(t, 0, .7))); }
    }
    for (i = 0; i < pts.length; i += 1) { dot(p, pts[i].x, pts[i].y, i === 7 ? 3.5 : 2, i === 7 ? "#3AD6A3" : (i === 17 ? "#E8694D" : "rgba(234,241,241,.23)")); }
  }

  root.EVO_SCENES = { register: register, create: create };
  root.EVO_DRAW = { clamp: clamp, lerp: lerp, smooth: smooth, fade: fade, lineLabel: lineLabel, panel: panel, dot: dot, caveat: caveat, ambient: ambient };
}(window));
