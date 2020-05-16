!function(){"use strict";const e=50,t=50,a=10,r=50,l=window.innerWidth-t-r,s=window.innerHeight-e-a,o=d3.geoAlbers().center([24.7731,45.7909]).rotate([-14,3.3,-10]).parallels([37,54]).scale(5e3).translate([l/2,s/2]),n=(d3.geoPath().projection(o),d3.timeFormatLocale({dateTime:"%A, %e %B %Y г. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă","Duminică"],shortDays:["Lu","Ma","Mi","Jo","Vi","Sa","Du"],months:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],shortMonths:["Ian","Feb","Mart","Apr","Mai","Iun","Iul","Aug","Sept","Oct","Nov","Dec"]})),i=n.format(".%L"),c=n.format(":%S"),d=n.format("%I:%M"),p=n.format("%I %p"),u=n.format("%a %d"),f=n.format("%b %d"),m=n.format("%B"),g=n.format("%Y"),y=e=>(d3.timeSecond(e)<e?i:d3.timeMinute(e)<e?c:d3.timeHour(e)<e?d:d3.timeDay(e)<e?p:d3.timeMonth(e)<e?d3.timeWeek(e)<e?u:f:d3.timeYear(e)<e?m:g)(e),h=(e,t)=>d3.drag().on("start",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y)}).on("drag",e=>{"diagram"===t&&(e.fx=d3.event.x,e.fy=d3.event.y)}).on("end",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(0),a.fx=null,a.fy=null)}),A=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n    M${e.source.x},${e.source.y}\n    A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `},b=(e,t,a,r,l,s,o)=>{a.attr("d",t=>{if("arcs"===l){if("string"==typeof t.source.name)return A(t);{let a=s(e[t.source.name].date)||0,r=s(e[t.target.name].date);return["M",a,o(e[t.source.name].dayOrder),"A",(a-r)/2,",",(a-r)/2,0,0,",",a<r?1:0,r,o(e[t.target.name].dayOrder)].join(" ")}}return A(t)}),t.attr("transform",e=>`translate(${e.x},${e.y})`),r.attr("transform",e=>`translate(${e.x},${e.y})`)},v=e=>"ro"===e?d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]):d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmed","Discharged","Deceased"]),k=d3.scaleOrdinal(["#e4588c","#35d394","#ba1ea8","#4caf1c","#1848ca","#aad42b","#9b85ff","#068400","#8b2487","#97ff8b","#d60042","#00ae87","#f94740","#48d3ff","#d17300","#5ea2ff","#cfb100","#53498f","#ffe353","#325383","#86a700","#ff9eeb","#007f30","#d9b6ff","#3b5c12","#89c2ff","#964000","#00bfbb","#ff6f54","#01aac6","#ffb65d","#008857","#ff8e90","#145f36","#952e31","#fffea6","#8e3440","#5a936f","#883d0c","#ffaf81","#34a6c2","#b09764","#458a18"]).domain(["ALBA","ARAD","ARGEȘ","BACĂU","BIHOR","BISTRIȚA-NĂSĂUD","BOTOȘANI","BRAȘOV","BRĂILA","BUCUREȘTI","BUZĂU","CARAȘ-SEVERIN","CLUJ","CONSTANȚA","COVASNA","CĂLĂRAȘI","DOLJ","DÂMBOVIȚA","GALAȚI","GIURGIU","GORJ","HARGHITA","HUNEDOARA","IALOMIȚA","IAȘI","ILFOV","NECUNOSCUT","MARAMUREȘ","MEHEDINȚI","MUREȘ","NEAMȚ","OLT","PRAHOVA","SATU MARE","SIBIU","SUCEAVA","SĂLAJ","TELEORMAN","TIMIȘ","TULCEA","VASLUI","VRANCEA","VÂLCEA"]),x=e=>"ro"===e?d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Bărbat","Femeie"]):d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Male","Female"]),_=d3.scaleQuantile().domain([0,100]).range(d3.schemeSpectral[10]),L=()=>{d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?v("ro")(e.properties.status):""),C("status-legend")},O=(e,t,a,r,l)=>{const s=d3.select("#legend-div").append("div").attr("class",r).append("svg").attr("class","category-legend").attr("width",110).attr("height",t).attr("preserveAspectRatio","xMidYMid").attr("viewBox","-10, -10 120 "+a).attr("x",0).attr("y",0),o=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).title(l).titleWidth(100).labelFormat(d3.format(".0f")).labelAlign("start").scale(e);s.call(o)},C=e=>{d3.select(".county-legend").classed("hide",!0),d3.select(".status-legend").classed("hide",!0),d3.select(".gender-legend").classed("hide",!0),d3.select(".age-legend").classed("hide",!0),"county-legend"===e?d3.select(".county-legend").classed("hide",!1):"status-legend"===e?d3.select(".status-legend").classed("hide",!1):"gender-legend"===e?d3.select(".gender-legend").classed("hide",!1):"age-legend"===e&&d3.select(".age-legend").classed("hide",!1)},I=function(e){d3.selectAll(".node-labels").classed("hidden",t=>"string"!=typeof t.name&&e<=2),d3.selectAll(".labels").classed("hidden",t=>t.r<10/e)},M=(e,t)=>{d3.select("#nRadius-value").text(e[t]),d3.select("#nRadius").property("value",e[t]),d3.select("#search-input").property("value",e[t]),d3.selectAll(".nodes").attr("r",5),d3.select("#CO-"+e[t]).attr("r",15).dispatch("mouseover")},R=(e,t,a,r,l,s)=>{"map"===t||"clusters"===t?e.forEach((function(e){const t=o([e.longitude,e.latitude]);e.x=t[0]||e.x,e.y=t[1]||e.y})):e.forEach((function(e){e.x=l(e.date)||-100,e.y=s(e.dayOrder)}));const n=d3.transition().duration(a?0:800).ease(d3.easeElastic.period(.5));b(r,d3.selectAll(".nodes").transition(n),d3.selectAll(".links").transition(n),d3.selectAll(".node-labels").transition(n),t,l,s)},w=d3.zoom().scaleExtent([.2,10]).on("zoom",()=>{let e=d3.selectAll(".zoomable-group");return e.attr("transform",d3.event.transform),e.selectAll(".node-labels > text").attr("transform","scale("+1/d3.event.transform.k+")"),e.selectAll(".labels > text").attr("transform","scale("+1/d3.event.transform.k+")"),I(d3.event.transform.k)}),S=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),E=e=>{if(void 0!==e.properties){let t=d3.select("#language").node().value,a={cazulLabel:{ro:"Cazul",en:"Case"},maleLabel:{ro:"Bărbat",en:"Male"},femaleLabel:{ro:"Femeie",en:"Female"},unspecLabel:{ro:"Gen nespecificat",en:"Unspecified gender"},statusLabel:{ro:"Stare",en:"Status"},releasedLabel:{ro:"vindecat",en:"released"},confirmedLabel:{ro:"confirmat",en:"confirmed"},deceasedLabel:{ro:"deces",en:"deceased"},confdateLabel:{ro:"Data confirmării",en:"Confirmation date"},recoverydateLabel:{ro:"Data recuperării",en:"Recovery date"},infectionCountryLabel:{ro:"Țara de infectare",en:"Country of infection"},detailsLabel:{ro:"Detalii",en:"Details"},aiciLabel:{ro:"aici",en:"here"}},r=("Bărbat"===e.properties.gender?a.maleLabel[t]:"Femeie"===e.properties.gender?a.femaleLabel[t]:a.unspecLabel[t],null!=e.properties.age&&0!=e.properties.age&&e.properties.age,null!=e.properties.county&&""!=e.properties.county?", "+e.properties.county:""),l=null!=e.properties.status?a.statusLabel[t]+": "+("Vindecat"===e.properties.status?a.releasedLabel[t]:"Confirmat"===e.properties.status?a.confirmedLabel[t]:a.deceasedLabel[t])+".<br />":"",s=null!==e.properties.diagnostic_date?a.confdateLabel[t]+": "+e.properties.diagnostic_date+".<br />":"",o=null!==e.properties.healing_date?a.recoverydateLabel[t]+": "+e.properties.healing_date+".<br />":"",n=null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection?a.infectionCountryLabel[t]+": "+e.properties.country_of_infection+".<br />":"",i=null!==e.properties.reference&&""!==e.properties.reference?a.detailsLabel[t]+': <a href="'+e.properties.reference+'" target= "_blank">'+a.aiciLabel[t]+"</a>":"";return"<b>"+a.cazulLabel[t]+" "+e.properties.case_no+"</b>"+r+".<br />"+l+s+o+n+i}return e.name},z=(e,t,a,r)=>{let o,n,i=d3.select("svg").select(".zoomable-group").append("g").attr("class","nodes-group");const c=Array.from(new Set(e.nodes.map(e=>e.source)));i.append("defs").selectAll("marker").data(c).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),o=i.append("g").attr("class","link").selectAll("path").data(e.links).join("path").attr("class",e=>`CO-links-${e.source.name}`).classed("links",!0).attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),o.exit().remove(),n=i.append("g").attr("class","node").selectAll("g").data(e.nodes).join("g").call(h(a,r)),n.append("circle").attr("id",e=>e.properties&&`CO-${e.properties.case_no}`).attr("class",e=>e.properties&&`CO-nodes-${e.properties.source_no}`).classed("nodes",!0).attr("r",5).on("touchmove mouseover",(function(e){((e,t)=>{if("clusters"===d3.select("#positioning").node().value)return;let a=d3.event.pageX-20,r=d3.event.pageY+20,l=e.name;window.innerWidth-a<150&&(a=d3.event.pageX-40),d3.selectAll(".nodes").attr("r",5).style("opacity",.3),d3.selectAll(".links").style("stroke","#999").style("opacity",.3),d3.selectAll(".node-labels").style("opacity",.3),S.transition().duration(200).style("opacity",.9),d3.select("#CO-"+l).attr("r",15).style("opacity",1),d3.selectAll(".CO-links-"+l).style("stroke","firebrick").transition().duration(200).attr("stroke-dashoffset",0).style("opacity",1).on("end",(function(e,t){0===t&&d3.selectAll(".CO-nodes-"+l).style("opacity","1"),d3.selectAll(".CO-labels-"+l).style("opacity","1")})),d3.selectAll(".CO-labels-"+e.name).style("color","firebrick").style("opacity",1);let s=t.indexOf(e.name);d3.select("#nRadius-value").text(e.name),d3.select("#nRadius").property("value",s),S.html(E(e)).style("left",a+"px").style("top",r+"px").style("display",null)})(e,t)})).on("touchend mouseout",e=>{}).on("click",e=>(e=>{let t=d3.selectAll("svg");d3.event.stopPropagation(),t.transition().duration(750).call(w.transform,d3.zoomIdentity.translate(l/2,s/2).scale(2).translate(-e.x,-e.y),d3.mouse(t.node()))})(e)),n.append("g").attr("class","node-labels").append("text").attr("class",e=>`CO-labels-${e.name}`).attr("x",8).attr("y","0.31em").text(e=>e.name).clone(!0).lower(),n.exit().remove()};let B,D,T,U,$,j,N,V,F,G,H,Y,J,P,W,X,Z={nodes:[],links:[]},Q=!1,q=!0,K=!0,ee=d3.map(),te=d3.select("#positioning").node().value,ae=d3.select("#language").node().value,re="ro"===ae?"data/judete_wgs84.json":"../data/judete_wgs84.json";(()=>{let e,t={lines:9,length:4,width:5,radius:12,scale:1,corners:1,color:"#f40000",opacity:.25,rotate:0,direction:1,speed:1,trail:30,fps:20,zIndex:2e9,className:"spinner",shadow:!1,hwaccel:!1,position:"absolute"},a=document.getElementById("spinner");const r=[d3.json(re),d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")];Promise.all(r).then(r=>{F=r[0],V=r[1],e=new Spinner(t).spin(a),n(),setTimeout(i(),100)}).catch(e=>console.log(e));const n=()=>{N=V.data.nodes.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection),Z.nodes=V.data.nodes,Z.links=V.data.links,J=Array.from(new Set(Z.nodes.map(e=>e.properties?+e.properties.case_no:""))),Z.nodes=Z.nodes.concat(Array.from(new Set(N.map(e=>e.properties.country_of_infection)),e=>({name:e}))),Z.links=Z.links.concat(N.map(e=>({target:e.name,source:e.properties.country_of_infection}))),G="judete_wgs84",H=topojson.feature(F,F.objects.judete_wgs84).features,Y=topojson.feature(F,{type:"GeometryCollection",geometries:F.objects.judete_wgs84.geometries}),H.forEach(e=>{let t=e.properties.county;ee.set(t,{lat:e.properties.lat,lon:e.properties.lon}),e.id=t,e.centroid=o.fitSize([l,s],Y)([e.properties.lon,e.properties.lat]),e.force={},e.force.x=e.centroid[0],e.force.y=e.centroid[1],e.force.foc_x=e.centroid[0],e.force.foc_y=e.centroid[1]}),Z.nodes=((e,t)=>{let a=d3.timeParse("%d-%m-%Y"),r=[];return e.forEach(e=>{void 0!==e.properties&&(e.latitude=t.get(e.properties.county)&&t.get(e.properties.county).lat,e.longitude=t.get(e.properties.county)&&t.get(e.properties.county).lon,e.date=a(e.properties.diagnostic_date).getTime(),e.name=+e.name)}),e.sort((e,t)=>e.date-t.date),d3.nest().key((function(e){return e.properties&&e.properties.diagnostic_date})).entries(e).forEach((function(e){let t=[...e.values].sort((e,t)=>e.name-t.name),a=t.map((function(e){return e.dayOrder=t.indexOf(e)+1,e}));r.push(...a)})),r})(Z.nodes,ee)},i=()=>{O(v(ae),300,300,"status-legend",(e=>"ro"===e?"Stare":"Status")(ae)),O(k,900,1100,"county-legend",(e=>"ro"===e?"Județ":"County")(ae)),O(x(ae),200,200,"gender-legend",(e=>"ro"===e?"Gen":"Gender")(ae)),O(_,400,400,"age-legend",(e=>"ro"===e?"Vârstă":"Age")(ae)),T=d3.scaleTime().domain(d3.extent(Z.nodes,(function(e){return e.date}))).range([0,l]),U=d3.scaleLinear().domain(d3.extent(Z.nodes,(function(e){return e.dayOrder}))).range([s,0]),j=(e=>{let t={};return e.nodes.forEach((function(e){t[e.name]=e})),t})(Z);D=(e=>d3.forceSimulation(e.nodes).force("link",d3.forceLink(e.links).id(e=>JSON.parse(JSON.stringify(e)).name)).force("charge",d3.forceManyBody()).force("center",d3.forceCenter(l/2,s/2)).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]))(Z),D.on("tick",()=>{b(j,d3.selectAll(".nodes"),d3.selectAll(".links"),d3.selectAll(".node-labels"),te,T,U)}),D.force("link").links(Z.links),B=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",l).attr("height",s).attr("viewBox","0, 0 "+l+" "+s).on("click",()=>{d3.selectAll(".nodes").style("opacity",1),d3.selectAll(".link").style("opacity",1),d3.selectAll(".node-labels").style("opacity","1"),d3.selectAll(".nodes").attr("r",5),S.transition().duration(200).style("opacity",0)}),$=B.append("g").attr("class","zoomable-group"),d3.select("#zoom-in").on("click",()=>B.transition().call(w.scaleBy,2)),d3.select("#zoom-out").on("click",()=>B.transition().call(w.scaleBy,.5)),d3.select("#reset-zoom").on("click",()=>B.call(w.scaleTo,.5)),B.call(w).call(w.scaleTo,.5),d3.select("#show-map").on("click",()=>((e,t,a,r,l)=>{d3.select("#positioning").attr("value","map"),t.stop(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",1),R(e.nodes,"map",0,a,r,l),d3.selectAll(".nodes").call(h(t,"map")),d3.selectAll(".tooltip").style("opacity",1)})(Z,D,j,T,U)),d3.select("#show-map-clusters").on("click",()=>((e,t,a,r,l,s)=>{d3.select("#positioning").attr("value","clusters"),t.stop(),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",1),R(e.nodes,"clusters",0,a,r,l),d3.selectAll(".nodes").call(h(t,"clusters")),d3.selectAll(".nodes-group").style("opacity",0),d3.selectAll(".tooltip").style("opacity",0),d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),clearInterval(s)})(Z,D,j,T,U,P)),d3.select("#show-graph").on("click",()=>(e=>{d3.select("#positioning").attr("value","diagram"),e.alpha(1).restart(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",0),d3.selectAll(".nodes").call(h(e,"diagram")),d3.selectAll(".tooltip").style("opacity",1)})(D)),d3.select("#show-arcs").on("click",()=>((e,t,a,r,l)=>{d3.select("#positioning").attr("value","arcs"),t.stop(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",0),d3.selectAll(".time-graph").attr("opacity",1),d3.selectAll(".pack-group").attr("opacity",0),R(e.nodes,"arcs",0,a,r,l),d3.selectAll(".nodes").call(h(t,"arcs")),d3.selectAll(".tooltip").style("opacity",1)})(Z,D,j,T,U)),d3.select("#color-counties").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?k(e.properties.county):""),void C("county-legend"))),d3.select("#color-status").on("click",()=>L()),d3.select("#color-gender").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.gender?"var(--main-null)":x("ro")(e.properties.gender):""),void C("gender-legend"))),d3.select("#color-age").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.age?"var(--main-null)":_(e.properties.age):""),void C("age-legend")));d3.select("#legend-div").classed("hide",!0),d3.select("#toggle-legend").on("click",()=>{!0===Q?(d3.select("#legend-div").classed("hide",!0),Q=!1):(d3.select("#legend-div").classed("hide",!1),Q=!0)}),d3.select("#search-case").on("click",()=>{!0===K?(d3.select("#search-input").classed("hide",!1),K=!1):(d3.select("#search-input").classed("hide",!0),K=!0)}),d3.select("#search-input").on("input",(function(){var e;J.includes(+this.value)&&(e=+this.value,d3.selectAll(".nodes").attr("r",5),d3.select("#CO-"+e).attr("r",15).dispatch("mouseover").dispatch("click"))})),d3.select("#show-info").on("click",()=>q=(e=>(!0===e?(S.transition().duration(200).style("opacity",.9),S.html((e=>"ro"===e?"<strong>Relația cazurilor confirmate</strong>.<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/><br/>Dați click în afara cercului pentru a deselecta.":"<strong>Relationship between confirmed cases</strong>.<br/>The status until the date this information has been officially reported.<br/><br/>Click outside the circle to clear the selection.")(language)).style("left",l/2+"px").style("top",s/2+"px").style("display",null),e=!1):(S.transition().duration(200).style("opacity",0),e=!0),e))(q)),d3.select("#play-cases").on("click",()=>{d3.select("#play-cases").classed("hide",!0),d3.select("#pause-cases").classed("hide",!1),t()}),d3.select("#pause-cases").on("click",()=>{d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),a()});const t=()=>{B.call(w.scaleTo,.5),X=d3.select("#nRadius").node().value,+X==+J.length-1&&(X=0),P=setInterval((function(){W=J[X],void 0!==W?(M(J,X),X++):X=0}),200)},a=()=>{clearInterval(P)};d3.select("#nRadius").on("input",(function(){M(J,+this.value)})),d3.select("#nRadius").property("max",J.length-1),M(J,J.length-1),((e,t)=>{const a=d3.select("svg").select(".zoomable-group").append("g").attr("class","time-graph").attr("opacity",0);a.append("text").attr("y",s+70).attr("x",l/2).attr("font-size","16px").attr("text-anchor","middle").text("Ziua");a.append("g").attr("transform","translate(0,"+s+")").call(d3.axisBottom(e).ticks(20).tickFormat(y)).selectAll("text").attr("font-weight","bold").style("text-anchor","end").attr("dx","-.8em").attr("transform","rotate(-65)"),a.append("g").call(d3.axisLeft(t).ticks(10)).selectAll("text").attr("font-weight","bold");a.append("text").attr("transform","rotate(-90)").attr("y",-50).attr("x",-s/2).attr("font-size","20px").attr("text-anchor","middle").text("Cazuri pe zi")})(T,U),((e,t)=>{let a=d3.select("svg").select(".zoomable-group");const r=d3.geoPath().projection(o.fitSize([l,s],t));a.append("g").attr("class","map-features").selectAll("path").data(e).enter().append("path").attr("d",r).attr("class","land").attr("opacity",.25)})(H,Y),z(Z,J,D,te),((e,t)=>{let a,r,o,n,i,c,d,p,u,f={},m=[];o=d3.select("svg").select(".zoomable-group").append("g").attr("class","pack-group").attr("opacity",0),i=d3.forceSimulation().force("collision",d3.forceCollide().radius(e=>e.radius).strength(.01)).force("attract",d3.forceAttract().target(e=>[e.foc_x,e.foc_y]).strength(.5)),n=d3.nest().key(e=>e.properties&&e.properties.county).key(e=>e.properties&&e.properties.source_no).entries(t),n.forEach((function(e){f[e.key]=1})),m.push({id:"root",parent:""}),e.forEach((function(e){if(void 0!==f[e.id])return m.push({id:e.id,parent:"root",d:e})})),n.forEach((function(e){if("undefined"!==e.key){[...e.values].filter(e=>"null"!==e.key).sort((e,t)=>e.name-t.name).forEach((function(t){m.push({id:t.key,parent:e.key,source_case:t,value:t.values.length})}))}})),a=d3.stratify().id(e=>e.id).parentId(e=>e.parent)(m),a.sum(e=>e.value).sort((e,t)=>t.value-e.value),r=d3.pack().size([.5*l,.5*s]).padding(8),r(a),a.eachBefore(e=>null!=e.parent?(e.relx=e.x-e.parent.x,e.rely=e.y-e.parent.y):(e.relx=e.x,e.rely=e.y)),a.eachBefore(e=>{if(null!=e.parent&&"root"===e.parent.id)return e.data.d.force.r=e.r});let g,y,h,A=d3.select("#language").node().value;for(c=o.selectAll(".bubble").data(a.leaves()),d=c.enter().append("circle").attr("class","bubble").attr("r",e=>e.r).attr("fill",e=>k(e.parent.id)),d.append("title").text((function(e){return"ro"===A?e.data.parent+" - sursa nr. "+e.id+"\n"+e.value+" cazuri":e.data.parent+" - source no. "+e.id+"\n"+e.value+" cases"})),p=o.selectAll(".labels").data(a.leaves()),u=p.enter().append("g").attr("class","labels"),u.append("text").text(e=>e.value).attr("dy","0.35em"),I(1),i.nodes(e.map(e=>e.force)).stop(),g=y=0,h=Math.ceil(Math.log(i.alphaMin())/Math.log(1-i.alphaDecay()));0<=h?y<h:y>h;g=0<=h?++y:--y)i.tick();d.attr("transform",e=>`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`),u.attr("transform",e=>`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`)})(H,Z.nodes),L(),I(.9),setTimeout((function(){D.stop(),e.stop(),d3.select("tooltip_div").classed("tooltip-abs",!0),d3.select("#CO-"+d3.max(J)).attr("r",15).dispatch("mouseover")}),5e3)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
