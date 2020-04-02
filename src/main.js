import * as Config from './Config';
import * as Tooltip from './Tooltip';
import * as Simulation from './Simulation';
import * as Utils from './Utils';
import * as Layout from './Layout';

let dataset, graph = {nodes: [], links: []};
let simulation, link, node;

d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations").then( data => {

    dataset = data;

    setupGraph();
    setTimeout(drawGraph(), 100);
});

const setupGraph = () => {

    const sources = dataset.data.nodes.filter( d => d.properties.country_of_infection !== null && d.properties.country_of_infection !== "România" && d.properties.country_of_infection !== "Romania");

    // https://observablehq.com/d/cedc594061a988c6
    graph.nodes = dataset.data.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
    graph.links = dataset.data.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

}

const drawGraph = () => {

    // Zoom by scroll, pan
    const zoom_actions = () => {
        g.attr("transform", d3.event.transform);
    }            
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
            var button = d3.select(this);
            if (button.text() === "Colorează județe"){
                Layout.coloreazaJudete(countyColor);
                button.text("Colorează status");
            } else {
                Layout.coloreazaStatus(Layout.statusColor);
                button.text("Colorează județe");
            };
        });

    // Case slider to highlight nodes by id
    // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36
    const cases = Array.from(new Set(graph.nodes.map(d => d.properties ? d.properties.case_no : "")));

    d3.select("#nRadius").property("max", d3.max(cases));
    // updateR the slider
    const updateRadius = (nRadius) => {

        // adjust the text on the range slider
        d3.select("#nRadius-value").text(nRadius);
        d3.select("#nRadius").property("value", nRadius);

        // highlight case
        d3.selectAll("circle")
            .attr("r", 5);
        d3.selectAll(".CO-" + nRadius)
            .attr("r", 10);
    }
    // when the input range changes highlight the circle
    d3.select("#nRadius").on("input", function() {
        updateRadius(+this.value);
    });
    // Select first case
    updateRadius(1);

    // Setup the simulation
    // https://gist.github.com/mbostock/1153292
    simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id( d => {
            let name = JSON.parse(JSON.stringify(d)).name;
            return name;
        }))
        .force("charge", d3.forceManyBody()
            .strength(-140)
            .distanceMax(1400))
        .force("center", d3.forceCenter(Config.width / 2, Config.height / 2))
        .force('collision', d3.forceCollide().radius( d => {
        return d.radius
        }))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaDecay([0.02]);

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
    
    link = g.append("g")
            .attr("class", "link")
            .selectAll("path")
            .data(graph.links)
            .join("path")
                .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
    link.exit().remove();

    node = g.append("g")
        .attr("class", "node")
        .selectAll("g")
        .data(graph.nodes)
        .join("g")
            .call(Simulation.drag(simulation));

    const fade = Utils.setFade(graph.links);
    node.append("circle")
        .attr("class", d => d.properties && `CO-${d.properties.case_no}`)
        .attr("r", 5)
        // .on("touchend mouseenter", d => Tooltip.highlight(d))
        .on("touchmove mouseover", d => { Tooltip.highlight(d);  fade(node, link, .2) })
        .on("touchend mouseout", fade(node, link, 1));

    node.append("text")
        .attr("class", "node-labels")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => {
            return d.is_country_of_infection ? d.country_name : ("#" + d.name);
        })
        .clone(true).lower();
    node.exit().remove();

    simulation.on("tick", () => {
        link.attr("d", Simulation.linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Add the title
    svg.append("text")
        .attr("class", "title")
        .attr("x", (Config.svg_width / 2))
        .attr("y", 20)
        .text("Relația cazurilor confirmate");

    // Color the legend for counties
    Layout.coloreazaStatus();
    svg.append('g')
        .attr('class', 'category-legend');
    Layout.createLegend(Layout.statusColor);

    // Apply zoom handler
    zoom_handler(svg);
};
