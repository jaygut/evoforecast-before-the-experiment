(function () {
  "use strict";
  window.EVO_SCENES.register("challenge", function (p, t, s, d) {
    var events=(s.timeline&&s.timeline.events)||[], mode=s.challengeMode||"blind", band=s.freeBands&&s.freeBands.challenge, x0=(p.width>800&&band?band.right+64:54),x1=p.width-56,y=p.height*.34,i,x;
    p.background("#06141F"); p.stroke("#1AA89B"); p.strokeWeight(2); p.line(x0,y,x0+(x1-x0)*d.fade(t,.08,.66),y);
    events.forEach(function(e,i){ x=x0+i*(x1-x0)/(events.length-1); d.dot(p,x,y,7,e.id.indexOf("adverse")>-1?"#E8694D":e.id.indexOf("positive")>-1?"#3AD6A3":"#1AA89B"); d.lineLabel(p,e.label.toUpperCase(),x-44,y+(i%2?48:-36),"#EAF1F1"); });
    d.panel(p,x0,p.height*.66,x1-x0,82,"rgba(14,42,71,.92)",mode==="adverse"?"#E8694D":mode==="positive"?"#3AD6A3":"#F2A24E");
    var m=window.EVO_CONFIG.challengeModes[mode]; d.lineLabel(p,m.label.toUpperCase()+" · "+m.value,x0+16,p.height*.66+30,mode==="adverse"?"#E8694D":mode==="positive"?"#3AD6A3":"#F2A24E"); d.lineLabel(p,m.note.toUpperCase(),x0+16,p.height*.66+56,"#F7F6F2");
    d.caveat(p,"V3 TO V5 = SOFTWARE / CHALLENGE MATURITY · NOT BIOLOGICAL GENERATIONS");
  });
}());
