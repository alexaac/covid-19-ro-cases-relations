!function(){"use strict";let e,t,r,a,o,n,i={nodes:[],links:[]};const s=50,c=50,l=50,p=50,d=1200-p-c,u=1200-s-l,f=d+p+c,y=u+s+l,m=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),g=e=>void 0!==e.properties?"<b>Cazul "+e.properties.case_no+"</b><br />"+("Bărbat"===e.properties.gender?"Bărbat":"Femeie"===e.properties.gender?"Femeie":"Gen nespecificat")+(null!=e.properties.age&&0!=e.properties.age?", "+e.properties.age:"")+(null!=e.properties.county&&""!=e.properties.county?", din  "+e.properties.county:"")+".<br />"+(null!=e.properties.status?"Status: "+("Vindecat"===e.properties.status?"vindecat":"Confirmat"===e.properties.status?"confirmat":"deces")+".<br />":"")+(null!==e.properties.healing_date?"Data recuperării: "+e.properties.healing_date+".<br />":"")+(null!==e.properties.reference&&""!==e.properties.reference?'Detalii: <a href="'+e.properties.reference+'" target= "_blank">aici</a>':""):e.name,h=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n      M${e.source.x},${e.source.y}\n      A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `};(()=>{d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations").then(t=>{e=t,c(),setTimeout(l(),100)});const c=()=>{const t=e.data.nodes,r=e.data.links,a=t.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection);i.nodes=t.concat(Array.from(new Set(a.map(e=>e.properties.country_of_infection)),e=>({name:e}))),i.links=r.concat(a.map(e=>({target:e.name,source:e.properties.country_of_infection})))},l=()=>{d3.select("#switch-colors").on("click",(function(){var e=d3.select(this);"Colorează județe"===e.text()?(v(),e.text("Colorează status")):(x(),e.text("Colorează județe"))}));const e=Array.from(new Set(i.nodes.filter(e=>e.properties).map(e=>e.properties&&e.properties.county)));n=d3.scaleOrdinal(d3.schemePaired).domain(e),o=d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]),d3.select("#chart").selectAll("*").remove();let c=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",f).attr("height",y).attr("viewBox","0, 0 "+f+" "+y).on("click",()=>{m.transition().duration(200).style("opacity",0)});var l=c.append("g").attr("transform","translate("+p+","+s+")");const k=Array.from(new Set(i.nodes.map(e=>e.properties?e.properties.case_no:""))),w=i.links,b=i.nodes;t=d3.forceSimulation(b).force("link",d3.forceLink(w).id(e=>JSON.parse(JSON.stringify(e)).name)).force("charge",d3.forceManyBody().strength(-140).distanceMax(1400)).force("center",d3.forceCenter(d/2,u/2)).force("collision",d3.forceCollide().radius(e=>e.radius)).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]),d3.zoom().on("zoom",(function(){l.attr("transform",d3.event.transform)}))(c),l.append("defs").selectAll("marker").data(e).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),r=l.append("g").attr("fill","none").attr("stroke-width",1.5).selectAll("path").data(w).join("path").attr("stroke",e=>"#999").attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),r.exit().remove(),a=l.append("g").attr("stroke-linecap","round").attr("stroke-linejoin","round").selectAll("g").data(b).join("g").call((e=>d3.drag().on("start",t=>{d3.event.active||e.alphaTarget(.3).restart(),t.fx=t.x,t.fy=t.y}).on("drag",e=>{e.fx=d3.event.x,e.fy=d3.event.y}).on("end",t=>{d3.event.active||e.alphaTarget(0),t.fx=null,t.fy=null}))(t)),a.append("circle").attr("class",e=>e.properties&&`CO-${e.properties.case_no}`).attr("stroke","white").attr("stroke-width",1.5).attr("r",5).attr("stroke",e=>"#333").on("touchend mouseenter",e=>(e=>{if(e.is_country_of_infection)return;let t=d3.event.pageX-20,r=d3.event.pageY+20;window.innerWidth-t<150&&(t=d3.event.pageX-40),m.transition().duration(200).style("opacity",.9),m.html(g(e)).style("left",t+"px").style("top",r+"px").style("display",null)})(e)).on("touchend mouseover",C(.2)).on("touchend mouseout",C(1)),a.append("text").attr("x",8).attr("y","0.31em").text(e=>e.is_country_of_infection?e.country_name:"#"+e.name).clone(!0).lower().attr("fill","none").attr("stroke","white").attr("stroke-width",3),a.exit().remove(),t.on("tick",()=>{r.attr("d",h),a.attr("transform",e=>`translate(${e.x},${e.y})`)});var A={};function $(e,t){return A[e.index+","+t.index]||A[t.index+","+e.index]||e.index==t.index}function C(e){return function(t){a.style("stroke-opacity",(function(r){return $(t,r)?1:e})),a.style("fill-opacity",(function(r){return $(t,r)?1:e})),r.style("stroke-opacity",(function(r){return r.source===t||r.target===t?1:e}))}}w.forEach((function(e){A[e.source.index+","+e.target.index]=1})),d3.select("#nRadius").property("max",d3.max(k));const R=e=>{d3.select("#nRadius-value").text(e),d3.select("#nRadius").property("value",e),d3.selectAll("circle").attr("r",5),d3.selectAll(".CO-"+e).attr("r",10)};d3.select("#nRadius").on("input",(function(){R(+this.value)})),R(1),c.append("text").attr("x",f/2).attr("y",0+s).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("Relația cazurilor confirmate"),c.append("g").attr("class","categoryLegend"),x(),_(20,50,o)},x=()=>{d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.parent&&e.parent.properties?o(e.parent.properties.status):e.properties?o(e.properties.status):"black"),_(20,50,o)},v=()=>{d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.parent&&e.parent.properties?n(e.parent.properties.county):e.properties?n(e.properties.county):""),_(20,50,n)},_=(e,t,r)=>{d3.select("#chart").select("svg").selectAll(".categoryLegend").attr("transform",`translate(${e},${t})`);const a=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).scale(r);d3.select(".categoryLegend").call(a)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
