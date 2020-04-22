import * as Config from './Config';
import * as Tooltip from './Tooltip';
import * as Simulation from './Simulation';
import * as Utils from './Utils';
import * as Layout from './Layout';

let graph = {nodes: [], links: []};
let simulation, links, nodes;
let casesData, geoData, layer, geoCounties;
let positioning = 'diagram', legendStatus = true, infoStatus = true;

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

    // https://observablehq.com/d/cedc594061a988c6
    graph.nodes = casesData.data.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
    graph.links = casesData.data.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

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
        };
    });
}

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
            Tooltip.tooltip_div.html("<strong>Relația cazurilor confirmate</strong>.<br/><br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.")
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
    Layout.createLegend(Layout.statusColor, 300, 300, "status-legend", "Stare");
    Layout.createLegend(Layout.countyColor, 900, 1100, "county-legend", "Județ");
    Layout.createLegend(Layout.genderColor, 200, 200, "gender-legend", "Gen");
    Layout.createLegend(Layout.ageColor, 400, 400, "age-legend", "Vârstă");

    Layout.showLegend("status-legend");

    // Change colors from status to counties and vice versa
    d3.select("#color-counties")
        .on("click", () => Layout.coloreazaJudete(Layout.countyColor));
    d3.select("#color-status")
        .on("click", () => Layout.coloreazaStatus(Layout.statusColor));
    d3.select("#color-gender")
        .on("click", () => Layout.coloreazaGen(Layout.genderColor));
    d3.select("#color-age")
        .on("click", () => Layout.coloreazaVarsta(Layout.ageColor));

    // Case slider to highlight nodes by id
    // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36
    const cases = Array.from(new Set(graph.nodes.map(d => d.properties ? d.properties.case_no : "")));

    d3.select("#nRadius").property("max", d3.max(cases));
    // update the slider
    const updateRadius = (nRadius) => {
        if (cases.includes(nRadius)) {
            // adjust the text on the range slider
            d3.select("#nRadius-value").text(nRadius);
            d3.select("#nRadius").property("value", nRadius);

            // highlight case
            d3.selectAll("circle")
                .attr("r", 5);
            d3.select("#CO-" + nRadius)
                .attr("r", 15)
                .dispatch('mouseover')
                .dispatch('click');
        }
    }

    const panTo = d => {
        d3.event.stopPropagation();
        g.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(Config.width / 2, Config.height / 2)
                .translate(-d.x, -d.y)
        );
    };

    // when the input range changes highlight the circle
    d3.select("#nRadius").on("input", function() {
        updateRadius(+this.value);
    });
    // Select latest case
    updateRadius(d3.max(cases));

    // Setup the simulation
    // https://gist.github.com/mbostock/1153292

    const ticked = () => {
        update(links, nodes)
    };
    const update = (links, nodes) => {
        links.attr("d", Simulation.linkArc);
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
            .on("click", () => { Tooltip.unHighlight(); });
    const g = svg.append("g");
        // .attr("transform-origin", "50% 50% 0");

    // Add counties map
    const geojsonFeatures = topojson.feature(geoData, {
        type: "GeometryCollection",
        geometries: geoData.objects[layer].geometries
    });

    const thisMapPath = d3.geoPath()
        .projection(
            Config.projection
                  .fitSize([Config.width, Config.height], geojsonFeatures)
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
                .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
    links.exit().remove();

    nodes = g.append("g")
        .attr("class", "node")
        .selectAll("g")
        .data(graph.nodes)
        .join("g")
            .call(Simulation.drag(simulation, positioning));

    const fade = Utils.setFade(graph.links);

    nodes.append("circle")
        .attr("id", d => d.properties && `CO-${d.properties.case_no}`)
        .attr("r", 5)
        .on("touchmove mouseover", d => {
            Tooltip.highlight(d);
            // fade(nodes, links, .2);
        }).on("click", panTo);

    nodes.append("text")
        .attr("class", "node-labels")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => {
            return d.is_country_of_infection ? d.country_name : ("#" + d.name);
        })
        .clone(true).lower();
    nodes.exit().remove();

    // Color the legend for counties
    Layout.coloreazaStatus();

    // Apply zoom handler
    zoom(svg);

    // Toggle map
    // https://bl.ocks.org/cmgiven/4cfa1a95f9b952622280a90138842b79
    const fixed = (immediate) => {
        graph.nodes.forEach(function (d) {
            const pos = Config.projection([d.longitude, d.latitude]);
            d.x = pos[0] || d.x;
            d.y = pos[1] || d.y;
        });

        const t = d3.transition()
            .duration(immediate ? 0 : 800)
            .ease(d3.easeElastic.period(0.5));

        update(links.transition(t), nodes.transition(t));
    };

    const toggleMap = (positioning) => {
        if (positioning === "diagram") {
            positioning = "map";
            map.attr("opacity", 1);
            simulation.stop();
            fixed();
        } else {
            positioning = "diagram";
            map.attr("opacity", 0.25);
            simulation.alpha(1).restart();
        };
        nodes.call(Simulation.drag(simulation, positioning));
    };

    d3.select("#show-map")
        .on("click", () => toggleMap("diagram"));
    d3.select("#show-graph")
        .on("click", () => toggleMap("map"));

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

    g.transition().call(zoom.scaleBy, 0.5);

    setTimeout(function() {
        simulation.stop();
        spinner.stop();
        d3.select("tooltip_div").classed("tooltip-abs", true);
        d3.select("#CO-" + d3.max(cases))
            .attr("r", 15)
            .dispatch('mouseover')
            .dispatch('click');
    }, 5000);
};

}).call(this);