import * as Config from './Config';
import * as Tooltip from './Tooltip';
import * as Simulation from './Simulation';
import * as Layout from './Layout';
import * as Translate from './Translate';

let graph = {nodes: [], links: []};
let simulation, links, nodes;
let casesData, geoData, layer, geoCounties;
let positioning = 'diagram', legendStatus = true, infoStatus = true, searchStatus = true;
let idToNodeFnc, idToNode, idToTargetNodesFnc, idToTargetNodes;
let parseTime = d3.timeParse("%d-%m-%Y");
let formattedData = [];
let cases;
let language;
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

    cases = Array.from(new Set(graph.nodes.map(d => d.properties ? +d.properties.case_no : "")));

    // https://observablehq.com/d/cedc594061a988c6
    graph.nodes = graph.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
    graph.links = graph.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

    idToNodeFnc = () => {
        let dict = {};
        graph.nodes.forEach(function(n) {
            dict[n.name] = n;
        });
        return dict;
    }
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
    }
    idToNode = idToNodeFnc();
    idToTargetNodes = idToTargetNodesFnc();

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
        };
    });
    graph.nodes.sort((a,b) => a.date - b.date);

    var ed_data = d3.nest()
        .key(function(d) {
            return d.properties && d.properties.diagnostic_date;
        })
        // .key(function(d) { return d.properties.county; })
        // .rollup(function(v) { return v.length; })
        .entries(graph.nodes);
    ed_data.forEach(function(key){
        let valuesArr = [...key["values"] ].sort((a,b) => a.name - b.name);
        let valuesPerDay = valuesArr.map(function(d){
                d.dayOrder = valuesArr.indexOf(d) + 1;
                return d;
            });
        formattedData.push(...valuesPerDay)
    });

    graph.nodes = formattedData;
}

