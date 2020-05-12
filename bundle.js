!function(){"use strict";const e=50,t=50,a=50,r=50,n=window.innerWidth-t-r,o=window.innerHeight-e-a,s=n+t+r,i=o+e+a,l=d3.geoAlbers().center([24.7731,45.7909]).rotate([-14,3.3,-10]).parallels([37,54]).scale(5e3),c=(d3.geoPath().projection(l),d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none")),d=e=>{if(void 0!==e.properties){let t=d3.select("#language").node().value,a={cazulLabel:{ro:"Cazul",en:"Case"},maleLabel:{ro:"Bărbat",en:"Male"},femaleLabel:{ro:"Femeie",en:"Female"},unspecLabel:{ro:"Gen nespecificat",en:"Unspecified gender"},statusLabel:{ro:"Stare",en:"Status"},releasedLabel:{ro:"vindecat",en:"released"},confirmedLabel:{ro:"confirmat",en:"confirmed"},deceasedLabel:{ro:"deces",en:"deceased"},confdateLabel:{ro:"Data confirmării",en:"Confirmation date"},recoverydateLabel:{ro:"Data recuperării",en:"Recovery date"},infectionCountryLabel:{ro:"Țara de infectare",en:"Country of infection"},detailsLabel:{ro:"Detalii",en:"Details"},aiciLabel:{ro:"aici",en:"here"}},r=("Bărbat"===e.properties.gender?a.maleLabel[t]:"Femeie"===e.properties.gender?a.femaleLabel[t]:a.unspecLabel[t],null!=e.properties.age&&0!=e.properties.age&&e.properties.age,null!=e.properties.county&&""!=e.properties.county?", "+e.properties.county:""),n=null!=e.properties.status?a.statusLabel[t]+": "+("Vindecat"===e.properties.status?a.releasedLabel[t]:"Confirmat"===e.properties.status?a.confirmedLabel[t]:a.deceasedLabel[t])+".<br />":"",o=null!==e.properties.diagnostic_date?a.confdateLabel[t]+": "+e.properties.diagnostic_date+".<br />":"",s=null!==e.properties.healing_date?a.recoverydateLabel[t]+": "+e.properties.healing_date+".<br />":"",i=null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection?a.infectionCountryLabel[t]+": "+e.properties.country_of_infection+".<br />":"",l=null!==e.properties.reference&&""!==e.properties.reference?a.detailsLabel[t]+': <a href="'+e.properties.reference+'" target= "_blank">'+a.aiciLabel[t]+"</a>":"";return"<b>"+a.cazulLabel[t]+" "+e.properties.case_no+"</b>"+r+".<br />"+n+o+s+i+l}return e.name},p=(e,t)=>d3.drag().on("start",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y)}).on("drag",e=>{"diagram"===t&&(e.fx=d3.event.x,e.fy=d3.event.y)}).on("end",a=>{"diagram"===t&&(d3.event.active||e.alphaTarget(0),a.fx=null,a.fy=null)}),u=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n    M${e.source.x},${e.source.y}\n    A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `},f=e=>"ro"===e?d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]):d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmed","Discharged","Deceased"]),m=d3.scaleOrdinal(["#e4588c","#35d394","#ba1ea8","#4caf1c","#1848ca","#aad42b","#9b85ff","#068400","#8b2487","#97ff8b","#d60042","#00ae87","#f94740","#48d3ff","#d17300","#5ea2ff","#cfb100","#53498f","#ffe353","#325383","#86a700","#ff9eeb","#007f30","#d9b6ff","#3b5c12","#89c2ff","#964000","#00bfbb","#ff6f54","#01aac6","#ffb65d","#008857","#ff8e90","#145f36","#952e31","#fffea6","#8e3440","#5a936f","#883d0c","#ffaf81","#34a6c2","#b09764","#458a18"]).domain(["ALBA","ARAD","ARGEȘ","BACĂU","BIHOR","BISTRIȚA-NĂSĂUD","BOTOȘANI","BRAȘOV","BRĂILA","BUCUREȘTI","BUZĂU","CARAȘ-SEVERIN","CLUJ","CONSTANȚA","COVASNA","CĂLĂRAȘI","DOLJ","DÂMBOVIȚA","GALAȚI","GIURGIU","GORJ","HARGHITA","HUNEDOARA","IALOMIȚA","IAȘI","ILFOV","NECUNOSCUT","MARAMUREȘ","MEHEDINȚI","MUREȘ","NEAMȚ","OLT","PRAHOVA","SATU MARE","SIBIU","SUCEAVA","SĂLAJ","TELEORMAN","TIMIȘ","TULCEA","VASLUI","VRANCEA","VÂLCEA"]),g=e=>"ro"===e?d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Bărbat","Femeie"]):d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Male","Female"]),y=d3.scaleQuantile().domain([0,100]).range(d3.schemeSpectral[10]),h=()=>{d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?f("ro")(e.properties.status):""),A("status-legend")},b=(e,t,a,r,n)=>{const o=d3.select("#legend-div").append("div").attr("class",r).append("svg").attr("class","category-legend").attr("width",110).attr("height",t).attr("preserveAspectRatio","xMidYMid").attr("viewBox","-10, -10 120 "+a).attr("x",0).attr("y",0),s=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).title(n).titleWidth(100).labelFormat(d3.format(".0f")).labelAlign("start").scale(e);o.call(s)},A=e=>{d3.select(".county-legend").classed("hide",!0),d3.select(".status-legend").classed("hide",!0),d3.select(".gender-legend").classed("hide",!0),d3.select(".age-legend").classed("hide",!0),"county-legend"===e?d3.select(".county-legend").classed("hide",!1):"status-legend"===e?d3.select(".status-legend").classed("hide",!1):"gender-legend"===e?d3.select(".gender-legend").classed("hide",!1):"age-legend"===e&&d3.select(".age-legend").classed("hide",!1)};let v,k,x,L,_,O,C,I,R,M,S,w,E,B,D,U,T={nodes:[],links:[]},z="diagram",N=!1,j=!0,V=!0,$=d3.timeParse("%d-%m-%Y"),F=[];E=d3.select("#language").node().value;let G="ro"===E?"data/judete_wgs84.json":"../data/judete_wgs84.json";const H=d3.timeFormatLocale({dateTime:"%A, %e %B %Y г. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă","Duminică"],shortDays:["Lu","Ma","Mi","Jo","Vi","Sa","Du"],months:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],shortMonths:["Ian","Feb","Mart","Apr","Mai","Iun","Iul","Aug","Sept","Oct","Nov","Dec"]}),Y=H.format(".%L"),J=H.format(":%S"),P=H.format("%I:%M"),W=H.format("%I %p"),X=H.format("%a %d"),Z=H.format("%b %d"),Q=H.format("%B"),q=H.format("%Y");function K(e){return(d3.timeSecond(e)<e?Y:d3.timeMinute(e)<e?J:d3.timeHour(e)<e?P:d3.timeDay(e)<e?W:d3.timeMonth(e)<e?d3.timeWeek(e)<e?X:Z:d3.timeYear(e)<e?Q:q)(e)}(()=>{let e,t={lines:9,length:4,width:5,radius:12,scale:1,corners:1,color:"#f40000",opacity:.25,rotate:0,direction:1,speed:1,trail:30,fps:20,zIndex:2e9,className:"spinner",shadow:!1,hwaccel:!1,position:"absolute"},a=document.getElementById("spinner");const r=[d3.json(G),d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")];Promise.all(r).then(r=>{_=r[0],L=r[1],e=new Spinner(t).spin(a),H(),setTimeout(Y(),100)}).catch(e=>console.log(e));const H=()=>{const e=L.data.nodes.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection);T.nodes=L.data.nodes,T.links=L.data.links,w=Array.from(new Set(T.nodes.map(e=>e.properties?+e.properties.case_no:""))),T.nodes=T.nodes.concat(Array.from(new Set(e.map(e=>e.properties.country_of_infection)),e=>({name:e}))),T.links=T.links.concat(e.map(e=>({target:e.name,source:e.properties.country_of_infection}))),I=()=>{let e={};return T.nodes.forEach((function(t){e[t.name]=t})),e},M=()=>{let e={};return T.nodes.forEach((function(t){e[t.name]=[],T.links.forEach((function(a){a.source===t.name&&e[t.name].push(a.target)}))})),e},R=I(),S=M(),O="judete_wgs84",C=topojson.feature(_,_.objects[O]).features;let t=d3.map();C.forEach(e=>{let a=e.properties.county;t.set(a,{lat:e.properties.lat,lon:e.properties.lon})}),T.nodes.forEach(e=>{void 0!==e.properties&&(e.latitude=t.get(e.properties.county)&&t.get(e.properties.county).lat,e.longitude=t.get(e.properties.county)&&t.get(e.properties.county).lon,e.date=$(e.properties.diagnostic_date).getTime(),e.name=+e.name)}),T.nodes.sort((e,t)=>e.date-t.date),d3.nest().key((function(e){return e.properties&&e.properties.diagnostic_date})).entries(T.nodes).forEach((function(e){let t=[...e.values].sort((e,t)=>e.name-t.name),a=t.map((function(e){return e.dayOrder=t.indexOf(e)+1,e}));F.push(...a)})),T.nodes=F},Y=()=>{const t=d3.zoom().scaleExtent([.2,10]).on("zoom",()=>{$.attr("transform",d3.event.transform)});d3.select("#zoom-in").on("click",()=>$.transition().call(t.scaleBy,2)),d3.select("#zoom-out").on("click",()=>$.transition().call(t.scaleBy,.5)),d3.select("#reset-zoom").on("click",()=>{$.transition().duration(750).call(t.transform,d3.zoomIdentity,d3.zoomTransform($.node()).invert([s/2,i/2]))}),d3.select("#show-info").on("click",()=>a());const a=()=>{!0===j?(c.transition().duration(200).style("opacity",.9),c.html((e=>"ro"===e?"<strong>Relația cazurilor confirmate</strong>.<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/><br/>Dați click în afara cercului pentru a deselecta.":"<strong>Relationship between confirmed cases</strong>.<br/>The status until the date this information has been officially reported.<br/><br/>Click outside the circle to clear the selection.")(E)).style("left",s/2+"px").style("top",i/2+"px").style("display",null),j=!1):(c.transition().duration(200).style("opacity",0),j=!0)};b(f(E),300,300,"status-legend",(e=>"ro"===e?"Stare":"Status")(E)),b(m,900,1100,"county-legend",(e=>"ro"===e?"Județ":"County")(E)),b(g(E),200,200,"gender-legend",(e=>"ro"===e?"Gen":"Gender")(E)),b(y,400,400,"age-legend",(e=>"ro"===e?"Vârstă":"Age")(E)),d3.select("#color-counties").on("click",()=>(d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?m(e.properties.county):""),void A("county-legend"))),d3.select("#color-status").on("click",()=>h()),d3.select("#color-gender").on("click",()=>(d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.gender?"var(--main-null)":g("ro")(e.properties.gender):""),void A("gender-legend"))),d3.select("#color-age").on("click",()=>(d3.select("#chart").select("svg").selectAll("circle").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.age?"var(--main-null)":y(e.properties.age):""),void A("age-legend")));const r=d3.scaleTime().domain(d3.extent(T.nodes,(function(e){return e.date}))).range([0,s]),L=d3.scaleLinear().domain(d3.extent(T.nodes,(function(e){return e.dayOrder}))).range([i,0]),I=(e,t,a)=>{e.attr("d",e=>{if("arcs"===a){if("string"==typeof e.source.name)return u(e);{let t=r(R[e.source.name].date)||0,a=r(R[e.target.name].date);return["M",t,L(R[e.source.name].dayOrder),"A",(t-a)/2,",",(t-a)/2,0,0,",",t<a?1:0,a,L(R[e.target.name].dayOrder)].join(" ")}}return u(e)}),t.attr("transform",e=>`translate(${e.x},${e.y})`)};v=d3.forceSimulation(T.nodes).force("link",d3.forceLink(T.links).id(e=>JSON.parse(JSON.stringify(e)).name)).force("charge",d3.forceManyBody()).force("center",d3.forceCenter(n/2,o/2)).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]),v.on("tick",()=>{I(k,x,z)}),v.force("link").links(T.links);const M=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",s).attr("height",i).attr("viewBox","0, 0 "+s+" "+i).on("click",()=>{d3.selectAll("circle").style("opacity",1),d3.selectAll(".link").style("opacity",1),d3.selectAll(".node-labels").style("opacity","1"),d3.selectAll("circle").attr("r",5),c.transition().duration(200).style("opacity",0)}),$=M.append("g"),F=$.append("g").attr("class","time-graph").attr("opacity",0);F.append("text").attr("y",i+70).attr("x",s/2).attr("font-size","16px").attr("text-anchor","middle").text("Ziua");F.append("g").attr("transform","translate(0,"+i+")").call(d3.axisBottom(r).ticks(20).tickFormat(K)).selectAll("text").attr("font-weight","bold").style("text-anchor","end").attr("dx","-.8em").attr("transform","rotate(-65)"),F.append("g").call(d3.axisLeft(L).ticks(10)).selectAll("text").attr("font-weight","bold");F.append("text").attr("transform","rotate(-90)").attr("y",-50).attr("x",-i/2).attr("font-size","20px").attr("text-anchor","middle").text("Cazuri pe zi");const G=topojson.feature(_,{type:"GeometryCollection",geometries:_.objects[O].geometries}),H=d3.geoPath().projection(l.fitSize([s,i],G)),Y=$.append("g").attr("class","map-features").selectAll("path").data(C).enter().append("path").attr("d",H).attr("class","land").attr("opacity",.25),J=Array.from(new Set(T.nodes.map(e=>e.source)));$.append("defs").selectAll("marker").data(J).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),k=$.append("g").attr("class","link").selectAll("path").data(T.links).join("path").attr("class",e=>`CO-links-${e.source.name}`).classed("links",!0).attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),k.exit().remove(),x=$.append("g").attr("class","node").selectAll("g").data(T.nodes).join("g").call(p(v,z));x.append("circle").attr("id",e=>e.properties&&`CO-${e.properties.case_no}`).attr("r",5).on("touchmove mouseover",(function(e){((e,t,a)=>{let r=d3.event.pageX-20,n=d3.event.pageY+20;window.innerWidth-r<150&&(r=d3.event.pageX-40),d3.selectAll("circle").attr("r",5).style("opacity",.3),d3.selectAll(".links").style("stroke","#999").style("opacity",.3),d3.selectAll(".node-labels").style("opacity",.3),c.transition().duration(200).style("opacity",.9),d3.select("#CO-"+e.name).attr("r",15).style("opacity",1),d3.selectAll(".CO-links-"+e.name).style("stroke","firebrick").transition().duration(500).attr("stroke-dashoffset",0).style("opacity",1).on("end",(function(e,a){0===a&&d3.selectAll("circle").filter((function(a){return t[e.source.name].includes(a.name)||+e.source.name==+a.name})).style("opacity","1"),d3.selectAll(".node-labels").filter((function(a){return t[e.source.name].includes(a.name)||+e.source.name==+a.name})).style("opacity","1")})),d3.selectAll(".CO-labels-"+e.name).style("color","firebrick").style("opacity",1);let o=a.indexOf(e.name);d3.select("#nRadius-value").text(e.name),d3.select("#nRadius").property("value",o),c.html(d(e)).style("left",r+"px").style("top",n+"px").style("display",null)})(e,S,w)})).on("touchend mouseout",e=>{}).on("click",e=>{d3.event.stopPropagation(),$.transition().duration(750).call(t.transform,d3.zoomIdentity.translate(n/2,o/2).translate(-e.x,-e.y))}),x.append("text").attr("class",e=>`CO-labels-${e.name}`).classed("node-labels",!0).attr("x",8).attr("y","0.31em").text(e=>"string"==typeof e.name?e.name:"").clone(!0).lower(),x.exit().remove(),h(),t(M);const P=(e,t)=>{"map"===e?T.nodes.forEach((function(e){const t=l([e.longitude,e.latitude]);e.x=t[0]||e.x,e.y=t[1]||e.y})):T.nodes.forEach((function(e){e.x=r(e.date)||-100,e.y=L(e.dayOrder)}));const a=d3.transition().duration(t?0:800).ease(d3.easeElastic.period(.5));I(k.transition(a),x.transition(a),e)};d3.select("#show-map").on("click",()=>(z="map",Y.attr("opacity",1),F.attr("opacity",0),v.stop(),P(z,0),void x.call(p(v,z)))),d3.select("#show-graph").on("click",()=>(z="diagram",Y.attr("opacity",.25),F.attr("opacity",0),v.alpha(1).restart(),void x.call(p(v,z)))),d3.select("#show-arcs").on("click",()=>(z="arcs",Y.attr("opacity",0),F.attr("opacity",1),v.stop(),P(z,0),void x.call(p(v,z))));d3.select("#legend-div").classed("hide",!0),d3.select("#toggle-legend").on("click",()=>{!0===N?(d3.select("#legend-div").classed("hide",!0),N=!1):(d3.select("#legend-div").classed("hide",!1),N=!0)});d3.select("#search-case").on("click",()=>{!0===V?(d3.select("#search-input").classed("hide",!1),V=!1):(d3.select("#search-input").classed("hide",!0),V=!0)}),d3.select("#search-input").on("input",(function(){var e;e=+this.value,w.includes(e)&&(d3.selectAll("circle").attr("r",5),d3.select("#CO-"+e).attr("r",15).dispatch("mouseover").dispatch("click"))})),$.transition().call(t.scaleBy,.5),d3.select("#play-cases").on("click",()=>{d3.select("#play-cases").classed("hide",!0),d3.select("#pause-cases").classed("hide",!1),W()}),d3.select("#pause-cases").on("click",()=>{d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),X()});const W=()=>{$.transition().call(t.scaleBy,1),U=d3.select("#nRadius").node().value,+U==+w.length-1&&(U=0),B=setInterval((function(){D=w[U],void 0!==D?(Z(U),U++):U=0}),200)},X=()=>{clearInterval(B)};d3.select("#nRadius").on("input",(function(){Z(+this.value)})),d3.select("#nRadius").property("max",w.length-1);const Z=e=>{d3.select("#nRadius-value").text(w[e]),d3.select("#nRadius").property("value",w[e]),d3.select("#search-input").property("value",w[e]),d3.selectAll("circle").attr("r",5),d3.select("#CO-"+w[e]).attr("r",15).dispatch("mouseover")};Z(w.length-1),setTimeout((function(){v.stop(),e.stop(),d3.select("tooltip_div").classed("tooltip-abs",!0),d3.select("#CO-"+d3.max(w)).attr("r",15).dispatch("mouseover")}),5e3)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
