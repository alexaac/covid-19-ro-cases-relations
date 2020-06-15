!function(){"use strict";const e=100,t=100,a=50,r=100,s=window.innerWidth-t-r,l=window.innerHeight-e-a,o=s+t+r,n=l+e+a,i=d3.geoAlbers().center([24.7731,45.7909]).rotate([-14,3.3,-10]).parallels([37,54]).scale(5e3).translate([o/2,n/2]),d=(d3.geoPath().projection(i),d3.timeFormatLocale({dateTime:"%A, %e %B %Y г. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă","Duminică"],shortDays:["Lu","Ma","Mi","Jo","Vi","Sa","Du"],months:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],shortMonths:["Ian","Feb","Mart","Apr","Mai","Iun","Iul","Aug","Sept","Oct","Nov","Dec"]})),c=d.format(".%L"),p=d.format(":%S"),u=d.format("%I:%M"),f=d.format("%I %p"),g=d.format("%a %d"),m=d.format("%b %d"),h=d.format("%B"),y=d.format("%Y"),b=e=>(d3.timeSecond(e)<e?c:d3.timeMinute(e)<e?p:d3.timeHour(e)<e?u:d3.timeDay(e)<e?f:d3.timeMonth(e)<e?d3.timeWeek(e)<e?g:m:d3.timeYear(e)<e?h:y)(e),A=e=>d3.nest().key(e=>e.properties&&e.properties.source_no).rollup(e=>e.length).object(e),v=d3.select("body").append("tooltip_div").attr("class","tooltip").style("opacity",0).style("display","none"),k=e=>{if(void 0!==e.properties){let t=d3.select("#language").node().value,a={cazulLabel:{ro:"Cazul",en:"Case"},maleLabel:{ro:"Bărbat",en:"Male"},femaleLabel:{ro:"Femeie",en:"Female"},unspecLabel:{ro:"Gen nespecificat",en:"Unspecified gender"},statusLabel:{ro:"Stare",en:"Status"},releasedLabel:{ro:"vindecat",en:"released"},confirmedLabel:{ro:"confirmat",en:"confirmed"},deceasedLabel:{ro:"deces",en:"deceased"},confdateLabel:{ro:"Data confirmării",en:"Confirmation date"},recoverydateLabel:{ro:"Data recuperării",en:"Recovery date"},infectionCountryLabel:{ro:"Țara de infectare",en:"Country of infection"},detailsLabel:{ro:"Detalii",en:"Details"},aiciLabel:{ro:"aici",en:"here"}},r=("Bărbat"===e.properties.gender?a.maleLabel[t]:"Femeie"===e.properties.gender?a.femaleLabel[t]:a.unspecLabel[t],null!=e.properties.age&&0!=e.properties.age&&e.properties.age,null!=e.properties.county&&""!=e.properties.county?", "+e.properties.county:""),s=null!=e.properties.status?a.statusLabel[t]+": "+("Vindecat"===e.properties.status?a.releasedLabel[t]:"Confirmat"===e.properties.status?a.confirmedLabel[t]:a.deceasedLabel[t])+".<br />":"",l=null!==e.properties.diagnostic_date?a.confdateLabel[t]+": "+e.properties.diagnostic_date+".<br />":"",o=null!==e.properties.healing_date?a.recoverydateLabel[t]+": "+e.properties.healing_date+".<br />":"",n=null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection?a.infectionCountryLabel[t]+": "+e.properties.country_of_infection+".<br />":"",i=null!==e.properties.reference&&""!==e.properties.reference?a.detailsLabel[t]+': <a href="'+e.properties.reference+'" target= "_blank">'+a.aiciLabel[t]+"</a>":"";return"<b>"+a.cazulLabel[t]+" "+e.properties.case_no+"</b>"+r+".<br />"+s+l+o+n+i}return e.name},x=e=>{d3.select("#CO-"+e).dispatch("mouseover")},_=e=>t=>{d3.selectAll(t.ancestors().map(e=>e.node)).classed("node--hover",e)},L=e=>{const t=Math.hypot(e.target.x-e.source.x,e.target.y-e.source.y);return`\n        M${e.source.x},${e.source.y}\n        A${t},${t} 0 0,1 ${e.target.x},${e.target.y}\n    `},C=(e,t,a,r,s,l,o)=>{a.attr("d",t=>{if("arcs"===s){if("string"==typeof t.source.name)return L(t);{let a=l(e[t.source.name].date)||0,r=l(e[t.target.name].date);return["M",a,o(e[t.source.name].dayOrder),"A",(a-r)/2,",",(a-r)/2,0,0,",",a<r?1:0,r,o(e[t.target.name].dayOrder)].join(" ")}}return L(t)}),t.attr("transform",e=>`translate(${e.x},${e.y})`),r.attr("transform",e=>`translate(${e.x},${e.y})`)},O=e=>"ro"===e?d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmat","Vindecat","Decedat"]):d3.scaleOrdinal(["var(--main-confirmate)","var(--main-recuperari)","var(--main-decese)"]).domain(["Confirmed","Discharged","Deceased"]),w=d3.scaleOrdinal(["#e4588c","#35d394","#ba1ea8","#4caf1c","#1848ca","#aad42b","#9b85ff","#068400","#8b2487","#97ff8b","#d60042","#00ae87","#f94740","#48d3ff","#d17300","#5ea2ff","#cfb100","#53498f","#ffe353","#325383","#86a700","#ff9eeb","#007f30","#d9b6ff","#3b5c12","#89c2ff","#964000","#00bfbb","#ff6f54","#01aac6","#ffb65d","#008857","#ff8e90","#145f36","#952e31","#fffea6","#8e3440","#5a936f","#883d0c","#ffaf81","#34a6c2","#b09764","#458a18"]).domain(["ALBA","ARAD","ARGEȘ","BACĂU","BIHOR","BISTRIȚA-NĂSĂUD","BOTOȘANI","BRAȘOV","BRĂILA","BUCUREȘTI","BUZĂU","CARAȘ-SEVERIN","CLUJ","CONSTANȚA","COVASNA","CĂLĂRAȘI","DOLJ","DÂMBOVIȚA","GALAȚI","GIURGIU","GORJ","HARGHITA","HUNEDOARA","IALOMIȚA","IAȘI","ILFOV","NECUNOSCUT","MARAMUREȘ","MEHEDINȚI","MUREȘ","NEAMȚ","OLT","PRAHOVA","SATU MARE","SIBIU","SUCEAVA","SĂLAJ","TELEORMAN","TIMIȘ","TULCEA","VASLUI","VRANCEA","VÂLCEA"]),I=e=>"ro"===e?d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Bărbat","Femeie"]):d3.scaleOrdinal(["var(--main-barbat)","var(--main-femeie)"]).domain(["Male","Female"]),M=d3.scaleQuantile().domain([0,100]).range(d3.schemeSpectral[10]),R=()=>{d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?O("ro")(e.properties.status):""),S("status-legend")},E=(e,t,a,r,s)=>{const l=d3.select("#legend-div").append("div").attr("class",r).append("svg").attr("class","category-legend").attr("width",110).attr("height",t).attr("preserveAspectRatio","xMidYMid").attr("viewBox","-10, -10 120 "+a).attr("x",0).attr("y",0),o=d3.legendColor().shape("path",d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).title(s).titleWidth(100).labelFormat(d3.format(".0f")).labelAlign("start").scale(e);l.call(o)},S=e=>{d3.select(".county-legend").classed("hide",!0),d3.select(".status-legend").classed("hide",!0),d3.select(".gender-legend").classed("hide",!0),d3.select(".age-legend").classed("hide",!0),"county-legend"===e?d3.select(".county-legend").classed("hide",!1):"status-legend"===e?d3.select(".status-legend").classed("hide",!1):"gender-legend"===e?d3.select(".gender-legend").classed("hide",!1):"age-legend"===e&&d3.select(".age-legend").classed("hide",!1)},z=(e,t)=>{d3.select("#nRadius-value").text(e[t]),d3.select("#nRadius").property("value",e[t]),d3.select("#search-input").property("value",e[t]),d3.selectAll(".nodes").attr("r",e=>e.r),d3.select("#CO-"+e[t]).attr("r",e=>2*e.r).dispatch("mouseover")},D=e=>{d3.selectAll(".node-labels").classed("hidden",t=>"string"!=typeof t.name&&e<=1.9),d3.selectAll(".labels").classed("hidden",t=>t.r<10/e)},$=d3.zoom().scaleExtent([.2,10]).on("zoom",()=>{let e=d3.selectAll(".zoomable-group");e.attr("transform",d3.event.transform);let t=d3.event.transform.k;return t>.8&&(e.selectAll(".node-labels > text").attr("transform","scale("+1/t+")"),e.selectAll(".labels > text").attr("transform","scale("+1/t+")")),D(t)}),B=()=>{d3.select("#chart").select("svg").call($.transform,d3.zoomIdentity.scale(.5))},j=(e,t,a,r,s,l)=>{"map"===t||"clusters"===t?e.forEach((function(e){const t=i([e.longitude,e.latitude]);e.x=t[0]||e.x,e.y=t[1]||e.y})):e.forEach((function(e){e.x=s(e.date)||-100,e.y=l(e.dayOrder)}));const o=d3.transition().duration(a?0:800).ease(d3.easeElastic.period(.5));C(r,d3.selectAll(".nodes").transition(o),d3.selectAll(".links").transition(o),d3.selectAll(".node-labels").transition(o),t,s,l)},V=(e,t,a,r,s)=>{d3.select("#positioning").attr("value","map"),t.stop(),B(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("opacity",1),j(e.nodes,"clusters",0,a,r,s),d3.selectAll(".nodes-group").style("opacity",0)},F=(e,t,a,r)=>{let s,l,i=d3.select("svg").select(".zoomable-group").append("g").attr("class","nodes-group");const d=Array.from(new Set(e.nodes.map(e=>e.source)));i.append("defs").selectAll("marker").data(d).join("marker").attr("id",e=>`arrow-${e}`).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("fill","#999").attr("d","M0,-5L10,0L0,5"),s=i.append("g").attr("class","link").selectAll("path").data(e.links).join("path").attr("class",e=>`CO-links-${e.source.name}`).classed("links",!0).attr("marker-end",e=>`url(${new URL(`#arrow-${e.type}`,location.toString())})`),s.exit().remove(),l=i.append("g").attr("class","node").selectAll("g").data(e.nodes).join("g"),l.append("circle").attr("id",e=>e.properties&&`CO-${e.properties.case_no}`).attr("class",e=>e.properties&&`CO-nodes-${e.properties.source_no}`).classed("nodes",!0).attr("r",e=>e.r).on("touchmove mouseover",e=>((e,t)=>{if("clusters"===d3.select("#positioning").node().value)return;let a=d3.event.pageX-20,r=d3.event.pageY+20,s=e.name;window.innerWidth-a<150&&(a=d3.event.pageX-40),d3.selectAll(".nodes").attr("r",e=>e.r).style("opacity",.3),d3.selectAll(".links").style("stroke","#999").style("opacity",.3),d3.selectAll(".node-labels > text").style("opacity",.3),v.transition().duration(200).style("opacity",.9),d3.select("#CO-"+s).attr("r",e=>2*e.r).style("opacity",1),d3.selectAll(".CO-labels-self-"+s).style("opacity","1"),d3.selectAll(".CO-links-"+s).style("stroke","firebrick").transition().duration(200).attr("stroke-dashoffset",0).style("opacity",1).on("end",(e,t)=>{0===t&&(d3.selectAll(".CO-nodes-"+s).style("opacity","1"),d3.selectAll(".CO-labels-"+s).style("opacity","1"))});let l=t.indexOf(s);d3.select("#nRadius-value").text(s),d3.select("#nRadius").property("value",l),v.html(k(e)).style("left",a+"px").style("top",r+"px").style("display",null)})(e,t)).on("click",e=>(e=>{let t=d3.select("#chart").select("svg");d3.event.stopPropagation(),t.transition().duration(750).call($.transform,d3.zoomIdentity.scale(2).translate(-e.x,-e.y).translate(o/2,n/2),d3.mouse(t.node()))})(e)),l.append("g").classed("node-labels",!0).append("text").attr("class",e=>e.properties&&`CO-labels-${e.properties.source_no} CO-labels-self-${e.properties.case_no}`).attr("x",8).attr("y","0.31em").text(e=>e.name).clone(!0).lower(),l.exit().remove()};class U{constructor(e,t,a){this.parentElement=e,this.geoCounties=t,this.geojsonFeatures=a,this.initViz()}initViz(){this.height=n,this.width=o,this.g=d3.select(this.parentElement).append("g").attr("class","map-features").attr("opacity",1),this.setupData()}setupData(){this.dataFiltered=this.geoCounties,this.updateVis()}updateVis(){if(void 0!==this.dataFiltered){console.log(this.dataFiltered);const e=d3.geoPath().projection(i.fitSize([this.width,this.height],this.geojsonFeatures));this.g.selectAll("path").data(this.dataFiltered).enter().append("path").attr("d",e).attr("class","land").attr("opacity",.25).append("title").text(e=>e.id)}}}class T{constructor(e,t,a){this.parentElement=e,this.geoCounties=t,this.graphNodes=a,this.initViz()}initViz(){this.height=n,this.width=o,this.g=d3.select(this.parentElement).append("g").attr("class","pack-group").attr("opacity",0),this.setupData()}setupData(){let e={},t=[];const a=d3.nest().key(e=>e.properties&&e.properties.county).key(e=>e.properties&&e.properties.source_no).entries(this.graphNodes);a.forEach(t=>e[t.key]=1),t.push({id:"root",parent:""}),this.geoCounties.forEach(a=>{if(void 0!==e[a.id])return t.push({id:a.id,parent:"root",d:a})}),a.forEach(e=>{if("undefined"!==e.key){[...e.values].filter(e=>"null"!==e.key).sort((e,t)=>e.name-t.name).forEach(a=>{t.push({id:a.key,parent:e.key,source_case:a,value:a.values.length})})}});const r=d3.stratify().id(e=>e.id).parentId(e=>e.parent)(t);r.sum(e=>e.value).sort((e,t)=>t.value-e.value),d3.pack().size([this.width/2,this.height/2]).padding(8)(r),r.eachBefore(e=>null!=e.parent?(e.relx=e.x-e.parent.x,e.rely=e.y-e.parent.y):(e.relx=e.x,e.rely=e.y)),r.eachBefore(e=>{if(null!=e.parent&&"root"===e.parent.id)return e.data.d.force.r=e.r}),this.dataFiltered=r,this.updateVis()}updateVis(){var e=this;if(void 0!==e.dataFiltered){let t,a,r,s;console.log(e.dataFiltered);let l,o,n,i=d3.select("#language").node().value;for(e.simulation=d3.forceSimulation().force("collision",d3.forceCollide().radius(e=>e.radius).strength(.01)).force("attract",d3.forceAttract().target(e=>[e.foc_x,e.foc_y]).strength(.5)),t=e.g.selectAll(".bubble").data(e.dataFiltered.descendants()).enter().append("g").each((function(e){e.node=this})).on("mouseover",_(!0)).on("mouseout",_(!1)),a=t.append("circle").attr("class","bubble").attr("r",e=>e.r).on("touchmove mouseover",e=>x(e.id)).attr("fill",e=>e.parent&&"root"!==e.parent.id?w(e.parent.id):"#E8E8E8"),a.append("title").text(e=>"ro"===i?e.data.parent+" - sursa "+e.id+"\n"+e.value+" cazuri":e.data.parent+" - source "+e.id+"\n"+e.value+" cases"),r=e.g.selectAll(".labels").data(e.dataFiltered.leaves()),s=r.enter().append("g").attr("class","labels"),s.append("text").text(e=>e.value).attr("dy","0.35em"),D(1),e.simulation.nodes(e.geoCounties.map(e=>e.force)).stop(),l=o=0,n=Math.ceil(Math.log(e.simulation.alphaMin())/Math.log(1-e.simulation.alphaDecay()));0<=n?o<n:o>n;l=0<=n?++o:--o)e.simulation.tick()}}}let N,G,H,Y,P,J,W,X,Z,Q,q,K,ee,te,ae,re,se,le,oe={nodes:[],links:[]},ne=d3.map(),ie=!1,de=!0,ce=!0,pe=d3.select("#positioning").node().value,ue=d3.select("#language").node().value,fe="ro"===ue?"data/judete_wgs84.json":"../data/judete_wgs84.json";(()=>{let e,t={lines:9,length:4,width:5,radius:12,scale:1,corners:1,color:"#f40000",opacity:.25,rotate:0,direction:1,speed:1,trail:30,fps:20,zIndex:2e9,className:"spinner",shadow:!1,hwaccel:!1,position:"absolute"},a=document.getElementById("spinner");const r=[d3.json(fe),d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")];Promise.all(r).then(r=>{Z=r[0],X=r[1],e=new Spinner(t).spin(a),s(),l(),setTimeout(d(),100)}).catch(e=>console.log(e));const s=()=>{W=X.data.nodes.filter(e=>null!==e.properties.country_of_infection&&"România"!==e.properties.country_of_infection&&"Romania"!==e.properties.country_of_infection),oe.nodes=X.data.nodes,oe.links=X.data.links,ee=Array.from(new Set(oe.nodes.map(e=>e.properties?+e.properties.case_no:""))),oe.nodes=oe.nodes.concat(Array.from(new Set(W.map(e=>e.properties.country_of_infection)),e=>({name:e}))),oe.links=oe.links.concat(W.map(e=>({target:e.name,source:e.properties.country_of_infection}))),Q="judete_wgs84",q=topojson.feature(Z,Z.objects.judete_wgs84).features,K=topojson.feature(Z,{type:"GeometryCollection",geometries:Z.objects.judete_wgs84.geometries}),q.forEach(e=>{let t=e.properties.county;ne.set(t,{lat:e.properties.lat,lon:e.properties.lon}),e.id=t,e.centroid=i.fitSize([o,n],K)([e.properties.lon,e.properties.lat]),e.force={},e.force.x=e.centroid[0],e.force.y=e.centroid[1],e.force.foc_x=e.centroid[0],e.force.foc_y=e.centroid[1]}),oe.nodes=((e,t)=>{let a=d3.timeParse("%d-%m-%Y"),r=[],s=A(e),l=d3.scaleLinear().domain([0,d3.max(Object.values(s))]).range([5,25]);return e.forEach(e=>{void 0!==e.properties?(e.latitude=t.get(e.properties.county)&&t.get(e.properties.county).lat,e.longitude=t.get(e.properties.county)&&t.get(e.properties.county).lon,e.date=a(e.properties.diagnostic_date).getTime(),e.name=+e.name,e.infected_persons=s[e.properties.case_no]+1||1,e.r=l(e.infected_persons)):e.r=3}),e.sort((e,t)=>e.date-t.date),d3.nest().key(e=>e.properties&&e.properties.diagnostic_date).entries(e).forEach(e=>{let t=[...e.values].sort((e,t)=>e.name-t.name),a=t.map(e=>(e.dayOrder=t.indexOf(e)+1,e));r.push(...a)}),r})(oe.nodes,ne)},l=()=>{G=(e=>d3.forceSimulation(e.nodes).force("link",d3.forceLink(e.links).id(e=>e.name)).force("center",d3.forceCenter(o/2,n/2)).force("charge",d3.forceManyBody()).force("x",d3.forceX()).force("y",d3.forceY()).alphaDecay([.02]))(oe),G.on("tick",()=>{C(J,d3.selectAll(".nodes"),d3.selectAll(".links"),d3.selectAll(".node-labels"),pe,H,Y)}),G.force("link").links(oe.links),N=d3.select("#chart").append("svg").attr("class","chart-group").attr("preserveAspectRatio","xMidYMid").attr("width",o).attr("height",n).attr("viewBox","0, 0 "+o+" "+n).on("click",()=>{d3.selectAll(".nodes").style("opacity",1),d3.selectAll(".link").style("opacity",1),d3.selectAll(".node-labels > text").style("opacity","1"),d3.selectAll(".nodes").attr("r",e=>e.r),v.transition().duration(200).style("opacity",0)}),P=N.append("g").attr("class","zoomable-group").style("transform-origin","50% 50% 0"),se=new U(".zoomable-group",q,K),le=new T(".zoomable-group",q,oe.nodes),J=(e=>{let t={};return e.nodes.forEach(e=>t[e.name]=e),t})(oe)},d=()=>{E(O(ue),300,300,"status-legend",(e=>"ro"===e?"Stare":"Status")(ue)),E(w,900,1100,"county-legend",(e=>"ro"===e?"Județ":"County")(ue)),E(I(ue),200,200,"gender-legend",(e=>"ro"===e?"Gen":"Gender")(ue)),E(M,400,400,"age-legend",(e=>"ro"===e?"Vârstă":"Age")(ue)),H=d3.scaleTime().domain(d3.extent(oe.nodes,e=>e.date)).range([0,o]),Y=d3.scaleLinear().domain(d3.extent(oe.nodes,e=>e.dayOrder)).range([n,0]),d3.select("#zoom-in").on("click",()=>N.transition().call($.scaleBy,2)),d3.select("#zoom-out").on("click",()=>N.transition().call($.scaleBy,.5)),d3.select("#reset-zoom").on("click",()=>B()),N.call($),B(),d3.select("#show-map").on("click",()=>((e,t,a,r,s)=>{d3.select("#positioning").attr("value","map"),t.stop(),B(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",1),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)"),j(e.nodes,"map",0,a,r,s)})(oe,G,J,H,Y)),d3.select("#show-map-clusters").on("click",()=>{V(oe,G,J,H,Y),d3.select(".pack-group").attr("transform","scale(1)"),d3.selectAll(".bubble").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)"),d3.selectAll(".labels").attr("transform",e=>e.parent&&e.parent.data.d?`translate(${e.relx+e.parent.data.d.force.x},${e.rely+e.parent.data.d.force.y})`:"translate(-10000,-10000)")}),d3.select("#show-clusters").on("click",()=>{V(oe,G,J,H,Y),d3.selectAll(".land").attr("opacity",.5),d3.select(".pack-group").attr("transform","scale(2)"),d3.selectAll(".bubble").attr("transform",e=>`translate(${e.x},${e.y})`),d3.selectAll(".labels").attr("transform",e=>`translate(${e.x},${e.y})`)}),d3.select("#show-graph").on("click",()=>(e=>{d3.select("#positioning").attr("value","diagram"),e.alpha(1).restart(),setTimeout(()=>{e.stop()},5e3),B(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",0),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)")})(G)),d3.select("#show-arcs").on("click",()=>((e,t,a,r,s)=>{d3.select("#positioning").attr("value","arcs"),t.stop(),B(),d3.selectAll(".nodes-group").style("opacity",1),d3.selectAll(".land").attr("opacity",.25),d3.selectAll(".time-graph").attr("opacity",1),d3.selectAll(".pack-group").attr("transform","translate(-10000,-10000)"),j(e.nodes,"arcs",0,a,r,s)})(oe,G,J,H,Y)),d3.select("#color-counties").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?w(e.properties.county):""),void S("county-legend"))),d3.select("#color-status").on("click",()=>R()),d3.select("#color-gender").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.gender?"var(--main-null)":I("ro")(e.properties.gender):""),void S("gender-legend"))),d3.select("#color-age").on("click",()=>(d3.select("#chart").select("svg").selectAll(".nodes").transition().duration(100).attr("fill",e=>e.is_country_of_infection?"black":e.properties?null===e.properties.age?"var(--main-null)":M(e.properties.age):""),void S("age-legend")));d3.select("#legend-div").classed("hide",!0),d3.select("#toggle-legend").on("click",()=>{!0===ie?(d3.select("#legend-div").classed("hide",!0),ie=!1):(d3.select("#legend-div").classed("hide",!1),ie=!0)}),d3.select("#search-case").on("click",()=>{!0===ce?(d3.select("#search-input").classed("hide",!1),ce=!1):(d3.select("#search-input").classed("hide",!0),ce=!0)}),d3.select("#search-input").on("input",()=>{ee.includes(+(void 0).value)&&x(+(void 0).value)}),d3.select("#show-info").on("click",()=>de=((e,t)=>(!0===e?(v.transition().duration(200).style("opacity",.9),v.html((e=>"ro"===e?"<strong>Relația cazurilor confirmate</strong>.<br/>Date de pe covid19.geo-spatial.org<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/>Dați click în afara cercului pentru a deselecta.":"<strong>Relationship between confirmed cases</strong>.<br/>Data from covid19.geo-spatial.org<br/>The status until the date this information has been officially reported.<br/>Click outside the circle to clear the selection.")(t)).style("left",o/2+"px").style("top",n/2+"px").style("display",null),e=!1):(v.transition().duration(200).style("opacity",0),e=!0),e))(de,ue)),d3.select("#play-cases").on("click",()=>{d3.select("#play-cases").classed("hide",!0),d3.select("#pause-cases").classed("hide",!1),t()}),d3.select("#pause-cases").on("click",()=>{d3.select("#pause-cases").classed("hide",!0),d3.select("#play-cases").classed("hide",!1),a()});const t=()=>{N.call($.scaleTo,.5),re=d3.select("#nRadius").node().value,+re==+ee.length-1&&(re=0),te=setInterval(()=>{ae=ee[re],void 0!==ae?(z(ee,re),re++):re=0},200)},a=()=>{clearInterval(te)};d3.select("#nRadius").on("input",(function(){z(ee,+this.value)})),d3.select("#nRadius").property("max",ee.length-1),z(ee,ee.length-1),((e,t)=>{let a=d3.select("svg").select(".zoomable-group"),r=d3.select("#language").node().value;const s=a.append("g").attr("class","time-graph").attr("opacity",0);s.append("text").attr("y",n+70).attr("x",o/2).attr("font-size","16px").attr("text-anchor","middle").text("ro"===r?"Ziua":"Day");s.append("g").attr("transform",`translate(0,${n})`).call(d3.axisBottom(e).ticks(30).tickFormat(b)).selectAll("text").attr("class","time-graph-x").attr("font-weight","bold").style("text-anchor","end").attr("dx","-.8em").attr("transform","rotate(-65)"),s.append("g").call(d3.axisLeft(t).ticks(10)).selectAll("text").attr("class","time-graph-y").attr("font-weight","bold");s.append("text").attr("transform","rotate(-90)").attr("y",-50).attr("x",-n/2).attr("font-size","20px").attr("text-anchor","middle").text("ro"===r?"Cazuri ordonate pe zi":"Ordered cases per day")})(H,Y),se.setupData(),F(oe,ee),le.setupData(),R(),D(1),setTimeout(()=>{G.stop(),e.stop(),d3.select("tooltip_div").classed("tooltip-abs",!0),d3.select("#CO-"+d3.max(ee)).attr("r",e=>2*e.r).dispatch("mouseover")},5e3)}}).call(void 0)}();
//# sourceMappingURL=bundle.js.map
