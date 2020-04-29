
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    // set the dimensions and margins of the graph
    const margin = { top: 50, left: 50, bottom: 50, right: 50 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom,
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

    const projection = d3.geoAlbers()
        .center([24.7731, 45.7909])
        .rotate([-14, 3.3, -10])
        .parallels([37, 54])
        .scale(5000);

    const path = d3.geoPath()
        .projection(projection);

    // use a tooltip to show node info
    const tooltip_div = d3.select("body")
       .append("tooltip_div")
       .attr("class", "tooltip")
       .style("opacity", 0)
       .style("display", "none");

    const highlight = (d, idToTargetNodes, cases) => {
        // TODO: slider
        let left = d3.event.pageX -20;
        let top = d3.event.pageY + 20;
     
        if (window.innerWidth - left < 150){
          left = d3.event.pageX - 40;
        }
     
        d3.selectAll("circle")
            .attr("r", 5)
            .style("opacity", 0.3);
        d3.selectAll(".links")
            .style("stroke", "#999")
            .style("opacity", 0.3);
        d3.selectAll(".node-labels")
            .style("opacity", 0.3);

        tooltip_div.transition()
            .duration(200)
            .style("opacity", .9);

        d3.select("#CO-" + d.name)
            .attr("r", 15)
            .style("opacity", 1);
        d3.selectAll(".CO-links-" + d.name)
            .style("stroke", "firebrick")
            .transition()
                .duration(500)
                .attr("stroke-dashoffset", 0)
                .style("opacity", 1)
                .on("end", function(d, i) {
                    if (i === 0)  
                    d3.selectAll("circle")
                        .filter(function(noded) {
                            return idToTargetNodes[d.source.name].includes(noded.name) || +d.source.name === +noded.name})
                        .style("opacity", "1");
                        d3.selectAll(".node-labels")
                        .filter(function(noded) {
                            return idToTargetNodes[d.source.name].includes(noded.name) || +d.source.name === +noded.name})
                        .style("opacity", "1");
                });
        d3.selectAll(".CO-labels-" + d.name)
            .style("color", "firebrick")
            .style("opacity", 1);

        // adjust the text on the range slider
        let name = cases.indexOf(d.name);
        d3.select("#nRadius-value").text(d.name);
        d3.select("#nRadius").property("value", name);

        tooltip_div.html(tooltipHTML(d))
            .style("left", left + 'px')
            .style("top", top + 'px')
            .style("display", null);
    };

    const tooltipHTML = (d) => {
        if (d.properties !== undefined) {
            return "<b>Cazul " + d.properties.case_no + "</b><br />" +
            (d.properties.gender === 'Bărbat'
                    ? "Bărbat"
                    : (d.properties.gender === 'Femeie'
                        ? "Femeie"
                        : "Gen nespecificat")) +
            (d.properties.age != null && d.properties.age != 0 ? (", " + d.properties.age) : "") +
            (d.properties.county != null && d.properties.county != "" ? (", din  " + d.properties.county) : "") + ".<br />" +
            (d.properties.status != null
                ? ("Status: " + (d.properties.status === "Vindecat"
                        ? "vindecat"
                        : (d.properties.status === "Confirmat"
                            ? "confirmat"
                            : "deces")) + ".<br />")
                : "") +
            (d.properties.diagnostic_date !== null ? ("Data confirmării: " + d.properties.diagnostic_date + ".<br />") : "") +
            (d.properties.healing_date !== null ? ("Data recuperării: " + d.properties.healing_date + ".<br />") : "") +
            (d.properties.reference !== null && d.properties.reference !== "" ? ("Detalii: " + '<a href="' + d.properties.reference + '" target= "_blank">aici</a>') : "");
        } else {
            return d.name;
        }};

    const unHighlight = () => {
        d3.selectAll("circle")
            .attr("r", 5);
        d3.selectAll("circle")
            .style("opacity", 1);
        d3.selectAll(".link")
            .style("opacity", 1);
        tooltip_div.transition()
            .duration(200)
            .style("opacity", 0);
    };

    // simulation drag
    const drag = (simulation, positioning) => {
        const dragstarted = d => {
            if (positioning !== 'diagram') { return }        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = d => {
            if (positioning !== 'diagram') { return }        d.fx = d3.event.x;
            d.fy = d3.event.y;
        };

        const dragended = d => {
            if (positioning !== 'diagram') { return }        if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };

    // simulation link
    const linkArc = (d) => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
    };

    const statusColor = d3.scaleOrdinal(["var(--main-confirmate)", "var(--main-recuperari)", "var(--main-decese)"]).domain(["Confirmat", "Vindecat", "Decedat"]);

    // https://medialab.github.io/iwanthue/
    // hcl[0]>=0 && hcl[0]<=340
    //     && hcl[1]>=30 && hcl[1]<=80
    //     && hcl[2]>=35 && hcl[2]<=100
    const countyColors = [
        "#e4588c", "#35d394", "#ba1ea8", "#4caf1c", "#1848ca", "#aad42b", "#9b85ff", "#068400", "#8b2487", "#97ff8b", "#d60042", "#00ae87", "#f94740", "#48d3ff", "#d17300", "#5ea2ff", "#cfb100", "#53498f", "#ffe353", "#325383", "#86a700", "#ff9eeb", "#007f30", "#d9b6ff", "#3b5c12", "#89c2ff", "#964000", "#00bfbb", "#ff6f54", "#01aac6", "#ffb65d", "#008857", "#ff8e90", "#145f36", "#952e31", "#fffea6", "#8e3440", "#5a936f", "#883d0c", "#ffaf81", "#34a6c2", "#b09764", "#458a18"
    ];
    const counties = [
        "ALBA", "ARAD", "ARGEȘ", "BACĂU", "BIHOR", "BISTRIȚA-NĂSĂUD", "BOTOȘANI", "BRAȘOV", "BRĂILA", "BUCUREȘTI", "BUZĂU", "CARAȘ-SEVERIN", "CLUJ", "CONSTANȚA", "COVASNA", "CĂLĂRAȘI", "DOLJ", "DÂMBOVIȚA", "GALAȚI", "GIURGIU", "GORJ", "HARGHITA", "HUNEDOARA", "IALOMIȚA", "IAȘI", "ILFOV", "NECUNOSCUT", "MARAMUREȘ", "MEHEDINȚI", "MUREȘ", "NEAMȚ", "OLT", "PRAHOVA", "SATU MARE", "SIBIU", "SUCEAVA", "SĂLAJ", "TELEORMAN", "TIMIȘ", "TULCEA", "VASLUI", "VRANCEA", "VÂLCEA"
    ];
    const countyColor = d3.scaleOrdinal(countyColors).domain(counties);

    const genderColor = d3.scaleOrdinal(["var(--main-barbat)", "var(--main-femeie)"]).domain(["Bărbat", "Femeie"]);

    const ageColor = d3.scaleQuantile()
        .domain([0, 100])
        .range(d3.schemeSpectral[10]);

    const coloreazaStatus = () => {
        let svg = d3.select("#chart").select('svg');

        svg.selectAll('circle')
            .transition().duration(100)
            .attr("fill", d => {
                return (d.is_country_of_infection)
                    ? "black"
                    : d.properties ? statusColor(d.properties.status) : ""
            });

        showLegend('status-legend');
    };

    const coloreazaJudete = (countyColor) => {
        let svg = d3.select("#chart").select('svg');

        svg.selectAll('circle')
            .transition().duration(100)
            .attr("fill", d => {
                return (d.is_country_of_infection)
                    ? "black"
                    : d.properties ? countyColor(d.properties.county) : ""
            });

        showLegend('county-legend');
    };

    const coloreazaGen = (genderColor) => {
        let svg = d3.select("#chart").select('svg');

        svg.selectAll('circle')
            .transition().duration(100)
            .attr("fill", d => {
                return (d.is_country_of_infection)
                    ? "black"
                    : d.properties
                        ? d.properties.gender === null
                            ? "var(--main-null)"
                            : genderColor(d.properties.gender)
                        : ""
            });

        showLegend('gender-legend');
    };

    const coloreazaVarsta = (ageColor) => {
        let svg = d3.select("#chart").select('svg');

        svg.selectAll('circle')
            .transition().duration(100)
            .attr("fill", d => {
                return (d.is_country_of_infection)
                    ? "black"
                    : d.properties
                        ? d.properties.age === null
                            ? "var(--main-null)"
                            : ageColor(d.properties.age)
                        : ""
            });

        showLegend('age-legend');
    };

    const createLegend = (colorScale, height, vbHeight, legendClass, legendTitle) => {

        const legend = d3.select("#legend-div")
            .append("div")
                .attr('class', legendClass)
            .append("svg")
                .attr('class', "category-legend")
                .attr("width", 110)
                .attr("height", height)
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", '-10, -10 ' + 120 + ' ' + vbHeight)
                .attr("x", 0)
                .attr("y", 0);

        const categoryLegend = d3.legendColor()
                                .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                                .shapePadding(10)
                                .title(legendTitle)
                                .titleWidth(100)
                                .labelFormat(d3.format(".0f"))
                                .labelAlign("start")
                                .scale(colorScale);

        legend.call(categoryLegend);
    };

    const showLegend = category => {
        d3.select(".county-legend").classed("hide", true);
        d3.select(".status-legend").classed("hide", true);
        d3.select(".gender-legend").classed("hide", true);
        d3.select(".age-legend").classed("hide", true);

        if (category === 'county-legend') {
            d3.select(".county-legend").classed("hide", false);
        } else if (category === 'status-legend') {
            d3.select(".status-legend").classed("hide", false);
        } else if (category === 'gender-legend') {
            d3.select(".gender-legend").classed("hide", false);
        } else if (category === 'age-legend') {
            d3.select(".age-legend").classed("hide", false);
        }
    };

    let graph = {nodes: [], links: []};
    let simulation, links, nodes;
    let casesData, geoData, layer, geoCounties;
    let positioning = 'diagram', legendStatus = true, infoStatus = true, searchStatus = true;
    let idToNodeFnc, idToNode, idToTargetNodesFnc, idToTargetNodes;
    let parseTime = d3.timeParse("%d-%m-%Y");
    let formattedData = [];

    // const hash = window.top.location.hash.substr(1);


    const locale = d3.timeFormatLocale({
        "dateTime": "%A, %e %B %Y г. %X",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"],
        "shortDays": ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"],
        "months": ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
        "shortMonths": ["Ian", "Feb", "Mart", "Apr", "Mai", "Iun", "Iul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    });

    const formatMillisecond = locale.format(".%L"),
        formatSecond = locale.format(":%S"),
        formatMinute = locale.format("%I:%M"),
        formatHour = locale.format("%I %p"),
        formatDay = locale.format("%a %d"),
        formatWeek = locale.format("%b %d"),
        formatMonth = locale.format("%B"),
        formatYear = locale.format("%Y");

    function multiFormat(date) {
        return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
    }

    (() => {

    // Spinner
    // options for loading spinner
    let opts = {
            lines: 9,
            length: 4,
            width: 5,
            radius: 12,
            scale: 1,
            corners: 1,
            color: '#f40000',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 30,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            shadow: false,
            hwaccel: false,
            position: 'absolute',
        },
        target = document.getElementById('spinner'),
        spinner;

    const promises = [
        d3.json("data/judete_wgs84.json"),
        d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")
    ];

    Promise.all(promises).then( data => {
        geoData = data[0];
        casesData = data[1];

        spinner = new Spinner(opts).spin(target);
        setupGraph();
        setTimeout(drawGraph(), 100);
    }).catch(
        error => console.log(error)
    );

    const setupGraph = () => {

        const sources = casesData.data.nodes.filter( d => d.properties.country_of_infection !== null && d.properties.country_of_infection !== "România" && d.properties.country_of_infection !== "Romania");

        graph.nodes = casesData.data.nodes;
        graph.links = casesData.data.links;

        idToNodeFnc = () => {
            let dict = {};
            graph.nodes.forEach(function(n) {
                dict[n.name] = n;
            });
            return dict;
        };
        idToTargetNodesFnc = () => {
            let dict = {};
            graph.nodes.forEach(function (n) {
                dict[n.name] = [];
                graph.links.forEach(function (l) {
                    if (l.source === n.name) {
                        dict[n.name].push(l.target);
                    }
                });
            });
            return dict;
        };
        idToNode = idToNodeFnc();
        idToTargetNodes = idToTargetNodesFnc();

        // https://observablehq.com/d/cedc594061a988c6
        // graph.nodes = graph.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
        // graph.links = graph.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

        layer = "judete_wgs84";
        geoCounties = topojson.feature(geoData, geoData.objects[layer]).features;

        let countiesCentroids = d3.map();
        geoCounties.forEach( d => {
            let county = d.properties.county;
            countiesCentroids.set(county, {
                lat: d.properties.lat,
                lon: d.properties.lon,
            });
        });

        graph.nodes.forEach( d => {
            if (d.properties !== undefined) {
                d.latitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lat;
                d.longitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lon;
                d.date = parseTime(d.properties.diagnostic_date).getTime();
                d.name = +d.name;
            }    });
        graph.nodes.sort((a,b) => a.date - b.date);

        var ed_data = d3.nest()
            .key(function(d) { return d.properties.diagnostic_date; })
            // .key(function(d) { return d.properties.county; })
            // .rollup(function(v) { return v.length; })
            .entries(graph.nodes);
        ed_data.forEach(function(key){
            let valuesArr = [...key["values"] ].sort((a,b) => a.name - b.name);
            let valuesPerDay = valuesArr.map(function(d){
                    d.dayOrder = valuesArr.indexOf(d) + 1;
                    return d;
                });
            formattedData.push(...valuesPerDay);
        });

        graph.nodes = formattedData;

    };

    const drawGraph = () => {
        // Zoom by scroll, pan
        const zoomed = () => {
            g.attr("transform", d3.event.transform);
        };

        const zoom = d3.zoom()
          .scaleExtent([0.2, 10])
          .on("zoom", zoomed);

        const resetZoom = () => {
            g.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(g.node()).invert([svg_width / 2, svg_height / 2])
            );
        };

        d3.select("#zoom-in").on("click", () => g.transition().call(zoom.scaleBy, 2));
        d3.select("#zoom-out").on("click", () => g.transition().call(zoom.scaleBy, 0.5));
        d3.select("#reset-zoom").on("click", () => resetZoom());

        // Info
        d3.select("#show-info").on("click", () => showInfo());

        const showInfo = () => {
            if (infoStatus === true) {
                tooltip_div.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip_div.html("<strong>Relația cazurilor confirmate</strong>.<br/><br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.")
                    .style("left", svg_width / 2 + 'px')
                    .style("top", svg_height / 2 + 'px')
                    .style("display", null);
                infoStatus = false;
            } else {
                tooltip_div.transition()
                    .duration(200)
                    .style("opacity", 0);
                infoStatus = true;
            }
        };

        // Add legends
        createLegend(statusColor, 300, 300, "status-legend", "Stare");
        createLegend(countyColor, 900, 1100, "county-legend", "Județ");
        createLegend(genderColor, 200, 200, "gender-legend", "Gen");
        createLegend(ageColor, 400, 400, "age-legend", "Vârstă");

        showLegend("status-legend");

        // Change colors from status to counties and vice versa
        d3.select("#color-counties")
            .on("click", () => coloreazaJudete(countyColor));
        d3.select("#color-status")
            .on("click", () => coloreazaStatus());
        d3.select("#color-gender")
            .on("click", () => coloreazaGen(genderColor));
        d3.select("#color-age")
            .on("click", () => coloreazaVarsta(ageColor));

        const panTo = d => {
            d3.event.stopPropagation();
            g.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .translate(-d.x, -d.y)
            );
        };

        // Setup the simulation
        // https://gist.github.com/mbostock/1153292

        const ticked = () => {
            update(links, nodes, positioning);
        };

        const xScale = d3.scaleTime()
            .domain(d3.extent(graph.nodes, function(d) { return d.date; }))
            .range([0, svg_width]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(graph.nodes, function(d) { return d.dayOrder; }))
            .range([svg_height, 0]);

        const update = (links, nodes, positioning) => {
            links.attr("d", d => {
                if (positioning === 'arcs') {
                    yScale(d.dayOrder);

                    let start = xScale(idToNode[d.source.name].date);
                    let end = xScale(idToNode[d.target.name].date);
                    const arcPath = ['M', start, yScale(idToNode[d.source.name].dayOrder), 'A', (start - end)/2, ',', (start-end)/2, 0,0,",",
                                start < end ? 1: 0, end, yScale(idToNode[d.target.name].dayOrder)].join(' ');
                    return arcPath;
                } else {
                    return linkArc(d)
                }
            });
            nodes.attr("transform", d => `translate(${d.x},${d.y})`);
        };

        simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id( d => {
                let name = JSON.parse(JSON.stringify(d)).name;
                return name;
            }))
            .force("charge", d3.forceManyBody()
                .strength(-100)
                .distanceMax(1000))
            .force("center", d3.forceCenter(width / 2, height / 2))
            // .force('collision', d3.forceCollide().radius( d =>  d.radius ))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .alphaDecay([0.02]);
            // .stop();

        simulation.on('tick', ticked);
        simulation.force('link').links(graph.links);
        // Append the svg object to the chart div, and a group for nodes and links
        const svg = d3.select("#chart")
            .append("svg")
                .attr("class", "chart-group")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .attr("viewBox", '0, 0 ' + svg_width + ' ' + svg_height)
                .on("click", () => { unHighlight(); });
        const g = svg.append("g");
            // .attr("transform-origin", "50% 50% 0");

        const timeGraph = g.append("g")
            .attr("class", "time-graph")
            .attr("opacity", 0);

        const xLabel = timeGraph.append("text")
            .attr("y", svg_height + 70)
            .attr("x", svg_width / 2)
            .attr("font-size", "16px")
            .attr("text-anchor", "middle")
            .text("Ziua");
        const xAxis = timeGraph.append("g")
            .attr("transform", "translate(0," + (svg_height) + ")")
            .call(d3.axisBottom(xScale)
                .ticks(20)
                .tickFormat(multiFormat));
        xAxis.selectAll('text')
            .attr("font-weight", "bold")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("transform", "rotate(-65)");
        const yAxis = timeGraph.append("g")
            .call(d3.axisLeft(yScale)
                .ticks(10));
        yAxis.selectAll('text').attr("font-weight", "bold");
        const yLabel = timeGraph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -200)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Ordonarea pe zi");

        // Add counties map
        const geojsonFeatures = topojson.feature(geoData, {
            type: "GeometryCollection",
            geometries: geoData.objects[layer].geometries
        });

        const thisMapPath = d3.geoPath()
            .projection(
                projection
                      .fitSize([svg_width, svg_height], geojsonFeatures)
                      );

        const map = g.append("g")
            .attr("class", "map-features")
            .selectAll("path")
                .data(geoCounties)
                .enter()
                .append("path")
                .attr("d", thisMapPath)
                    .attr("class", "land")
                    .attr("opacity", 0.25);

        // Add arrows for links
        const markerTypes = Array.from(new Set(graph.nodes.map(d => d.source)));
        g.append("defs").selectAll("marker")
            .data(markerTypes)
                .join("marker")
                    .attr("id", d => `arrow-${d}`)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15)
                    .attr("refY", -0.5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                .append("path")
                    .attr("fill", "#999")
                    .attr("d", "M0,-5L10,0L0,5");
        
        links = g.append("g")
                .attr("class", "link")
                .selectAll("path")
                .data(graph.links)
                .join("path")
                    .attr("class", d => `CO-links-${d.source.name}`)
                    .classed("links", true)
                    .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
        links.exit().remove();

        nodes = g.append("g")
            .attr("class", "node")
            .selectAll("g")
            .data(graph.nodes)
            .join("g")
                .call(drag(simulation, positioning));

        nodes.append("circle")
            .attr("id", d => d.properties && `CO-${d.properties.case_no}`)
            .attr("r", 5)
            .on("touchmove mouseover", function(d) {
                highlight(d, idToTargetNodes, cases);
            })
            .on("touchend mouseout", d => {
                // d3.selectAll("circle")
                //     .style("opacity", 1);
                // d3.selectAll(".link")
                //     .style("opacity", 1);
            })
            .on("click", panTo);

        nodes.append("text")
            .attr("class", d => `CO-labels-${d.name}`)
            .classed("node-labels", true)
            .attr("x", 8)
            .attr("y", "0.31em")
            .text(d => {
                return d.is_country_of_infection ? d.country_name : ("#" + d.name);
            })
            .clone(true).lower();
        nodes.exit().remove();

        // links.on("touchmove mouseover", function(d) {
        //         d3.select(this)
        //             .style("stroke", "firebrick");
        //         d3.select("#CO-" + d.source.name)
        //             .dispatch('mouseover');
        //         // d3.selectAll("text")
        //         //     .attr("opacity", 0)
        //     })
        //     .on("touchend mouseout", function(d) {
        //     });

        // Color the legend for counties
        coloreazaStatus();

        // Apply zoom handler
        zoom(svg);

        // Toggle map
        const fixed = (positioning, immediate) => {
            if (positioning === "map") {
                graph.nodes.forEach(function (d) {
                    const pos = projection([d.longitude, d.latitude]);
                    d.x = pos[0] || d.x;
                    d.y = pos[1] || d.y;
                });
            } else {
                graph.nodes.forEach(function (d) {
                    d.x = xScale(d.date);
                    d.y = yScale(d.dayOrder);
                });
            }

            const t = d3.transition()
                .duration(immediate ? 0 : 800)
                .ease(d3.easeElastic.period(0.5));

            update(links.transition(t), nodes.transition(t), positioning);
        };
        const showMap = () => {
            positioning = "map";
            map.attr("opacity", 1);
            timeGraph.attr("opacity", 0);
            simulation.stop();
            fixed(positioning, 0);

            nodes.call(drag(simulation, positioning));
        };
        const showGraph = () => {
            positioning = "diagram";
            map.attr("opacity", 0.25);
            timeGraph.attr("opacity", 0);
            simulation.alpha(1).restart();

            nodes.call(drag(simulation, positioning));
        };
        const showArcs = () => {
            positioning = "arcs";
            map.attr("opacity", 0);
            timeGraph.attr("opacity", 1);
            simulation.stop();
            // d3.selectAll("circle")
            //     .attr("r", 1);
            fixed(positioning, 0);

            nodes.call(drag(simulation, positioning));
        };

        d3.select("#show-map")
            .on("click", () => showMap());
        d3.select("#show-graph")
            .on("click", () => showGraph());
        d3.select("#show-arcs")
            .on("click", () => showArcs());

        const toggleLegend = () => {
            if (legendStatus === true) {
                d3.select("#legend-div").classed("hide", true);
                legendStatus = false;
            } else {
                d3.select("#legend-div").classed("hide", false);
                legendStatus = true;
            }    };
        d3.select("#legend-div").classed("hide", false);
        d3.select("#toggle-legend")
            .on("click", () => toggleLegend());

        const searchByCaseId = (caseId) => {
            if (cases.includes(caseId)) {
                // highlight case
                d3.selectAll("circle")
                    .attr("r", 5);
                d3.select("#CO-" + caseId)
                    .attr("r", 15)
                    .dispatch('mouseover')
                    .dispatch('click');
            }
        };

        d3.select("#search-case")
            .on("click", () => {
                if (searchStatus === true) {
                    d3.select("#search-input").classed("hide", false);
                    searchStatus = false;
                } else {
                    d3.select("#search-input").classed("hide", true);
                    searchStatus = true;
                }        });
        d3.select("#search-input")
            .on("input", function() {
                searchByCaseId(+this.value);
            });

        g.transition().call(zoom.scaleBy, 0.5);

        d3.select("#play-cases")
            .on("click", () => {
                d3.select("#play-cases").classed("hide", true);
                d3.select("#pause-cases").classed("hide", false);
                playCases();
            });
        d3.select("#pause-cases")
            .on("click", () => {
                d3.select("#pause-cases").classed("hide", true);
                d3.select("#play-cases").classed("hide",false);
                pauseCases();
            });

        let playCasesNow;
        const cases = Array.from(new Set(graph.nodes.map(d => d.properties ? +d.properties.case_no : "")));
        let thisCaseId;
        let thisCaseOrder;

        // Case slider to highlight nodes by id
        // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36

        // when the input range changes highlight the circle
        d3.select("#nRadius").on("input", function() {
            updateRadius(+this.value);
        });
        d3.select("#nRadius").property("max", cases.length-1);
        // update the slider
        const updateRadius = (nRadius) => {
            // adjust the text on the range slider
            d3.select("#nRadius-value").text(cases[nRadius]);
            d3.select("#nRadius").property("value", cases[nRadius]);
            d3.select("#search-input").property("value", cases[nRadius]);

            // highlight case
            d3.selectAll("circle")
                .attr("r", 5);
            d3.select("#CO-" + cases[nRadius])
                .attr("r", 15)
                .dispatch('mouseover');
                // .dispatch('click');
        };
        // Select latest case
        updateRadius(cases.length-1);

        const playCases = () => {
            g.transition().call(zoom.scaleBy, 1);
            thisCaseOrder = d3.select("#nRadius").node().value;
            if (+thisCaseOrder === (+cases.length - 1)) thisCaseOrder = 0;

            playCasesNow = setInterval(function() {
                thisCaseId = cases[thisCaseOrder];
                if (thisCaseId !== undefined) {
                    updateRadius(thisCaseOrder);
                    thisCaseOrder++;
                } else {
                    clearInterval(playCasesNow);
                }
            }, 200);
        };
        const pauseCases = () => {
            clearInterval(playCasesNow);
        };

        d3.select(".slider")
            .attr("transform", "translate(0," + (svg_height) + ")");

        // // shortcut to graphs
        // if (hash !== undefined) {
        //     if (hash === "map") {
        //         d3.select("#show-map").dispatch("click");
        //     } else if (hash === "graph") {
        //         d3.select("#show-graph").dispatch("click");
        //     } else if (hash === "arcs") {
        //         d3.select("#show-arcs").dispatch("click");
        //     }
        // }

        setTimeout(function() {
            simulation.stop();
            spinner.stop();
            d3.select("tooltip_div").classed("tooltip-abs", true);
            d3.select("#CO-" + d3.max(cases))
                .attr("r", 15)
                .dispatch('mouseover');
                // .dispatch('click');
        }, 5000);
    };

    }).call(undefined);

}());
//# sourceMappingURL=bundle.js.map