const drawGraph = () => {
    language = d3.select("#language").node().value;

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
            d3.zoomTransform(g.node()).invert([Config.svg_width / 2, Config.svg_height / 2])
        );
    };

    d3.select("#zoom-in").on("click", () => g.transition().call(zoom.scaleBy, 2));
    d3.select("#zoom-out").on("click", () => g.transition().call(zoom.scaleBy, 0.5));
    d3.select("#reset-zoom").on("click", () => resetZoom());

    // Info
    d3.select("#show-info").on("click", () => showInfo());

    const showInfo = () => {
        if (infoStatus === true) {
            Tooltip.tooltip_div.transition()
                .duration(200)
                .style("opacity", .9);
            Tooltip.tooltip_div.html(Translate.infoHtml(language))
                .style("left", Config.svg_width / 2 + 'px')
                .style("top", Config.svg_height / 2 + 'px')
                .style("display", null);
            infoStatus = false;
        } else {
            Tooltip.tooltip_div.transition()
                .duration(200)
                .style("opacity", 0);
            infoStatus = true;
        }
    }

    // Add legends
    Layout.createLegend(Layout.statusColor(language), 300, 300, "status-legend", Translate.status(language));
    Layout.createLegend(Layout.countyColor, 900, 1100, "county-legend", Translate.county(language));
    Layout.createLegend(Layout.genderColor(language), 200, 200, "gender-legend", Translate.gender(language));
    Layout.createLegend(Layout.ageColor, 400, 400, "age-legend", Translate.age(language));

    Layout.showLegend("status-legend");

    // Change colors from status to counties and vice versa
    d3.select("#color-counties")
        .on("click", () => Layout.coloreazaJudete());
    d3.select("#color-status")
        .on("click", () => Layout.coloreazaStatus());
    d3.select("#color-gender")
        .on("click", () => Layout.coloreazaGen());
    d3.select("#color-age")
        .on("click", () => Layout.coloreazaVarsta());

    const panTo = d => {
        d3.event.stopPropagation();
        g.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(Config.width / 2, Config.height / 2)
                .translate(-d.x, -d.y)
        );
    };

    // Setup the simulation
    // https://gist.github.com/mbostock/1153292

    const ticked = () => {
        update(links, nodes, positioning)
    };

    const xScale = d3.scaleTime()
        .domain(d3.extent(graph.nodes, function(d) { return d.date; }))
        .range([0, Config.svg_width]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(graph.nodes, function(d) { return d.dayOrder; }))
        .range([Config.svg_height, 0]);

    const update = (links, nodes, positioning) => {
        links.attr("d", d => {
            if (positioning === 'arcs') {
                if (typeof(d.source.name) === "string") {
                    return Simulation.linkArc(d)
                } else {
                    let start = xScale(idToNode[d.source.name].date) || 0;
                    let end = xScale(idToNode[d.target.name].date);
                    const arcPath = ['M', start, yScale(idToNode[d.source.name].dayOrder), 'A', (start - end)/2, ',', (start-end)/2, 0,0,",",
                                start < end ? 1: 0, end, yScale(idToNode[d.target.name].dayOrder)].join(' ');
                    return arcPath;
                }
            } else {
                return Simulation.linkArc(d)
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
            // .strength(-50)
            // .distanceMax(1000)
            )
        .force("center", d3.forceCenter(Config.width / 2, Config.height / 2))
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
            .attr("width", Config.svg_width)
            .attr("height", Config.svg_height)
            .attr("viewBox", '0, 0 ' + Config.svg_width + ' ' + Config.svg_height)
            .on("click", () => { Tooltip.unHighlight(); Tooltip.hideTooltip(); });
    const g = svg.append("g");
        // .attr("transform-origin", "50% 50% 0");

    const timeGraph = g.append("g")
        .attr("class", "time-graph")
        .attr("opacity", 0);

    const xLabel = timeGraph.append("text")
        .attr("y", Config.svg_height + 70)
        .attr("x", Config.svg_width / 2)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .text("Ziua");
    const xAxis = timeGraph.append("g")
        .attr("transform", "translate(0," + (Config.svg_height) + ")")
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
        .attr("x", -Config.svg_height / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Cazuri pe zi")

    // Add counties map
    const geojsonFeatures = topojson.feature(geoData, {
        type: "GeometryCollection",
        geometries: geoData.objects[layer].geometries
    });

    const thisMapPath = d3.geoPath()
        .projection(
            Config.projection
                  .fitSize([Config.svg_width, Config.svg_height], geojsonFeatures)
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
            .call(Simulation.drag(simulation, positioning));

    nodes.append("circle")
        .attr("id", d => d.properties && `CO-${d.properties.case_no}`)
        .attr("r", 5)
        .on("touchmove mouseover", function(d) {
            Tooltip.highlight(d, idToTargetNodes, cases);
        })
        .on("touchend mouseout", d => {
            // Tooltip.unHighlight();
        })
        .on("click", panTo);

    nodes.append("text")
        .attr("class", d => `CO-labels-${d.name}`)
        .classed("node-labels", true)
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => typeof(d.name) === "string" ? d.name : "")
        .clone(true).lower();
    nodes.exit().remove();

    // Color the legend for counties
    Layout.coloreazaStatus();

    // Apply zoom handler
    zoom(svg);

    // Toggle map
    const fixed = (positioning, immediate) => {
        if (positioning === "map") {
            graph.nodes.forEach(function (d) {
                const pos = Config.projection([d.longitude, d.latitude]);
                d.x = pos[0] || d.x;
                d.y = pos[1] || d.y;
            });
        } else {
            graph.nodes.forEach(function (d) {
                d.x = xScale(d.date) || -100;
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

        nodes.call(Simulation.drag(simulation, positioning));
    };
    const showGraph = () => {
        positioning = "diagram";
        map.attr("opacity", 0.25);
        timeGraph.attr("opacity", 0);
        simulation.alpha(1).restart();

        nodes.call(Simulation.drag(simulation, positioning));
    };
    const showArcs = () => {
        positioning = "arcs";
        map.attr("opacity", 0);
        timeGraph.attr("opacity", 1);
        simulation.stop();
        fixed(positioning, 0);

        nodes.call(Simulation.drag(simulation, positioning));
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
        };
    };
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
    }

    d3.select("#search-case")
        .on("click", () => {
            if (searchStatus === true) {
                d3.select("#search-input").classed("hide", false);
                searchStatus = false;
            } else {
                d3.select("#search-input").classed("hide", true);
                searchStatus = true;
            };
        });
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
    const clonedCases = [...cases];
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
    }
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
                thisCaseOrder = 0;
            }
        }, 200);
    };
    const pauseCases = () => {
        clearInterval(playCasesNow);
    };

    d3.select(".slider")
        .attr("transform", "translate(0," + (Config.svg_height) + ")");

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
        // setTimeout(function() {
        //     Tooltip.unHighlight();
        // }, 10000);
    }, 5000);
};

}).call(this);