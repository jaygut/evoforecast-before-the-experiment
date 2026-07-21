(function () {
  "use strict";
  window.EVO_SCENES.register("ask", function (p, t, s, d) {
    var items=["ONE CANDIDATE ORGANISM","ONE FEASIBLE BUDGET","ONE HELD-OUT CHALLENGE"], cx=p.width*.5, i, y;
    p.background("#06141F"); d.ambient(p,t,4111);
    items.forEach(function(label,i){ y=p.height*.28+i*84; d.panel(p,p.width*.2,y,p.width*.6,56,"rgba(14,42,71,.94)",i===2?"#3AD6A3":"#1AA89B"); d.lineLabel(p,"0"+(i+1)+" · "+label,p.width*.2+18,y+34,i===2?"#3AD6A3":"#EAF1F1"); });
    d.lineLabel(p,"THEN ASK WHAT THE PHYSICAL PROGRAMME MUST MEASURE.",p.width*.2,p.height*.78,"#F7F6F2");
    d.caveat(p,"PROPOSED BOUNDED CO-DESIGN · EMPIRICAL QUALIFICATION REMAINS BLOCKED");
  });
}());
