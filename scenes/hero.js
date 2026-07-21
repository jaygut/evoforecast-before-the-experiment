(function () {
  "use strict";
  window.EVO_SCENES.register("hero", function (p, t, s, d) {
    var cx = p.width * .57, cy = p.height * .45, scale = Math.min(p.width, p.height) / 13;
    var nodes = [{x:-5,y:2},{x:5,y:1},{x:0,y:7},{x:.4,y:-2}], i, alpha = d.fade(t,.12,.65);
    p.background("#06141F"); d.ambient(p, t, 4101);
    p.push(); p.translate(cx, cy); p.stroke("rgba(26,168,155," + (.18 + .67*alpha) + ")"); p.strokeWeight(1.6); p.strokeCap(p.ROUND);
    [[3,0],[3,1],[3,2]].forEach(function(e){ p.line(nodes[e[0]].x*scale, nodes[e[0]].y*scale, nodes[e[1]].x*scale, nodes[e[1]].y*scale); });
    for (i=0;i<nodes.length;i+=1) { d.dot(p,nodes[i].x*scale,nodes[i].y*scale,(i===3?3.4:i===1?3.2:i===0?3:2.6)*scale/10,["#E8694D","#3AD6A3","#F7F6F2","#1AA89B"][i]); }
    p.pop();
    d.lineLabel(p, "FIELD → GRAPH → FORECAST TEST", 24, 32, "#3AD6A3");
    d.caveat(p, "SYNTHETIC · EXACT GRAPH OF LIFE GEOMETRY · CLAIM EF-001");
  });
}());
