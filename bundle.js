!function(){"use strict";const t=50,e=50,r=50,n=50,o=1200-n-e,a=1200-t-r,i=o+n+e,s=a+t+r,c=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),p=t=>"<b>Cazul "+t.properties.case_no+"</b><br />"+("Bărbat"===t.properties.gender?"Bărbat":"Femeie"===t.properties.gender?"Femeie":"Gen nespecificat")+(null!=t.properties.age&&0!=t.properties.age?", "+t.properties.age:"")+(null!=t.properties.county&&""!=t.properties.county?", din  "+t.properties.county:"")+".<br />"+(null!=t.properties.status?"Status: "+("Vindecat"===t.properties.status?"vindecat":"Confirmat"===t.properties.status?"confirmat":"deces")+".<br />":"")+(null!==t.properties.healing_date?"Data recuperării: "+t.properties.healing_date+".<br />":"")+(null!==t.properties.reference&&""!==t.properties.reference?'Detalii: <a href="'+t.properties.reference+'" target= "_blank">aici</a>':""),l=t=>{const e=Math.hypot(t.target.x-t.source.x,t.target.y-t.source.y);return`\n      M${t.source.x},${t.source.y}\n      A${e},${e} 0 0,1 ${t.target.x},${t.target.y}\n    `};(()=>{d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations").then(t=>{const r={nodes:[],links:[]},n=t.data.nodes,o=t.data.links,a=n.filter(t=>null!==t.properties.country_of_infection&&"România"!==t.properties.country_of_infection&&"Romania"!==t.properties.country_of_infection);r.nodes=n.concat(Array.from(new Set(a.map(t=>t.properties.country_of_infection)),t=>({name:t}))),r.links=o.concat(a.map(t=>({target:t.name,source:t.properties.country_of_infection}))),e(r)});const e=e=>{d3.select("#chart").selectAll("*").remove();const r=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",i).attr("height",s).attr("viewBox","0, 0 "+i+" "+s).on("click",()=>{c.transition().duration(200).style("opacity",0)});var d=r.append("g").attr("transform","translate("+n+","+t+")");const u=Array.from(new Set(e.nodes.filter(t=>1!==t.is_country_of_infection).map(t=>t.source))),f=Array.from(new Set(e.nodes.filter(t=>1!==t.is_country_of_infection).map(t=>t.properties?t.properties.case_no:""))),y=t=>"Confirmat"===t?"var(--main-confirmate)":"Vindecat"===t?"var(--main-recuperari":"var(--main-decese)",m=e.links,x=e.nodes,g=d3.forceSimulation(x).force("link",d3.forceLink(m).id(t=>JSON.parse(JSON.stringify(t)).name)).force("charge",d3.forceManyBody().strength(-140).distanceMax(1400)).force("center",d3.forceCenter(o/2,a/2)).force("collision",d3.forceCollide().radius(t=>t.radius)).force("x",d3.forceX()).force("y",d3.forceY());d3.zoom().on("zoom",(function(){d.attr("transform",d3.event.transform)}))(r),d.append("defs").selectAll("marker").data(u).join("marker").attr("id",t=>`arrow-${t}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill",y).attr("fill","#999").attr("d","M0,-5L10,0L0,5");const h=d.append("g").attr("fill","none").attr("stroke-width",1.5).selectAll("path").data(m).join("path").attr("stroke",t=>"#999").attr("marker-end",t=>`url(${new URL(`#arrow-${t.type}`,location.toString())})`);h.exit().remove();const _=d.append("g").attr("stroke-linecap","round").attr("stroke-linejoin","round").selectAll("g").data(x).join("g").call((t=>d3.drag().on("start",e=>{d3.event.active||t.alphaTarget(.3).restart(),e.fx=e.x,e.fy=e.y}).on("drag",t=>{t.fx=d3.event.x,t.fy=d3.event.y}).on("end",e=>{d3.event.active||t.alphaTarget(0),e.fx=null,e.fy=null}))(g));_.append("circle").attr("class",t=>t.properties&&`CO-${t.properties.case_no}`).attr("stroke","white").attr("stroke-width",1.5).attr("r",5).attr("fill",t=>t.is_country_of_infection?"black":t.properties&&t.parent?y(t.parent.properties.status):t.properties?y(t.properties.status):"black").attr("stroke",t=>"#333").on("touchend mouseenter",t=>(t=>{if(t.is_country_of_infection)return;let e=d3.event.pageX-20,r=d3.event.pageY+20;window.innerWidth-e<150&&(e=d3.event.pageX-40),c.transition().duration(200).style("opacity",.9),c.html(p(t)).style("left",e+"px").style("top",r+"px").style("display",null)})(t)).on("touchend mouseover",w(.2)).on("touchend mouseout",w(1)),_.append("text").attr("x",8).attr("y","0.31em").text(t=>t.is_country_of_infection?t.country_name:"#"+t.name).clone(!0).lower().attr("fill","none").attr("stroke","white").attr("stroke-width",3),_.exit().remove(),g.on("tick",()=>{h.attr("d",l),_.attr("transform",t=>`translate(${t.x},${t.y})`)});var v={};function k(t,e){return v[t.index+","+e.index]||v[e.index+","+t.index]||t.index==e.index}function w(t){return function(e){_.style("stroke-opacity",(function(r){return k(e,r)?1:t})),_.style("fill-opacity",(function(r){return k(e,r)?1:t})),h.style("stroke-opacity",(function(r){return r.source===e||r.target===e?1:t}))}}m.forEach((function(t){v[t.source.index+","+t.target.index]=1})),d3.select("#nRadius").property("max",d3.max(f));const b=t=>{d3.select("#nRadius-value").text(t),d3.select("#nRadius").property("value",t),d3.selectAll("circle").attr("r",5),d3.selectAll(".CO-"+t).attr("r",10)};d3.select("#nRadius").on("input",(function(){b(+this.value)})),b(1),r.append("text").attr("x",i/2).attr("y",0+t).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("Relația cazurilor confirmate")}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
