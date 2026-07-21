(function () {
  "use strict";
  var DEFECTS = [
    { label: "HIDDEN INFO REACHED THE FORECASTER", note: "The blind boundary failed, so the estimate cannot be interpreted." },
    { label: "PAIRED COMPARISONS BROKE THE UNIT", note: "The comparison no longer matched like with like, so its contrast is invalid." },
    { label: "COST AND EXPECTED LOSS DID NOT COHERE", note: "The decision rule mixed quantities that could not support one ranking." },
    { label: "UNCERTAINTY COULD NOT DECIDE", note: "The result could not support either a scale decision or a stop decision." }
  ];
  window.EVO_SCENES.register("rejection", function (p, t, s, d, local) {
    local = local || {};
    p.background("#06141F");
    var band = s.freeBands && s.freeBands.rejection;
    // Draw in the free band on whichever side the copy-card is not.
    var x0, x1;
    if (p.width > 800 && band) {
      if ((band.left + band.right) / 2 > p.width * 0.5) { x0 = 48; x1 = band.left - 34; }
      else { x0 = band.right + 34; x1 = p.width - 44; }
    } else { x0 = 48; x1 = p.width - 44; }
    var w = Math.max(180, x1 - x0);
    var top = p.height < 650 ? 112 : p.height * 0.18, rowH = 38, gap = 13, i, y, reveal, rw;
    var boxes = [], hover = -1, pinned = -1;
    for (i = 0; i < DEFECTS.length; i += 1) {
      y = top + i * (rowH + gap);
      reveal = d.fade(t, 0.05 + i * 0.11, 0.34 + i * 0.11);
      rw = w * Math.max(0.08, reveal);
      boxes.push({ x: x0, y: y, w: rw, h: rowH });
      if (local.hasPointer && local.mx >= x0 && local.mx <= x0 + rw && local.my >= y && local.my <= y + rowH) { hover = i; }
      if (local.clickX >= x0 && local.clickX <= x0 + rw && local.clickY >= y && local.clickY <= y + rowH) { pinned = i; }
    }
    var show = hover >= 0 ? hover : pinned;
    for (i = 0; i < DEFECTS.length; i += 1) {
      y = boxes[i].y; reveal = d.fade(t, 0.05 + i * 0.11, 0.34 + i * 0.11);
      d.panel(p, x0, y, boxes[i].w, rowH, show === i ? "rgba(232,105,77,.18)" : "rgba(14,42,71,.92)", show === i ? "#F7F6F2" : "#E8694D");
      if (reveal > 0.55) {
        d.lineLabel(p, DEFECTS[i].label, x0 + 14, y + 23, show === i ? "#F7F6F2" : "#EAF1F1");
        p.stroke("#E8694D"); p.strokeWeight(1.5);
        p.line(x0 + 8, y + rowH - 6, x0 + 8 + (w - 16) * d.fade(t, 0.30 + i * 0.10, 0.58 + i * 0.10), y + rowH - 6);
      }
    }
    var sy = top + DEFECTS.length * (rowH + gap) + 18;
    var stampT = d.fade(t, 0.55, 0.82);
    if (stampT > 0.02) {
      p.noFill(); p.stroke("#E8694D"); p.strokeWeight(2.5); p.rect(x0, sy, 176, 42, 6);
      d.lineLabel(p, "V4 REJECTED", x0 + 18, sy + 27, "#E8694D");
      d.lineLabel(p, "NO ESTIMATE CARRIED FORWARD", x0 + 18, sy + 66, "#EAF1F1");
    }
    var py0 = sy + 80;
    if (py0 + 60 < p.height - 42) {
      if (show >= 0) {
        d.panel(p, x0, py0, w, 58, "rgba(6,20,31,.94)", "#E8694D");
        d.wrap(p, DEFECTS[show].note, x0 + 12, py0 + 10, w - 24, 40, { color: "#EAF1F1", size: 11.5 });
      } else {
        d.lineLabel(p, "HOVER OR CLICK A REJECTION REASON", x0, py0 + 24, "rgba(234,241,241,.48)");
      }
    }
    d.caveat(p, "INDEPENDENT REVIEW DISPOSITION · V4 ESTIMATES ARE NOT SCIENTIFIC EVIDENCE · REVIEW-V4");
  });
}());
