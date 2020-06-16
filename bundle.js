!function(){"use strict";const e=100,t=100,a=50,r=100,s=window.innerWidth-t-r,l=window.innerHeight-e-a,o=s+t+r,i=l+e+a,n=d3.geoAlbers().center([24.7731,45.7909]).rotate([-14,3.3,-10]).parallels([37,54]).scale(5e3).translate([o/2,i/2]),d=(d3.geoPath().projection(n),d3.timeFormatLocale({dateTime:"%A, %e %B %Y г. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă","Duminică"],shortDays:["Lu","Ma","Mi","Jo","Vi","Sa","Du"],months:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],shortMonths:["Ian","Feb","Mart","Apr","Mai","Iun","Iul","Aug","Sept","Oct","Nov","Dec"]})),c=d.format(".%L"),p=d.format(":%S"),u=d.format("%I:%M"),f=d.format("%I %p"),g=d.format("%a %d"),m=d.format("%b %d"),h=d.format("%B"),y=d.format("%Y"),A=e=>(d3.timeSecond(e)<e?c:d3.timeMinute(e)<e?p:d3.timeHour(e)<e?u:d3.timeDay(e)<e?f:d3.timeMonth(e)<e?d3.timeWeek(e)<e?g:m:d3.timeYear(e)<e?h:y)(e),b=e=>d3.nest().key(e=>e.properties&&e.properties.source_no).rollup(e=>e.length).object(e),v=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),x=e=>{if(void 0!==e.properties){let t=d3.select("#language").node().value,a={cazulLabel:{ro:"Cazul",en:"Case"},maleLabel:{ro:"Bărbat",en:"Male"},femaleLabel:{ro:"Femeie",en:"Female"},unspecLabel:{ro:"Gen nespecificat",en:"Unspecified gender"},statusLabel:{ro:"Stare",en:"Status"},releasedLabel:{ro:"vindecat",en:"released"},confirmedLabel:{ro:"confirmat",en:"confirmed"},deceasedLabel:{ro:"deces",en:"deceased"},confdateLabel:{ro:"Data confirmării",en:"Confirmation date"},recoverydateLabel:{ro:"Data recuperării",en:"Recovery date"},infectionCountryLabel:{ro:"Țara de infectare",en:"Country of infection"},detailsLabel:{ro:"Detalii",en:"Details"},aiciLabel:{ro:"aici",en:"here"}},r=("Bărbat"===e.properties.gender?a.maleLabel[t]:"Femeie"===e.properties.gender?a.femaleLabel[t]:a.unspecLabel[t],null!=e.properties.age&&0!=e.properties.age&&e.properties.age,null!=e.properties.county&&""!=e.properties.county?", "+e.properties.county:""),s=null!=e.properties.status?a.statusLabel[t]+": "+("Vindecat"===e.properties.status?a.releasedLabel[t]:"Confirmat"===e.properties.status?a.confirmedLabel[t]:a.deceasedLabel[t])+".<br />":"",l=null!==e.properties.diagnostic_date?a.confdateLabel[t]+": "+e.properties.diagnostic_date+".<br />":"",o=null!==e.properties.healing_date?a.recoverydateLabel[t]+": "+e.properties.healing_date+".<br />":"",i=null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection?a.infectionCountryLabel[t]+": "+e.properties.country_of_infection+".<br />":"",n=null!==e.properties.reference&&""!==e.properties.reference?a.detailsLabel[t]+': <a href="'+e.properties.reference+'" target= "_blank">'+a.aiciLabel[t]+"</a>":"";return"<b>"+a.cazulLabel[t]+" "+e.properties.case_no+"</b>"+r+".<br />"+s+l+o+i+n}return e.name},k=e=>{d3.select("#CO-"+e).dispatch("mouseover")},_=e=>t=>{d3.selectAll(t.ancestors().map(e=>e.node)).classed("node--hover",e)},C=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n        M${e.source.x},${e.source.y}\n        A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `},L=(e,t,a,r,s,l)=>{a.attr("d",t=>{if("arcs"===s){if("string"==typeof t.source.name)return C(t);{let a=l.xScale(e[t.source.name].date)||0,r=l.xScale(e[t.target.name].date);return["M",a,l.yScale(e[t.source.name].dayOrder),"A",(a-r)/2,",",(a-r)/2,0,0,",",a<r?1:0,r,l.yScale(e[t.target.name].dayOrder)].join(" ")}}return C(t)}),t.attr("transform",e=>`translate(${e.x},${e.y})`),r.attr("transform",e=>`translate(${e.x},${e.y})`)},w=e=>"ro"===e?d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]):d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmed","Discharged","Deceased"]),O=d3.scaleOrdinal(["#e4588c","#35d394","#ba1ea8","#4caf1c","#1848ca","#aad42b","#9b85ff","#068400","#8b2487","#97ff8b","#d60042","#00ae87","#f94740","#48d3ff","#d17300","#5ea2ff","#cfb100","#53498f","#ffe353","#325383","#86a700","#ff9eeb","#007f30","#d9b6ff","#3b5c12","#89c2ff","#964000","#00bfbb","#ff6f54","#01aac6","#ffb65d","#008857","#ff8e90","#145f36","#952e31","#fffea6","#8e3440","#5a936f","#883d0c","#ffaf81","#34a6c2","#b09764","#458a18"]).domain(["ALBA","ARAD","ARGEȘ","BACĂU","BIHOR","BISTRIȚA-NĂSĂUD","BOTOȘANI","BRAȘOV","BRĂILA","BUCUREȘTI","BUZĂU","CARAȘ-SEVERIN","CLUJ","CONSTANȚA","COVASNA","CĂLĂRAȘI","DOLJ","DÂMBOVIȚA","GALAȚI","GIURGIU","GORJ","HARGHITA","HUNEDOARA","IALOMIȚA","IAȘI","ILFOV","NECUNOSCUT","MARAMUREȘ","MEHEDINȚI","MUREȘ","NEAMȚ","OLT","PRAHOVA","SATU MARE","SIBIU","SUCEAVA","SĂLAJ","TELEORMAN","TIMIȘ","TULCEA","VASLUI","VRANCEA","VÂLCEA"]),S=e=>"ro"===e?d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Bărbat","Femeie"]):d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Male","Female"]),E=d3.scaleQuantile().domain([0,100]).range(d3.schemeSpectral[10]),I=()=>{d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?w("ro")(e.properties.status):""),z("status-legend")},M=(e,t,a,r,s)=>{const l=d3.select("#legend-div").append("div").attr("class",r).append("svg").attr("class","category-legend").attr("width",110).attr("height",t).attr("preserveAspectRatio","xMidYMid").attr("viewBox","-10, -10 120 "+a).attr("x",0).attr("y",0),o=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).title(s).titleWidth(100).labelFormat(d3.format(".0f")).labelAlign("start").scale(e);l.call(o)},z=e=>{d3.select(".county-legend").classed("hide",!0),d3.select(".status-legend").classed("hide",!0),d3.select(".gender-legend").classed("hide",!0),d3.select(".age-legend").classed("hide",!0),"county-legend"===e?d3.select(".county-legend").classed("hide",!1):"status-legend"===e?d3.select(".status-legend").classed("hide",!1):"gender-legend"===e?d3.select(".gender-legend").classed("hide",!1):"age-legend"===e&&d3.select(".age-legend").classed("hide",!1)},R=(e,t)=>{d3.select("#nRadius-value").text(e[t]),d3.select("#nRadius").property("value",e[t]),d3.select("#search-input").property("value",e[t]),d3.selectAll(".nodes").attr("r",e=>e.r),d3.select("#CO-"+e[t]).attr("r",e=>2*e.r).dispatch("mouseover")},D=e=>{d3.selectAll(".node-labels").classed("hidden",t=>"string"!=typeof t.name&&e<=1.9),d3.selectAll(".labels").classed("hidden",t=>t.r<10/e)},V=d3.zoom().scaleExtent([.2,10]).on("zoom",()=>{let e=d3.selectAll(".zoomable-group");e.attr("transform",d3.event.transform);let t=d3.event.transform.k;return t>.8&&(e.selectAll(".node-labels > text").attr("transform","scale("+1/t+")"),e.selectAll(".labels > text").attr("transform","scale("+1/t+")")),D(t)}),$=()=>{d3.select("#chart").select("svg").call(V.transform,d3.zoomIdentity.scale(.5))},B=(e,t,a,r,s)=>{"map"===t||"clusters"===t?e.forEach((function(e){const t=n([e.longitude,e.latitude]);e.x=t[0]||e.x,e.y=t[1]||e.y})):e.forEach((function(e){e.x=s.xScale(e.date)||-100,e.y=s.yScale(e.dayOrder)}));const l=d3.transition().duration(a?0:800).ease(d3.easeElastic.period(.5));L(r,d3.selectAll(".nodes").transition(l),d3.selectAll(".links").transition(l),d3.selectAll(".node-labels").transition(l),t,s)},F=(e,t,a,r)=>{d3.select("#positioning").attr("value","map"),t.stop(),$(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",1),B(e.nodes,"clusters",0,a,r),d3.selectAll(".nodes-group").style("opacity",0)},j=(e,t,a,r)=>{let s,l,n=d3.select("svg").select(".zoomable-group").append("g").attr("class","nodes-group");const d=Array.from(new Set(e.nodes.map(e=>e.source)));n.append("defs").selectAll("marker").data(d).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),s=n.append("g").attr("class","link").selectAll("path").data(e.links).join("path").attr("class",e=>`CO-links-${e.source.name}`).classed("links",!0).attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),s.exit().remove(),l=n.append("g").attr("class","node").selectAll("g").data(e.nodes).join("g"),l.append("circle").attr("id",e=>e.properties&&`CO-${e.properties.case_no}`).attr("class",e=>e.properties&&`CO-nodes-${e.properties.source_no}`).classed("nodes",!0).attr("r",e=>e.r).on("touchmove mouseover",e=>((e,t)=>{if("clusters"===d3.select("#positioning").node().value)return;let a=d3.event.pageX-20,r=d3.event.pageY+20,s=e.name;window.innerWidth-a<150&&(a=d3.event.pageX-40),d3.selectAll(".nodes").attr("r",e=>e.r).style("opacity",.3),d3.selectAll(".links").style("stroke","#999").style("opacity",.3),d3.selectAll(".node-labels > text").style("opacity",.3),v.transition().duration(200).style("opacity",.9),d3.select("#CO-"+s).attr("r",e=>2*e.r).style("opacity",1),d3.selectAll(".CO-labels-self-"+s).style("opacity","1"),d3.selectAll(".CO-links-"+s).style("stroke","firebrick").transition().duration(200).attr("stroke-dashoffset",0).style("opacity",1).on("end",(e,t)=>{0===t&&(d3.selectAll(".CO-nodes-"+s).style("opacity","1"),d3.selectAll(".CO-labels-"+s).style("opacity","1"))});let l=t.indexOf(s);d3.select("#nRadius-value").text(s),d3.select("#nRadius").property("value",l),v.html(x(e)).style("left",a+"px").style("top",r+"px").style("display",null)})(e,t)).on("click",e=>(e=>{let t=d3.select("#chart").select("svg");d3.event.stopPropagation(),t.transition().duration(750).call(V.transform,d3.zoomIdentity.scale(2).translate(-e.x,-e.y).translate(o/2,i/2),d3.mouse(t.node()))})(e)),l.append("g").classed("node-labels",!0).append("text").attr("class",e=>e.properties&&`CO-labels-${e.properties.source_no} CO-labels-self-${e.properties.case_no}`).attr("x",8).attr("y","0.31em").text(e=>e.name).clone(!0).lower(),l.exit().remove()};class U{constructor(e,t,a){this.parentElement=e,this.geoCounties=t,this.geojsonFeatures=a,this.initViz()}initViz(){this.height=i,this.width=o,this.g=d3.select(this.parentElement).append("g").attr("class","map-features").attr("opacity",1),this.setupData()}setupData(){this.dataFiltered=this.geoCounties,this.updateViz()}updateViz(){if(void 0!==this.dataFiltered){const e=d3.geoPath().projection(n.fitSize([this.width,this.height],this.geojsonFeatures));this.g.selectAll("path").data(this.dataFiltered).enter().append("path").attr("d",e).attr("class","land").attr("opacity",.25).append("title").text(e=>e.id)}}}class T{constructor(e,t,a){this.parentElement=e,this.geoCounties=t,this.graphNodes=a,this.initViz()}initViz(){this.height=i,this.width=o,this.g=d3.select(this.parentElement).append("g").attr("class","pack-group").attr("opacity",0),this.setupData()}setupData(){let e={},t=[];const a=d3.nest().key(e=>e.properties&&e.properties.county).key(e=>e.properties&&e.properties.source_no).entries(this.graphNodes);a.forEach(t=>e[t.key]=1),t.push({id:"root",parent:""}),this.geoCounties.forEach(a=>{if(void 0!==e[a.id])return t.push({id:a.id,parent:"root",d:a})}),a.forEach(e=>{if("undefined"!==e.key){[...e.values].filter(e=>"null"!==e.key).sort((e,t)=>e.name-t.name).forEach(a=>{t.push({id:a.key,parent:e.key,source_case:a,value:a.values.length})})}});const r=d3.stratify().id(e=>e.id).parentId(e=>e.parent)(t);r.sum(e=>e.value).sort((e,t)=>t.value-e.value),d3.pack().size([this.width/2,this.height/2]).padding(8)(r),r.eachBefore(e=>null!=e.parent?(e.relx=e.x-e.parent.x,e.rely=e.y-e.parent.y):(e.relx=e.x,e.rely=e.y)),r.eachBefore(e=>{if(null!=e.parent&&"root"===e.parent.id)return e.data.d.force.r=e.r}),this.dataFiltered=r,this.updateViz()}updateViz(){var e=this;if(void 0!==e.dataFiltered){let t,a,r,s,l,o,i,n=d3.select("#language").node().value;for(e.simulation=d3.forceSimulation().force("collision",d3.forceCollide().radius(e=>e.radius).strength(.01)).force("attract",d3.forceAttract().target(e=>[e.foc_x,e.foc_y]).strength(.5)),t=e.g.selectAll(".bubble").data(e.dataFiltered.descendants()).enter().append("g").each((function(e){e.node=this})).on("mouseover",_(!0)).on("mouseout",_(!1)),a=t.append("circle").attr("class","bubble").attr("r",e=>e.r).on("touchmove mouseover",e=>k(e.id)).attr("fill",e=>e.parent&&"root"!==e.parent.id?O(e.parent.id):"#E8E8E8"),a.append("title").text(e=>"ro"===n?e.data.parent+" - sursa "+e.id+"\n"+e.value+" cazuri":e.data.parent+" - source "+e.id+"\n"+e.value+" cases"),r=e.g.selectAll(".labels").data(e.dataFiltered.leaves()),s=r.enter().append("g").attr("class","labels"),s.append("text").text(e=>e.value).attr("dy","0.35em"),D(1),e.simulation.nodes(e.geoCounties.map(e=>e.force)).stop(),l=o=0,i=Math.ceil(Math.log(e.simulation.alphaMin())/Math.log(1-e.simulation.alphaDecay()));0<=i?o<i:o>i;l=0<=i?++o:--o)e.simulation.tick()}}}class N{constructor(e,t){this.parentElement=e,this.data=t,this.initViz()}initViz(){var e=this;let t=d3.select("#language").node().value;e.height=i,e.width=o,e.g=d3.select(e.parentElement).append("g").attr("class","time-graph").attr("opacity",0),e.t=function(){return d3.transition().duration(1e3)},e.xScale=d3.scaleTime().range([0,e.width]),e.yScale=d3.scaleLinear().range([e.height,0]),e.yAxisCall=d3.axisLeft().ticks(10),e.xAxisCall=d3.axisBottom().ticks(30),e.xAxis=e.g.append("g").attr("class","time-graph-x").attr("transform",`translate(0,${e.height})`),e.yAxis=e.g.append("g").attr("class","time-graph-y"),e.xLabel=e.g.append("text").attr("y",e.height+70).attr("x",e.width/2).attr("font-size","16px").attr("text-anchor","middle").text("ro"===t?"Ziua":"Day"),e.yLabel=e.g.append("text").attr("transform","rotate(-90)").attr("y",-50).attr("x",-e.height/2).attr("font-size","20px").attr("text-anchor","middle").text("ro"===t?"Cazuri ordonate pe zi":"Ordered cases per day"),e.setupData()}setupData(){this.dataFiltered=this.data,this.updateViz()}updateViz(){var e=this;void 0!==e.dataFiltered&&(e.xScale.domain(d3.extent(e.dataFiltered,e=>e.date)),e.yScale.domain(d3.extent(e.dataFiltered,e=>e.dayOrder)),e.xAxisCall.scale(e.xScale),e.xAxis.transition(e.t()).call(e.xAxisCall.tickFormat(A)),e.yAxisCall.scale(e.yScale),e.yAxis.transition(e.t()).call(e.yAxisCall),e.xAxis.selectAll("text").attr("font-weight","bold").style("text-anchor","end").attr("dx","-.8em").attr("transform","rotate(-65)"),e.yAxis.selectAll("text").attr("font-weight","bold"))}}let G,H,Y,P,J,W,X,Z,Q,q,K,ee,te,ae,re,se,le,oe,ie,ne={nodes:[],links:[]},de=d3.map(),ce=!1,pe=!0,ue=!0,fe=d3.select("#positioning").node().value,ge=d3.select("#language").node().value,me="ro"===ge?"data/judete_wgs84.json":"../data/judete_wgs84.json";(()=>{let e,t={lines:9,length:4,width:5,radius:12,scale:1,corners:1,color:"#f40000",opacity:.25,rotate:0,direction:1,speed:1,trail:30,fps:20,zIndex:2e9,className:"spinner",shadow:!1,hwaccel:!1,position:"absolute"},a=document.getElementById("spinner");const r=[d3.json(me),d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")];Promise.all(r).then(r=>{Q=r[0],Z=r[1],e=new Spinner(t).spin(a),s(),l(),setTimeout(d(),100)}).catch(e=>console.log(e));const s=()=>{X=Z.data.nodes.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection),ne.nodes=Z.data.nodes,ne.links=Z.data.links,te=Array.from(new Set(ne.nodes.map(e=>e.properties?+e.properties.case_no:""))),ne.nodes=ne.nodes.concat(Array.from(new Set(X.map(e=>e.properties.country_of_infection)),e=>({name:e}))),ne.links=ne.links.concat(X.map(e=>({target:e.name,source:e.properties.country_of_infection}))),q="judete_wgs84",K=topojson.feature(Q,Q.objects.judete_wgs84).features,ee=topojson.feature(Q,{type:"GeometryCollection",geometries:Q.objects.judete_wgs84.geometries}),K.forEach(e=>{let t=e.properties.county;de.set(t,{lat:e.properties.lat,lon:e.properties.lon}),e.id=t,e.centroid=n.fitSize([o,i],ee)([e.properties.lon,e.properties.lat]),e.force={},e.force.x=e.centroid[0],e.force.y=e.centroid[1],e.force.foc_x=e.centroid[0],e.force.foc_y=e.centroid[1]}),ne.nodes=((e,t)=>{let a=d3.timeParse("%d-%m-%Y"),r=[],s=b(e),l=d3.scaleLinear().domain([0,d3.max(Object.values(s))]).range([5,25]);return e.forEach(e=>{void 0!==e.properties?(e.latitude=t.get(e.properties.county)&&t.get(e.properties.county).lat,e.longitude=t.get(e.properties.county)&&t.get(e.properties.county).lon,e.date=a(e.properties.diagnostic_date).getTime(),e.name=+e.name,e.infected_persons=s[e.properties.case_no]+1||1,e.r=l(e.infected_persons)):e.r=3}),e.sort((e,t)=>e.date-t.date),d3.nest().key(e=>e.properties&&e.properties.diagnostic_date).entries(e).forEach(e=>{let t=[...e.values].sort((e,t)=>e.name-t.name),a=t.map(e=>(e.dayOrder=t.indexOf(e)+1,e));r.push(...a)}),r})(ne.nodes,de)},l=()=>{H=(e=>d3.forceSimulation(e.nodes).force("link",d3.forceLink(e.links).id(e=>e.name)).force("center",d3.forceCenter(o/2,i/2)).force("charge",d3.forceManyBody()).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]))(ne),H.on("tick",()=>{L(W,d3.selectAll(".nodes"),d3.selectAll(".links"),d3.selectAll(".node-labels"),fe,ie)}),H.force("link").links(ne.links),G=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",o).attr("height",i).attr("viewBox","0, 0 "+o+" "+i).on("click",()=>{d3.selectAll(".nodes").style("opacity",1),d3.selectAll(".link").style("opacity",1),d3.selectAll(".node-labels > text").style("opacity","1"),d3.selectAll(".nodes").attr("r",e=>e.r),v.transition().duration(200).style("opacity",0)}),J=G.append("g").attr("class","zoomable-group").style("transform-origin","50% 50% 0"),le=new U(".zoomable-group",K,ee),oe=new T(".zoomable-group",K,ne.nodes),ie=new N(".zoomable-group",ne.nodes),W=(e=>{let t={};return e.nodes.forEach(e=>t[e.name]=e),t})(ne)},d=()=>{M(w(ge),300,300,"status-legend",(e=>"ro"===e?"Stare":"Status")(ge)),M(O,900,1100,"county-legend",(e=>"ro"===e?"Județ":"County")(ge)),M(S(ge),200,200,"gender-legend",(e=>"ro"===e?"Gen":"Gender")(ge)),M(E,400,400,"age-legend",(e=>"ro"===e?"Vârstă":"Age")(ge)),Y=d3.scaleTime().domain(d3.extent(ne.nodes,e=>e.date)).range([0,o]),P=d3.scaleLinear().domain(d3.extent(ne.nodes,e=>e.dayOrder)).range([i,0]),d3.select("#zoom-in").on("click",()=>G.transition().call(V.scaleBy,2)),d3.select("#zoom-out").on("click",()=>G.transition().call(V.scaleBy,.5)),d3.select("#reset-zoom").on("click",()=>$()),G.call(V),$(),d3.select("#show-map").on("click",()=>((e,t,a,r)=>{d3.select("#positioning").attr("value","map"),t.stop(),$(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)"),B(e.nodes,"map",0,a,r)})(ne,H,W,ie)),d3.select("#show-map-clusters").on("click",()=>{F(ne,H,W,ie),d3.select(".pack-group").attr("transform","scale(1)"),d3.selectAll(".bubble").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)"),d3.selectAll(".labels").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)")}),d3.select("#show-clusters").on("click",()=>{F(ne,H,W,ie),d3.selectAll(".land").attr("opacity",.5),d3.select(".pack-group").attr("transform","scale(2)"),d3.selectAll(".bubble").attr("transform",e=>`translate(${e.x},${e.y})`),d3.selectAll(".labels").attr("transform",e=>`translate(${e.x},${e.y})`)}),d3.select("#show-graph").on("click",()=>(e=>{d3.select("#positioning").attr("value","diagram"),e.alpha(1).restart(),setTimeout(()=>{e.stop()},5e3),$(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)")})(H)),d3.select("#show-arcs").on("click",()=>((e,t,a,r)=>{d3.select("#positioning").attr("value","arcs"),t.stop(),$(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",1),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)"),B(e.nodes,"arcs",0,a,r)})(ne,H,W,ie)),d3.select("#color-counties").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?O(e.properties.county):""),void z("county-legend"))),d3.select("#color-status").on("click",()=>I()),d3.select("#color-gender").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.gender?"var(--main-null)":S("ro")(e.properties.gender):""),void z("gender-legend"))),d3.select("#color-age").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.age?"var(--main-null)":E(e.properties.age):""),void z("age-legend")));d3.select("#legend-div").classed("hide",!0),d3.select("#toggle-legend").on("click",()=>{!0===ce?(d3.select("#legend-div").classed("hide",!0),ce=!1):(d3.select("#legend-div").classed("hide",!1),ce=!0)}),d3.select("#search-case").on("click",()=>{!0===ue?(d3.select("#search-input").classed("hide",!1),ue=!1):(d3.select("#search-input").classed("hide",!0),ue=!0)}),d3.select("#search-input").on("input",()=>{te.includes(+(void 0).value)&&k(+(void 0).value)}),d3.select("#show-info").on("click",()=>pe=((e,t)=>(!0===e?(v.transition().duration(200).style("opacity",.9),v.html((e=>"ro"===e?"<strong>Relația cazurilor confirmate</strong>.<br/>Date de pe covid19.geo-spatial.org<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/>Dați click în afara cercului pentru a deselecta.":"<strong>Relationship between confirmed cases</strong>.<br/>Data from covid19.geo-spatial.org<br/>The status until the date this information has been officially reported.<br/>Click outside the circle to clear the selection.")(t)).style("left",o/2+"px").style("top",i/2+"px").style("display",null),e=!1):(v.transition().duration(200).style("opacity",0),e=!0),e))(pe,ge)),d3.select("#play-cases").on("click",()=>{d3.select("#play-cases").classed("hide",!0),d3.select("#pause-cases").classed("hide",!1),t()}),d3.select("#pause-cases").on("click",()=>{d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),a()});const t=()=>{G.call(V.scaleTo,.5),se=d3.select("#nRadius").node().value,+se==+te.length-1&&(se=0),ae=setInterval(()=>{re=te[se],void 0!==re?(R(te,se),se++):se=0},200)},a=()=>{clearInterval(ae)};d3.select("#nRadius").on("input",(function(){R(te,+this.value)})),d3.select("#nRadius").property("max",te.length-1),R(te,te.length-1),ie.setupData(),le.setupData(),j(ne,te),oe.setupData(),I(),D(1),setTimeout(()=>{H.stop(),e.stop(),d3.select("tooltip_div").classed("tooltip-abs",!0),d3.select("#CO-"+d3.max(te)).attr("r",e=>2*e.r).dispatch("mouseover")},5e3)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
