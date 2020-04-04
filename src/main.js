import * as Config from './Config';
import * as Tooltip from './Tooltip';
import * as Simulation from './Simulation';
import * as Utils from './Utils';
import * as Layout from './Layout';

let graph = {nodes: [], links: []};
let simulation, links, nodes;
let casesData, geoData;
let positioning = 'diagram';

const promises = [
    d3.json("data/judete_wgs84.json"),
    d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations")
];

Promise.all(promises).then( data => {
    geoData = data[0];
    casesData = data[1];

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

}

const drawGraph = () => {
    const layer = "judete_wgs84";

    const geoCounties = topojson.feature(geoData, geoData.objects[layer]).features;

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

    // Zoom by scroll, pan
    const zoom_actions = () => {
        g.attr("transform", d3.event.transform);
    };
    const zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    // Change colors from status to counties and vice versa
    const counties = Array.from(new Set(graph.nodes
        .filter(d => d.properties)
        .map(d => d.properties && d.properties.county)))
        .sort((a,b) => d3.ascending(a,b));
    const countyColor = d3.scaleOrdinal(Layout.countyColors).domain(counties);

    d3.select("#switch-colors")
        .on("click", function(){
            const button = d3.select(this);
            if (button.text() === "Județe"){
                Layout.coloreazaJudete(countyColor);
                button.text("Stare");
            } else {
                Layout.coloreazaStatus(Layout.statusColor);
                button.text("Județe");
            };
        });

    // Case slider to highlight nodes by id
    // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36
    const cases = Array.from(new Set(graph.nodes.map(d => d.properties ? d.properties.case_no : "")));

    d3.select("#nRadius").property("max", d3.max(cases));
    // updateR the slider
    const updateRadius = (nRadius) => {

        if (cases.includes(nRadius)) {
            // adjust the text on the range slider
            d3.select("#nRadius-value").text(nRadius);
            d3.select("#nRadius").property("value", nRadius);

            // highlight case
            d3.selectAll("circle")
                .attr("r", 5);
            d3.select(".CO-" + nRadius)
                .attr("r", 15)
                .dispatch('mouseover');
        }
    }

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
            .strength(-140)
            .distanceMax(1400))
        .force("center", d3.forceCenter(Config.width / 2, Config.height / 2))
        .force('collision', d3.forceCollide().radius( d =>  d.radius ))
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
    const g = svg.append("g")
        .attr("transform",
        "translate(" + Config.margin.left + "," + Config.margin.top + ")");

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
        .attr("class", d => d.properties && `CO-${d.properties.case_no}`)
        .attr("r", 5)
        .on("touchmove mouseover", d => {
            Tooltip.highlight(d);
            // fade(nodes, links, .2);
        })
        // .on("touchend mouseout", fade(nodes, links, 1))
        ;

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
    svg.append('g')
        .attr('class', 'category-legend');
    Layout.createLegend(Layout.statusColor);

    // Apply zoom handler
    zoom_handler(svg);

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

    const toggle = () => {
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

    d3.select("#toggle-map")
        .on("click", function(){
            const button = d3.select(this);
            if (button.text() === "Hartă"){
                toggle();
                button.text("Rețea");
            } else {
                toggle();
                button.text("Hartă");
            };
        });

};
