(function () {
  "use strict";
  function factMetric(d, s, claimId, pattern) {
    var row=d.fact(s,claimId), match=row&&row.text.match(pattern);
    return match?match[0].replace("\u2212","-").replace("/"," / "):"REGISTERED ROW UNAVAILABLE";
  }
  function modeValue(d,s,mode) {
    var rows=s.timeline&&s.timeline.events,row=null,match,i,eventId=mode==="positive"?"v3_positive":"v3_adverse";
    if (mode==="blind") { return factMetric(d,s,"EF-003",/\d+\/\d+/); }
    for(i=0;rows&&i<rows.length;i+=1){if(rows[i].id===eventId){row=rows[i];break;}}
    match=row&&row.detail.match(/[+\-\u2212]?\d+(?:\.\d+)?%/);
    return match?match[0].replace("\u2212","-"):"REGISTERED ROW UNAVAILABLE";
  }
  window.EVO_SCENES.register("challenge", function (p, t, s, d, local) {
    local = local || {};
    var events=(s.timeline&&s.timeline.events)||[], mode=s.challengeMode||"blind", band=s.freeBands&&s.freeBands.challenge, x0=(p.width>800&&band?band.right+64:54),x1=p.width-56,y=p.height*.31,i,x;
    if (x1 - x0 < 250) { x0 = 28; x1 = p.width - 28; }
    var denom = Math.max(1, events.length - 1), pts = [], hover = -1, pinned = -1, hd = 24, cd = 24, dd;
    for (i = 0; i < events.length; i += 1) {
      x = x0 + i * (x1 - x0) / denom; pts.push({ x: x, y: y });
      if (local.hasPointer && local.mx >= 0) { dd = p.dist(local.mx, local.my, x, y); if (dd < hd) { hd = dd; hover = i; } }
      if (local.clickX >= 0) { dd = p.dist(local.clickX, local.clickY, x, y); if (dd < cd) { cd = dd; pinned = i; } }
    }
    var show = hover >= 0 ? hover : pinned;
    p.background("#06141F"); p.stroke("#1AA89B"); p.strokeWeight(2); p.line(x0,y,x0+(x1-x0)*d.fade(t,.08,.66),y);
    events.forEach(function(e,i){
      var col=e.id.indexOf("adverse")>-1?"#E8694D":e.id.indexOf("positive")>-1?"#3AD6A3":"#1AA89B";
      x=pts[i].x; d.dot(p,x,y,show===i?10:7,col);
      if (p.width < 680) {
        d.wrap(p,e.label.toUpperCase(),d.clamp(x-34,4,p.width-72),y+(i%2?18:-55),68,40,{color:show===i?"#F7F6F2":"#EAF1F1",mono:true,size:9});
      } else { d.label(p,e.label.toUpperCase(),x,y+(i%2?48:-36),{color:show===i?"#F7F6F2":"#EAF1F1",size:10,align:p.CENTER}); }
    });
    var ey=p.height*.46, eh=68;
    d.panel(p,x0,ey,x1-x0,eh,"rgba(6,20,31,.78)",show>=0?"#1AA89B":"rgba(26,168,155,.4)");
    if (show>=0) {
      var e=events[show];
      d.lineLabel(p,e.label.toUpperCase()+" · "+e.state.toUpperCase(),x0+12,ey+21,"#3AD6A3");
      d.wrap(p,e.detail,x0+12,ey+31,x1-x0-24,28,{color:"#EAF1F1",size:11.5});
    } else { d.lineLabel(p,"HOVER OR CLICK A MILESTONE TO OPEN ITS FROZEN ROW",x0+12,ey+29,"rgba(234,241,241,.52)"); }
    var my=p.height*.66;
    d.panel(p,x0,my,x1-x0,82,"rgba(14,42,71,.92)",mode==="adverse"?"#E8694D":mode==="positive"?"#3AD6A3":"#F2A24E");
    var m=window.EVO_CONFIG.challengeModes[mode]; d.lineLabel(p,m.label.toUpperCase()+" · "+modeValue(d,s,mode),x0+16,my+30,mode==="adverse"?"#E8694D":mode==="positive"?"#3AD6A3":"#F2A24E"); d.wrap(p,m.note.toUpperCase(),x0+16,my+42,x1-x0-32,32,{color:"#F7F6F2",mono:true,size:10.5});
    d.caveat(p,"V3 TO V5 = SOFTWARE / CHALLENGE MATURITY · NOT BIOLOGICAL GENERATIONS");
  });
}());
