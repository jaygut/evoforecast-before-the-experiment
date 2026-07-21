(function () {
  "use strict";
  window.EVO_SCENES.register("phase", function (p, t, s, d) {
    var rows=s.phaseRows||[], selected=s.phaseSelected||{}, band=s.freeBands&&s.freeBands.phase, left=(p.width>800&&band?band.right+28:72),top=62,right=p.width-42,bottom=p.height-86, models=["P1","G1","GP1","R1"], i,row,x,y,prob,sel;
    p.background("#06141F");
    p.stroke("rgba(234,241,241,.22)"); p.strokeWeight(1); p.line(left,bottom,right,bottom); p.line(left,top,left,bottom);
    d.lineLabel(p,"MEAN RELATIVE CRPS GAIN →",left,bottom+32,"#EAF1F1");
    p.push(); p.translate(22,bottom-8); p.rotate(-Math.PI/2); d.lineLabel(p,"NOMINAL-90% COVERAGE →",0,0,"#EAF1F1"); p.pop();
    p.stroke("rgba(242,162,78,.45)"); p.line(left,top+(bottom-top)*.1,right,top+(bottom-top)*.1); d.lineLabel(p,"TARGET COVERAGE",right-120,top+(bottom-top)*.1-8,"#F2A24E");
    for(i=0;i<rows.length;i+=1){ row=rows[i]; x=left+(Math.max(-.1,Math.min(.5,parseFloat(row.mean_relative_crps_gain)))+.1)/.6*(right-left); y=bottom-Math.max(.35,Math.min(1,parseFloat(row.coverage_90))-.35)/.65*(bottom-top); prob=parseFloat(row.probability_meeting_definition); sel=row.model===selected.model && row.population_arms===String(selected.arms) && row.information_horizon_days===String(selected.horizon); p.noFill(); p.stroke(sel?"#F7F6F2":(prob>=.8?"#3AD6A3":prob>=.5?"#F2A24E":"rgba(92,110,120,.46)")); p.strokeWeight(sel?3:1); p.circle(x,y,5+prob*20); if(sel){ d.lineLabel(p,row.model+" · A"+row.population_arms+" · D"+row.information_horizon_days,x+12,y-10,"#F7F6F2"); }
    }
    d.caveat(p,"LOOKUP ONLY · RING = JOINT-GATE PROBABILITY · SOURCE HASH IN AUDIT");
  });
}());
