(function () {
  "use strict";
  window.EVO_SCENES.register("frontier", function (p, t, s, d) {
    var rows=s.portfolioRows||[], selected=s.portfolioSelected||{}, band=s.freeBands&&s.freeBands.frontier, left=62,top=50,right=(p.width>800&&band?band.left-28:p.width-36),bottom=p.height-82, minU=-.12,maxU=.05,i,row,x,y,prob,match;
    p.background("#08203A"); p.stroke("rgba(234,241,241,.22)"); p.line(left,bottom,right,bottom); p.line(left,top,left,bottom);
    d.lineLabel(p,"NORMALIZED RESOURCE UNITS →",left,bottom+30,"#EAF1F1");
    p.push(); p.translate(18,bottom); p.rotate(-Math.PI/2); d.lineLabel(p,"FORECAST UTILITY →",0,0,"#EAF1F1"); p.pop();
    rows.forEach(function(row){ x=left+(parseFloat(row.normalized_resource_units)-1.8)/4.1*(right-left); y=bottom-(parseFloat(row.forecast_utility)-minU)/(maxU-minU)*(bottom-top); prob=parseFloat(row.pareto_membership_probability); match=(!selected.package||row.measurement_package===selected.package)&&(!selected.horizon||row.information_horizon_days===String(selected.horizon)); p.stroke(match?"#1AA89B":"rgba(92,110,120,.25)"); p.fill(match?(prob>=.8?"#F2A24E":"rgba(26,168,155,.42)"):"rgba(92,110,120,.15)"); p.circle(x,y,5+prob*14); });
    d.lineLabel(p,"RING / SIZE = PARETO MEMBERSHIP PROBABILITY",left,top-18,"#E9E1CC");
    d.caveat(p,"0 / 120 CLASSIFIED ROBUSTLY PARETO OPTIMAL · CLAIM EF-006");
  });
}());
