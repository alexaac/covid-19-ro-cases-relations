import * as Config from './Config';
import * as Data from './Data';
import * as Tooltip from './Tooltip';
import * as Simulation from './Simulation';
import * as Draw from './Draw';
import * as Language from './Language';
import * as Layout from './Layout';

import MapChart from './models/MapChart';
import PackChart from './models/PackChart';

let graph = {nodes: [], links: []};
let svg, simulation, xScale, yScale, zoomableGroup, idToNode;
let sources, casesData, geoData, layer, geoCounties, geojsonFeatures;
let cases;
let countiesCentroids = d3.map();

let legendStatus = false, infoStatus = true, searchStatus = true;
let playCasesNow, thisCaseId, thisCaseOrder;

let positioning = d3.select('#positioning').node().value;

// Switch the language to english/romanian
let language = d3.select('#language').node().value;
let countiesSource = language === 'ro' ? 'data/judete_wgs84.json' : '../data/judete_wgs84.json';

let mapChart, packChart;

(() => {

// Options for loading spinner
let opts = {lines: 9, length: 4, width: 5, radius: 12, scale: 1, corners: 1, color: '#f40000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 30, fps: 20, zIndex: 2e9, className: 'spinner', shadow: false, hwaccel: false, position: 'absolute'},
    target = document.getElementById('spinner'),
    spinner;

// Load data
const promises = [
    d3.json(countiesSource),
    d3.json('https://covid19.geo-spatial.org/api/statistics/getCaseRelations')
];

Promise.all(promises).then( data => {
    geoData = data[0];
    casesData = data[1];

    spinner = new Spinner(opts).spin(target);
    setupGraph();
    drawGraph();
    setTimeout(setActions(), 100);
}).catch(
    error => console.log(error)
);

const setupGraph = () => {

    sources = casesData.data.nodes.filter( d => d.properties.country_of_infection !== null && d.properties.country_of_infection !== 'România' && d.properties.country_of_infection !== 'Romania');

    graph.nodes = casesData.data.nodes;
    graph.links = casesData.data.links;

    cases = Array.from(new Set(graph.nodes.map(d => d.properties ? +d.properties.case_no : '')));

    // https://observablehq.com/d/cedc594061a988c6
    graph.nodes = graph.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
    graph.links = graph.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

    layer = 'judete_wgs84';
    geoCounties = topojson.feature(geoData, geoData.objects[layer]).features;
    geojsonFeatures = topojson.feature(geoData, {
        type: 'GeometryCollection',
        geometries: geoData.objects[layer].geometries
    });

    geoCounties.forEach( d => {
        let county = d.properties.county;
        // Get lat, lon for nodes within county
        countiesCentroids.set(county, {
            lat: d.properties.lat,
            lon: d.properties.lon,
        });
        d.id = county;
        d.centroid = Config.projection.fitSize([Config.svg_width, Config.svg_height], geojsonFeatures)([d.properties.lon, d.properties.lat]);
        // Set force for group by county
        d.force = {};
        d.force.x = d.centroid[0];
        d.force.y = d.centroid[1];
        d.force.foc_x = d.centroid[0];
        d.force.foc_y = d.centroid[1];
    });

    graph.nodes = Data.formatNodes(graph.nodes, countiesCentroids);
}

const drawGraph = () => {
    // Setup the simulation
    // https://gist.github.com/mbostock/1153292
    const ticked = () => {
        Simulation.update(idToNode, d3.selectAll('.nodes'), d3.selectAll('.links'), d3.selectAll('.node-labels'), positioning, xScale, yScale);
    };

    simulation = Simulation.graphSimulation(graph);
    simulation.on('tick', ticked);
    simulation.force('link').links(graph.links);

    // Append the svg object to the chart div
    svg = d3.select('#chart')
        .append('svg')
            .attr('class', 'chart-group')
            .attr('preserveAspectRatio', 'xMidYMid')
            .attr('width', Config.svg_width)
            .attr('height', Config.svg_height)
            .attr('viewBox', '0, 0 ' + Config.svg_width + ' ' + Config.svg_height)
            .on('click', () => { Tooltip.unHighlight(); Tooltip.hideTooltip(); });

    // Append zoomable group
    zoomableGroup = svg.append('g')
        .attr('class', 'zoomable-group')
        .style('transform-origin', '50% 50% 0');

    // Set object for map
    mapChart = new MapChart(".zoomable-group", geoCounties, geojsonFeatures);

    // Set object for clusters
    packChart = new PackChart(".zoomable-group", geoCounties, graph.nodes);

    // Map nodes name with nodes details
    idToNode = Data.idToNodeFnc(graph);
};

const setActions = () => {

    // Add legends
    Layout.createLegend(Layout.statusColor(language), 300, 300, 'status-legend', Language.status(language));
    Layout.createLegend(Layout.countyColor, 900, 1100, 'county-legend', Language.county(language));
    Layout.createLegend(Layout.genderColor(language), 200, 200, 'gender-legend', Language.gender(language));
    Layout.createLegend(Layout.ageColor, 400, 400, 'age-legend', Language.age(language));

    // Set scales for nodes by time
    xScale = d3.scaleTime()
        .domain(d3.extent(graph.nodes, d => d.date))
        .range([0, Config.svg_width]);
    yScale = d3.scaleLinear()
        .domain(d3.extent(graph.nodes, d => d.dayOrder))
        .range([Config.svg_height, 0]);

    // Zoom by scroll, pan
    d3.select('#zoom-in')
        .on('click', () => svg.transition().call(Layout.zoom.scaleBy, 2));
    d3.select('#zoom-out')
        .on('click', () => svg.transition().call(Layout.zoom.scaleBy, 0.5));
    d3.select('#reset-zoom').on('click', () => Layout.resetZoom());

    // Apply zoom handler and zoom out
    svg.call(Layout.zoom);
    Layout.resetZoom();

    // Toggle between map, graph and timeline chart
    d3.select('#show-map')
        .on('click', () => Layout.showMap(graph, simulation, idToNode, xScale, yScale));
    d3.select('#show-map-clusters')
        .on('click', () => {
            Layout.showMapClusters(graph, simulation, idToNode, xScale, yScale);
            Draw.MapCirclesPack();
        });
    d3.select('#show-clusters')
        .on('click', () => {
            Layout.showMapClusters(graph, simulation, idToNode, xScale, yScale);
            d3.selectAll('.land').attr('opacity', 0.5);
            Draw.GroupCirclesPack();
        });
    d3.select('#show-graph')
        .on('click', () => Layout.showGraph(simulation));
    d3.select('#show-arcs')
        .on('click', () => Layout.showArcs(graph, simulation, idToNode, xScale, yScale));

    // Change colors from status to counties and vice versa
    d3.select('#color-counties')
        .on('click', () => Layout.colorCounties());
    d3.select('#color-status')
        .on('click', () => Layout.colorStatus());
    d3.select('#color-gender')
        .on('click', () => Layout.colorGender());
    d3.select('#color-age')
        .on('click', () => Layout.colorAge());

    // Toggle the legend
    const toggleLegend = () => {
        if (legendStatus === true) {
            d3.select('#legend-div').classed('hide', true);
            legendStatus = false;
        } else {
            d3.select('#legend-div').classed('hide', false);
            legendStatus = true;
        };
    };
    d3.select('#legend-div').classed('hide', true);
    d3.select('#toggle-legend')
        .on('click', () => toggleLegend());

    // Highlight and pan to searched Id
    d3.select('#search-case')
        .on('click', () => {
            if (searchStatus === true) {
                d3.select('#search-input').classed('hide', false);
                searchStatus = false;
            } else {
                d3.select('#search-input').classed('hide', true);
                searchStatus = true;
            };
        });
    d3.select('#search-input')
        .on('input', () => {
            if (cases.includes(+this.value)) {
                Tooltip.highlightSearchedId(+this.value);
            }
        });

    // General page info
    d3.select('#show-info').on('click', () => infoStatus = Tooltip.toggleInfo(infoStatus, language));

    // Start/stop the animation - highlight the cases ordered by day and case number
    d3.select('#play-cases')
        .on('click', () => {
            d3.select('#play-cases').classed('hide', true);
            d3.select('#pause-cases').classed('hide', false);
            playCases();
        });
    d3.select('#pause-cases')
        .on('click', () => {
            d3.select('#pause-cases').classed('hide', true);
            d3.select('#play-cases').classed('hide',false);
            pauseCases();
        });

    const playCases = () => {
        svg.call(Layout.zoom.scaleTo, 0.5);
        thisCaseOrder = d3.select('#nRadius').node().value;
        if (+thisCaseOrder === (+cases.length - 1)) thisCaseOrder = 0;

        playCasesNow = setInterval(() => {
            thisCaseId = cases[thisCaseOrder];
            if (thisCaseId !== undefined) {
                Layout.updateRadius(cases, thisCaseOrder);
                thisCaseOrder++;
            } else {
                thisCaseOrder = 0;
            }
        }, 200);
    };
    const pauseCases = () => {
        clearInterval(playCasesNow);
    };

    // Case slider to highlight nodes by id
    // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36

    // When the input range changes highlight the circle
    d3.select('#nRadius').on('input', function() {
        Layout.updateRadius(cases, +this.value);
    });
    d3.select('#nRadius').property('max', cases.length-1);
    Layout.updateRadius(cases, cases.length-1);


    // Draw cases by time
    Draw.TimeLine(xScale, yScale);

    // Draw counties map
    // Draw.CountiesMap(geoCounties, geojsonFeatures);
    mapChart.setupData();

    // Draw nodes and links
    Draw.NodesAndLinks(graph, cases, simulation, positioning);

    // Define the secondary simulation, for county groups
    // Draw.CirclesPacks(geoCounties, graph.nodes, cases);
    packChart.setupData();

    // Color the legend for counties
    Layout.colorStatus();

    // Hide case labels first
    Layout.hideLabels(1);


    // Zoom to latest case, when loading spinner stops
    setTimeout(() => {
        simulation.stop();
        spinner.stop();
        d3.select('tooltip_div').classed('tooltip-abs', true);
        d3.select('#CO-' + d3.max(cases))
            .attr('r', d => 2 * d.r)
            .dispatch('mouseover');
    }, 5000);

};

}).call(this);