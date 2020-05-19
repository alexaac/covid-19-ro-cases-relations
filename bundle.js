!function(){"use strict";const e=100,t=100,a=50,r=100,l=window.innerWidth-t-r,s=window.innerHeight-e-a,o=l+t+r,n=s+e+a,i=d3.geoAlbers().center([24.7731,45.7909]).rotate([-14,3.3,-10]).parallels([37,54]).scale(5e3).translate([o/2,n/2]),c=(d3.geoPath().projection(i),d3.timeFormatLocale({dateTime:"%A, %e %B %Y г. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă","Duminică"],shortDays:["Lu","Ma","Mi","Jo","Vi","Sa","Du"],months:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],shortMonths:["Ian","Feb","Mart","Apr","Mai","Iun","Iul","Aug","Sept","Oct","Nov","Dec"]})),d=c.format(".%L"),p=c.format(":%S"),u=c.format("%I:%M"),f=c.format("%I %p"),g=c.format("%a %d"),m=c.format("%b %d"),y=c.format("%B"),h=c.format("%Y"),b=e=>(d3.timeSecond(e)<e?d:d3.timeMinute(e)<e?p:d3.timeHour(e)<e?u:d3.timeDay(e)<e?f:d3.timeMonth(e)<e?d3.timeWeek(e)<e?g:m:d3.timeYear(e)<e?y:h)(e),A=e=>d3.nest().key((function(e){return e.properties&&e.properties.source_no})).rollup((function(e){return e.length})).object(e),v=(e,t)=>d3.drag().on("start",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y)}).on("drag",e=>{"diagram"===t&&(e.fx=d3.event.x,e.fy=d3.event.y)}).on("end",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(0),a.fx=null,a.fy=null)}),x=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n        M${e.source.x},${e.source.y}\n        A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `},k=(e,t,a,r,l,s,o)=>{a.attr("d",t=>{if("arcs"===l){if("string"==typeof t.source.name)return x(t);{let a=s(e[t.source.name].date)||0,r=s(e[t.target.name].date);return["M",a,o(e[t.source.name].dayOrder),"A",(a-r)/2,",",(a-r)/2,0,0,",",a<r?1:0,r,o(e[t.target.name].dayOrder)].join(" ")}}return x(t)}),t.attr("transform",e=>`translate(${e.x},${e.y})`),r.attr("transform",e=>`translate(${e.x},${e.y})`)},_=e=>"ro"===e?d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]):d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmed","Discharged","Deceased"]),L=d3.scaleOrdinal(["#e4588c","#35d394","#ba1ea8","#4caf1c","#1848ca","#aad42b","#9b85ff","#068400","#8b2487","#97ff8b","#d60042","#00ae87","#f94740","#48d3ff","#d17300","#5ea2ff","#cfb100","#53498f","#ffe353","#325383","#86a700","#ff9eeb","#007f30","#d9b6ff","#3b5c12","#89c2ff","#964000","#00bfbb","#ff6f54","#01aac6","#ffb65d","#008857","#ff8e90","#145f36","#952e31","#fffea6","#8e3440","#5a936f","#883d0c","#ffaf81","#34a6c2","#b09764","#458a18"]).domain(["ALBA","ARAD","ARGEȘ","BACĂU","BIHOR","BISTRIȚA-NĂSĂUD","BOTOȘANI","BRAȘOV","BRĂILA","BUCUREȘTI","BUZĂU","CARAȘ-SEVERIN","CLUJ","CONSTANȚA","COVASNA","CĂLĂRAȘI","DOLJ","DÂMBOVIȚA","GALAȚI","GIURGIU","GORJ","HARGHITA","HUNEDOARA","IALOMIȚA","IAȘI","ILFOV","NECUNOSCUT","MARAMUREȘ","MEHEDINȚI","MUREȘ","NEAMȚ","OLT","PRAHOVA","SATU MARE","SIBIU","SUCEAVA","SĂLAJ","TELEORMAN","TIMIȘ","TULCEA","VASLUI","VRANCEA","VÂLCEA"]),C=e=>"ro"===e?d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Bărbat","Femeie"]):d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Male","Female"]),O=d3.scaleQuantile().domain([0,100]).range(d3.schemeSpectral[10]),M=()=>{d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?_("ro")(e.properties.status):""),R("status-legend")},I=(e,t,a,r,l)=>{const s=d3.select("#legend-div").append("div").attr("class",r).append("svg").attr("class","category-legend").attr("width",110).attr("height",t).attr("preserveAspectRatio","xMidYMid").attr("viewBox","-10, -10 120 "+a).attr("x",0).attr("y",0),o=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).title(l).titleWidth(100).labelFormat(d3.format(".0f")).labelAlign("start").scale(e);s.call(o)},R=e=>{d3.select(".county-legend").classed("hide",!0),d3.select(".status-legend").classed("hide",!0),d3.select(".gender-legend").classed("hide",!0),d3.select(".age-legend").classed("hide",!0),"county-legend"===e?d3.select(".county-legend").classed("hide",!1):"status-legend"===e?d3.select(".status-legend").classed("hide",!1):"gender-legend"===e?d3.select(".gender-legend").classed("hide",!1):"age-legend"===e&&d3.select(".age-legend").classed("hide",!1)},w=(e,t)=>{d3.select("#nRadius-value").text(e[t]),d3.select("#nRadius").property("value",e[t]),d3.select("#search-input").property("value",e[t]),d3.selectAll(".nodes").attr("r",e=>e.r),d3.select("#CO-"+e[t]).attr("r",e=>2*e.r).dispatch("mouseover")},S=function(e){d3.selectAll(".node-labels").classed("hidden",t=>"string"!=typeof t.name&&e<=1.9),d3.selectAll(".labels").classed("hidden",t=>t.r<10/e)},E=d3.zoom().scaleExtent([.2,10]).on("zoom",()=>{let e=d3.selectAll(".zoomable-group"),t=d3.event.transform.k;return e.attr("transform","translate(0) scale("+t+")"),t>.8&&(e.selectAll(".node-labels > text").attr("transform","scale("+1/t+")"),e.selectAll(".labels > text").attr("transform","scale("+1/t+")")),S(t)}),z=()=>{d3.select("#chart").select("svg").call(E.scaleTo,.5)},B=(e,t,a,r,l,s)=>{"map"===t||"clusters"===t?e.forEach((function(e){const t=i([e.longitude,e.latitude]);e.x=t[0]||e.x,e.y=t[1]||e.y})):e.forEach((function(e){e.x=l(e.date)||-100,e.y=s(e.dayOrder)}));const o=d3.transition().duration(a?0:800).ease(d3.easeElastic.period(.5));k(r,d3.selectAll(".nodes").transition(o),d3.selectAll(".links").transition(o),d3.selectAll(".node-labels").transition(o),t,l,s)},$=(e,t,a,r,l)=>{d3.select("#positioning").attr("value","map"),t.stop(),z(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",1),B(e.nodes,"clusters",0,a,r,l),d3.selectAll(".nodes").call(v(t,"clusters")),d3.selectAll(".nodes-group").style("opacity",0)},D=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),j=e=>{if(void 0!==e.properties){let t=d3.select("#language").node().value,a={cazulLabel:{ro:"Cazul",en:"Case"},maleLabel:{ro:"Bărbat",en:"Male"},femaleLabel:{ro:"Femeie",en:"Female"},unspecLabel:{ro:"Gen nespecificat",en:"Unspecified gender"},statusLabel:{ro:"Stare",en:"Status"},releasedLabel:{ro:"vindecat",en:"released"},confirmedLabel:{ro:"confirmat",en:"confirmed"},deceasedLabel:{ro:"deces",en:"deceased"},confdateLabel:{ro:"Data confirmării",en:"Confirmation date"},recoverydateLabel:{ro:"Data recuperării",en:"Recovery date"},infectionCountryLabel:{ro:"Țara de infectare",en:"Country of infection"},detailsLabel:{ro:"Detalii",en:"Details"},aiciLabel:{ro:"aici",en:"here"}},r=("Bărbat"===e.properties.gender?a.maleLabel[t]:"Femeie"===e.properties.gender?a.femaleLabel[t]:a.unspecLabel[t],null!=e.properties.age&&0!=e.properties.age&&e.properties.age,null!=e.properties.county&&""!=e.properties.county?", "+e.properties.county:""),l=null!=e.properties.status?a.statusLabel[t]+": "+("Vindecat"===e.properties.status?a.releasedLabel[t]:"Confirmat"===e.properties.status?a.confirmedLabel[t]:a.deceasedLabel[t])+".<br />":"",s=null!==e.properties.diagnostic_date?a.confdateLabel[t]+": "+e.properties.diagnostic_date+".<br />":"",o=null!==e.properties.healing_date?a.recoverydateLabel[t]+": "+e.properties.healing_date+".<br />":"",n=null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection?a.infectionCountryLabel[t]+": "+e.properties.country_of_infection+".<br />":"",i=null!==e.properties.reference&&""!==e.properties.reference?a.detailsLabel[t]+': <a href="'+e.properties.reference+'" target= "_blank">'+a.aiciLabel[t]+"</a>":"";return"<b>"+a.cazulLabel[t]+" "+e.properties.case_no+"</b>"+r+".<br />"+l+s+o+n+i}return e.name},T=e=>{d3.select("#CO-"+e).dispatch("mouseover")},U=(e,t)=>{let a,r,l,s,i,c,d,p,u,f={},g=[];l=d3.select("svg").select(".zoomable-group").append("g").attr("class","pack-group").attr("opacity",0),i=d3.forceSimulation().force("collision",d3.forceCollide().radius(e=>e.radius).strength(.01)).force("attract",d3.forceAttract().target(e=>[e.foc_x,e.foc_y]).strength(.5)),s=d3.nest().key(e=>e.properties&&e.properties.county).key(e=>e.properties&&e.properties.source_no).entries(t),s.forEach((function(e){f[e.key]=1})),g.push({id:"root",parent:""}),e.forEach((function(e){if(void 0!==f[e.id])return g.push({id:e.id,parent:"root",d:e})})),s.forEach((function(e){if("undefined"!==e.key){[...e.values].filter(e=>"null"!==e.key).sort((e,t)=>e.name-t.name).forEach((function(t){g.push({id:t.key,parent:e.key,source_case:t,value:t.values.length})}))}})),a=d3.stratify().id(e=>e.id).parentId(e=>e.parent)(g),a.sum(e=>e.value).sort((e,t)=>t.value-e.value),r=d3.pack().size([o/2,n/2]).padding(8),r(a),a.eachBefore(e=>null!=e.parent?(e.relx=e.x-e.parent.x,e.rely=e.y-e.parent.y):(e.relx=e.x,e.rely=e.y)),a.eachBefore(e=>{if(null!=e.parent&&"root"===e.parent.id)return e.data.d.force.r=e.r});let m,y,h,b=d3.select("#language").node().value;for(c=l.selectAll(".bubble").data(a.descendants()),d=c.enter().append("circle").attr("class","bubble").attr("r",e=>e.r).on("touchmove mouseover",e=>T(e.id)).attr("fill",e=>e.parent&&"root"!==e.parent.id?L(e.parent.id):"none"),d.append("title").text((function(e){return"ro"===b?e.data.parent+" - sursa nr. "+e.id+"\n"+e.value+" cazuri":e.data.parent+" - source no. "+e.id+"\n"+e.value+" cases"})),p=l.selectAll(".labels").data(a.leaves()),u=p.enter().append("g").attr("class","labels"),u.append("text").text(e=>e.value).attr("dy","0.35em"),S(1),i.nodes(e.map(e=>e.force)).stop(),m=y=0,h=Math.ceil(Math.log(i.alphaMin())/Math.log(1-i.alphaDecay()));0<=h?y<h:y>h;m=0<=h?++y:--y)i.tick()},N=(e,t,a,r)=>{let l,s,i=d3.select("svg").select(".zoomable-group").append("g").attr("class","nodes-group");const c=Array.from(new Set(e.nodes.map(e=>e.source)));i.append("defs").selectAll("marker").data(c).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),l=i.append("g").attr("class","link").selectAll("path").data(e.links).join("path").attr("class",e=>`CO-links-${e.source.name}`).classed("links",!0).attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),l.exit().remove(),s=i.append("g").attr("class","node").selectAll("g").data(e.nodes).join("g").call(v(a,r)),s.append("circle").attr("id",e=>e.properties&&`CO-${e.properties.case_no}`).attr("class",e=>e.properties&&`CO-nodes-${e.properties.source_no}`).classed("nodes",!0).attr("r",e=>e.r).on("touchmove mouseover",e=>((e,t)=>{if("clusters"===d3.select("#positioning").node().value)return;let a=d3.event.pageX-20,r=d3.event.pageY+20,l=e.name;window.innerWidth-a<150&&(a=d3.event.pageX-40),d3.selectAll(".nodes").attr("r",e=>e.r).style("opacity",.3),d3.selectAll(".links").style("stroke","#999").style("opacity",.3),d3.selectAll(".node-labels > text").style("opacity",.3),D.transition().duration(200).style("opacity",.9),d3.select("#CO-"+l).attr("r",e=>2*e.r).style("opacity",1),d3.selectAll(".CO-labels-self-"+l).style("opacity","1"),d3.selectAll(".CO-links-"+l).style("stroke","firebrick").transition().duration(200).attr("stroke-dashoffset",0).style("opacity",1).on("end",(function(e,t){0===t&&d3.selectAll(".CO-nodes-"+l).style("opacity","1"),d3.selectAll(".CO-labels-"+l).style("opacity","1")}));let s=t.indexOf(l);d3.select("#nRadius-value").text(l),d3.select("#nRadius").property("value",s),D.html(j(e)).style("left",a+"px").style("top",r+"px").style("display",null)})(e,t)).on("click",e=>(e=>{let t=d3.select("#chart").select("svg");d3.event.stopPropagation(),t.transition().duration(750).call(E.transform,d3.zoomIdentity.translate(o/2,n/2).scale(2).translate(-e.x,-e.y),d3.mouse(t.node()))})(e)),s.append("g").classed("node-labels",!0).append("text").attr("class",e=>e.properties&&`CO-labels-${e.properties.source_no} CO-labels-self-${e.properties.case_no}`).attr("x",8).attr("y","0.31em").text(e=>e.name).clone(!0).lower(),s.exit().remove()};let V,F,G,H,Y,P,J,W,X,Z,Q,q,K,ee,te,ae,re={nodes:[],links:[]},le=!1,se=!0,oe=!0,ne=d3.map(),ie=d3.select("#positioning").node().value,ce=d3.select("#language").node().value,de="ro"===ce?"data/judete_wgs84.json":"../data/judete_wgs84.json";(()=>{let e,t={lines:9,length:4,width:5,radius:12,scale:1,corners:1,color:"#f40000",opacity:.25,rotate:0,direction:1,speed:1,trail:30,fps:20,zIndex:2e9,className:"spinner",shadow:!1,hwaccel:!1,position:"absolute"},a=document.getElementById("spinner");const r=[d3.json(de),d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")];Promise.all(r).then(r=>{X=r[0],W=r[1],e=new Spinner(t).spin(a),l(),setTimeout(s(),100)}).catch(e=>console.log(e));const l=()=>{J=W.data.nodes.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection),re.nodes=W.data.nodes,re.links=W.data.links,K=Array.from(new Set(re.nodes.map(e=>e.properties?+e.properties.case_no:""))),re.nodes=re.nodes.concat(Array.from(new Set(J.map(e=>e.properties.country_of_infection)),e=>({name:e}))),re.links=re.links.concat(J.map(e=>({target:e.name,source:e.properties.country_of_infection}))),Z="judete_wgs84",Q=topojson.feature(X,X.objects.judete_wgs84).features,q=topojson.feature(X,{type:"GeometryCollection",geometries:X.objects.judete_wgs84.geometries}),Q.forEach(e=>{let t=e.properties.county;ne.set(t,{lat:e.properties.lat,lon:e.properties.lon}),e.id=t,e.centroid=i.fitSize([o,n],q)([e.properties.lon,e.properties.lat]),e.force={},e.force.x=e.centroid[0],e.force.y=e.centroid[1],e.force.foc_x=e.centroid[0],e.force.foc_y=e.centroid[1]}),re.nodes=((e,t)=>{let a=d3.timeParse("%d-%m-%Y"),r=[],l=A(e),s=d3.scaleLinear().domain([0,d3.max(Object.values(l))]).range([5,25]);return e.forEach(e=>{void 0!==e.properties?(e.latitude=t.get(e.properties.county)&&t.get(e.properties.county).lat,e.longitude=t.get(e.properties.county)&&t.get(e.properties.county).lon,e.date=a(e.properties.diagnostic_date).getTime(),e.name=+e.name,e.infected_persons=l[e.properties.case_no]+1||1,e.r=s(e.infected_persons)):e.r=3}),e.sort((e,t)=>e.date-t.date),d3.nest().key((function(e){return e.properties&&e.properties.diagnostic_date})).entries(e).forEach((function(e){let t=[...e.values].sort((e,t)=>e.name-t.name),a=t.map((function(e){return e.dayOrder=t.indexOf(e)+1,e}));r.push(...a)})),r})(re.nodes,ne)},s=()=>{I(_(ce),300,300,"status-legend",(e=>"ro"===e?"Stare":"Status")(ce)),I(L,900,1100,"county-legend",(e=>"ro"===e?"Județ":"County")(ce)),I(C(ce),200,200,"gender-legend",(e=>"ro"===e?"Gen":"Gender")(ce)),I(O,400,400,"age-legend",(e=>"ro"===e?"Vârstă":"Age")(ce)),G=d3.scaleTime().domain(d3.extent(re.nodes,(function(e){return e.date}))).range([0,o]),H=d3.scaleLinear().domain(d3.extent(re.nodes,(function(e){return e.dayOrder}))).range([n,0]),P=(e=>{let t={};return e.nodes.forEach((function(e){t[e.name]=e})),t})(re);F=(e=>d3.forceSimulation(e.nodes).force("link",d3.forceLink(e.links).id(e=>e.name)).force("center",d3.forceCenter(o/2,n/2)).force("charge",d3.forceManyBody()).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]))(re),F.on("tick",()=>{k(P,d3.selectAll(".nodes"),d3.selectAll(".links"),d3.selectAll(".node-labels"),ie,G,H)}),F.force("link").links(re.links),V=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",o).attr("height",n).attr("viewBox","0, 0 "+o+" "+n).on("click",()=>{d3.selectAll(".nodes").style("opacity",1),d3.selectAll(".link").style("opacity",1),d3.selectAll(".node-labels > text").style("opacity","1"),d3.selectAll(".nodes").attr("r",e=>e.r),D.transition().duration(200).style("opacity",0)}),Y=V.append("g").attr("class","zoomable-group").style("transform-origin","50% 50% 0"),d3.select("#zoom-in").on("click",()=>V.transition().call(E.scaleBy,2)),d3.select("#zoom-out").on("click",()=>V.transition().call(E.scaleBy,.5)),d3.select("#reset-zoom").on("click",()=>z()),V.call(E),z(),d3.select("#show-map").on("click",()=>((e,t,a,r,l)=>{d3.select("#positioning").attr("value","map"),t.stop(),z(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",0),B(e.nodes,"map",0,a,r,l),d3.selectAll(".nodes").call(v(t,"map"))})(re,F,P,G,H)),d3.select("#show-map-clusters").on("click",()=>{$(re,F,P,G,H),d3.select(".pack-group").attr("transform","scale(1)"),d3.selectAll(".bubble").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)"),d3.selectAll(".labels").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)")}),d3.select("#show-clusters").on("click",()=>{$(re,F,P,G,H),d3.selectAll(".land").attr("opacity",.25),d3.select(".pack-group").attr("transform","scale(2)"),d3.selectAll(".bubble").attr("transform",e=>`translate(${e.x},${e.y})`),d3.selectAll(".labels").attr("transform",e=>`translate(${e.x},${e.y})`)}),d3.select("#show-graph").on("click",()=>(e=>{d3.select("#positioning").attr("value","diagram"),e.alpha(1).restart(),z(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",0),d3.selectAll(".nodes").call(v(e,"diagram"))})(F)),d3.select("#show-arcs").on("click",()=>((e,t,a,r,l)=>{d3.select("#positioning").attr("value","arcs"),t.stop(),z(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",0),d3.selectAll(".time-graph").attr("opacity",1),d3.selectAll(".pack-group").attr("opacity",0),B(e.nodes,"arcs",0,a,r,l),d3.selectAll(".nodes").call(v(t,"arcs"))})(re,F,P,G,H)),d3.select("#color-counties").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?L(e.properties.county):""),void R("county-legend"))),d3.select("#color-status").on("click",()=>M()),d3.select("#color-gender").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.gender?"var(--main-null)":C("ro")(e.properties.gender):""),void R("gender-legend"))),d3.select("#color-age").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.age?"var(--main-null)":O(e.properties.age):""),void R("age-legend")));d3.select("#legend-div").classed("hide",!0),d3.select("#toggle-legend").on("click",()=>{!0===le?(d3.select("#legend-div").classed("hide",!0),le=!1):(d3.select("#legend-div").classed("hide",!1),le=!0)}),d3.select("#search-case").on("click",()=>{!0===oe?(d3.select("#search-input").classed("hide",!1),oe=!1):(d3.select("#search-input").classed("hide",!0),oe=!0)}),d3.select("#search-input").on("input",(function(){K.includes(+this.value)&&T(+this.value)})),d3.select("#show-info").on("click",()=>se=(e=>(!0===e?(D.transition().duration(200).style("opacity",.9),D.html((e=>"ro"===e?"<strong>Relația cazurilor confirmate</strong>.<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/><br/>Dați click în afara cercului pentru a deselecta.":"<strong>Relationship between confirmed cases</strong>.<br/>The status until the date this information has been officially reported.<br/><br/>Click outside the circle to clear the selection.")(language)).style("left",o/2+"px").style("top",n/2+"px").style("display",null),e=!1):(D.transition().duration(200).style("opacity",0),e=!0),e))(se)),d3.select("#play-cases").on("click",()=>{d3.select("#play-cases").classed("hide",!0),d3.select("#pause-cases").classed("hide",!1),t()}),d3.select("#pause-cases").on("click",()=>{d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),a()});const t=()=>{V.call(E.scaleTo,.5),ae=d3.select("#nRadius").node().value,+ae==+K.length-1&&(ae=0),ee=setInterval((function(){te=K[ae],void 0!==te?(w(K,ae),ae++):ae=0}),200)},a=()=>{clearInterval(ee)};d3.select("#nRadius").on("input",(function(){w(K,+this.value)})),d3.select("#nRadius").property("max",K.length-1),w(K,K.length-1),((e,t)=>{const a=d3.select("svg").select(".zoomable-group").append("g").attr("class","time-graph").attr("opacity",0);a.append("text").attr("y",n+70).attr("x",o/2).attr("font-size","16px").attr("text-anchor","middle").text("Ziua");a.append("g").attr("transform","translate(0,"+n+")").call(d3.axisBottom(e).ticks(30).tickFormat(b)).selectAll("text").attr("class","time-graph-x").attr("font-weight","bold").style("text-anchor","end").attr("dx","-.8em").attr("transform","rotate(-65)"),a.append("g").call(d3.axisLeft(t).ticks(10)).selectAll("text").attr("class","time-graph-y").attr("font-weight","bold");a.append("text").attr("transform","rotate(-90)").attr("y",-50).attr("x",-n/2).attr("font-size","20px").attr("text-anchor","middle").text("Cazuri pe zi")})(G,H),((e,t)=>{let a=d3.select("svg").select(".zoomable-group");const r=d3.geoPath().projection(i.fitSize([o,n],t));a.append("g").attr("class","map-features").selectAll("path").data(e).enter().append("path").attr("d",r).attr("class","land").attr("opacity",.25)})(Q,q),N(re,K,F,ie),U(Q,re.nodes),M(),S(1),setTimeout((function(){F.stop(),e.stop(),d3.select("tooltip_div").classed("tooltip-abs",!0),d3.select("#CO-"+d3.max(K)).attr("r",e=>2*e.r).dispatch("mouseover")}),5e3)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
