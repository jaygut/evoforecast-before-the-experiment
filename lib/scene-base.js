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
    // Per-instance pointer state passed to the painter as the 5th argument.
    // mx/my: current hover (canvas coords). clickX/clickY: last click (persistent
    // selection anchor). hasPointer: pointer is inside this canvas. LOOKUP ONLY:
    // pointers select and reveal frozen rows; the browser computes nothing.
    var local = { mx: -1, my: -1, clickX: -1, clickY: -1, pressed: false, hasPointer: false };
    var reduced = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var praf = false;
    var sketch = new root.p5(function (p) {
      function pointerRedraw() {
        if (!active || praf) { return; }
        praf = true;
        root.requestAnimationFrame(function () { praf = false; if (active) { p.redraw(); } });
      }
      function inside() { return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height; }
      p.setup = function () {
        var box = node.getBoundingClientRect();
        var canvas = p.createCanvas(Math.max(320, box.width), Math.max(360, box.height));
        canvas.attribute("aria-hidden", "true");
        p.pixelDensity(Math.min(2, root.devicePixelRatio || 1));
        p.noLoop();
        canvas.elt.addEventListener("mouseleave", function () {
          local.hasPointer = false; local.pressed = false; if (active) { p.redraw(); }
        });
      };
      p.draw = function () {
        registry[id](p, progress, state, root.EVO_DRAW, local);
      };
      p.windowResized = function () {
        var box = node.getBoundingClientRect();
        p.resizeCanvas(Math.max(320, box.width), Math.max(360, box.height));
        p.redraw();
      };
      if (!reduced) {
        p.mouseMoved = function () { local.mx = p.mouseX; local.my = p.mouseY; local.hasPointer = inside(); pointerRedraw(); };
        p.mouseDragged = function () { local.mx = p.mouseX; local.my = p.mouseY; local.hasPointer = inside(); local.pressed = inside(); pointerRedraw(); };
        p.mousePressed = function () { if (inside()) { local.pressed = true; local.clickX = p.mouseX; local.clickY = p.mouseY; local.mx = p.mouseX; local.my = p.mouseY; local.hasPointer = true; pointerRedraw(); } };
        p.mouseReleased = function () { local.pressed = false; pointerRedraw(); };
      }
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
    p.textAlign(p.LEFT, p.BASELINE); p.text(text, x, y);
  }
  // Flexible text: opts = {size, color, mono, align, weight, baseline}
  function label(p, text, x, y, opts) {
    opts = opts || {};
    p.noStroke(); p.fill(opts.color || "#EAF1F1");
    p.textFont(opts.mono === false ? "IBM Plex Sans" : "IBM Plex Mono");
    p.textSize(opts.size || 11);
    p.textStyle(opts.weight === 400 ? p.NORMAL : p.BOLD);
    p.textAlign(opts.align || p.LEFT, opts.baseline || p.BASELINE);
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
  // Word-wrapped prose inside a box (x,y is the top-left of the text box).
  function wrap(p, text, x, y, w, h, opts) {
    opts = opts || {};
    p.noStroke(); p.fill(opts.color || "#EAF1F1");
    p.textFont(opts.mono ? "IBM Plex Mono" : "IBM Plex Sans");
    p.textSize(opts.size || 12);
    p.textStyle(p.NORMAL);
    p.textAlign(p.LEFT, p.TOP);
    p.text(text, x, y, w, h);
  }
  // Horizontal meter bar with a value fill; frac in [0,1].
  function meter(p, x, y, w, h, frac, fillColor, trackColor) {
    p.noStroke(); p.fill(trackColor || "#243B4A"); p.rect(x, y, w, h, h / 2);
    p.fill(fillColor); p.rect(x, y, w * clamp(frac, 0, 1), h, h / 2);
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
  root.EVO_DRAW = { clamp: clamp, lerp: lerp, smooth: smooth, fade: fade, lineLabel: lineLabel, label: label, wrap: wrap, panel: panel, dot: dot, caveat: caveat, meter: meter, ambient: ambient };
}(window));
