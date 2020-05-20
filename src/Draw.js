import * as Config from './Config';
import * as Layout from './Layout';
import * as Simulation from './Simulation';
import * as Tooltip from './Tooltip';

export const CirclesPacks = (geoCounties, graphNodes) => {
    let root,
    pack,
    packGroup,
    counties_list = {},
    countyCasesData = [],
    groupedByCountySource,
    sec_simulation,
    bubbles, en_bubbles, bubble_labels, en_bubble_labels;

    let zoomableGroup = d3.select("svg").select('.zoomable-group');

    packGroup = zoomableGroup.append('g')
        .attr("class", 'pack-group')
        .attr("opacity", 0);

    sec_simulation = Simulation.packSimulation();

    groupedByCountySource = d3.nest()
        .key( d => d.properties && d.properties.county)
        .key( d => d.properties && d.properties.source_no)
        .entries(graphNodes);
    groupedByCountySource.forEach(function(key){
        counties_list[key.key] = 1;
    });

    // Create a list containing the counties, the cases and root
    countyCasesData.push({
        id: "root",
        parent: ""
    });

    geoCounties.forEach(function(d) {
        if (counties_list[d.id] !== undefined) {
            return countyCasesData.push({
                id: d.id,
                parent: "root",
                d: d
            });
        }
    });

    groupedByCountySource.forEach(function(key){
        if(key.key !== "undefined") {
            let valuesArr = [...key["values"] ]
                .filter(d => d.key !== "null")
                .sort((a,b) => a.name - b.name);
            valuesArr.forEach(function(d) {
                countyCasesData.push({
                    id: d.key,
                    parent: key.key,
                    source_case: d,
                    value: d.values.length
                });
            });
        }
    });

    // Stratify the list
    root = (d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parent))(countyCasesData);
    root.sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // Pack
    pack = d3.pack()
        .size([Config.svg_width/2, Config.svg_height/2])
        .padding(8);
    pack(root);

    // Define circles relations
    root.eachBefore(d => {
        if (d.parent != null) {
            d.relx = d.x - d.parent.x;
            return d.rely = d.y - d.parent.y;
        } else {
            d.relx = d.x;
            return d.rely = d.y;
        }
    });
    root.eachBefore(d => {
        if ((d.parent != null) && d.parent.id === 'root') {
        return d.data.d.force.r = d.r;
        }
    });

    let language = d3.select("#language").node().value;

    // Draw the circle packs
    bubbles = packGroup.selectAll('.bubble')
        .data(root.descendants())
        .enter().append("g")
        .each(function(d) { d.node = this; })
        .on("mouseover", Tooltip.hovered(true))
        .on("mouseout", Tooltip.hovered(false));
    en_bubbles = bubbles.append('circle')
        .attr("class", 'bubble')
        .attr("r", d => d.r)
        .on("touchmove mouseover", d => Tooltip.highlightSearchedId(d.id))
        .attr("fill", d => d.parent && d.parent.id !== "root" ? Layout.countyColor(d.parent.id) : "#E8E8E8")
    en_bubbles.append('title').text(function(d) {
            return (language === "ro"
                ? d.data.parent + " - sursa nr. " + d.id + "\n" + d.value + " cazuri"
                : d.data.parent + " - source no. " + d.id + "\n" + d.value + " cases")  ;
        });
    bubble_labels = packGroup.selectAll('.labels').data(root.leaves());
    en_bubble_labels = bubble_labels.enter().append('g').attr("class", 'labels');

    en_bubble_labels.append('text')
        .text(d => d.value)
        .attr("dy", '0.35em');
    Layout.hideLabels(1);

    // Move the circles to their place
    sec_simulation.nodes(geoCounties.map(d => d.force)).stop();
    let i,j,ref;
    for (i = j = 0, ref = Math.ceil(Math.log(sec_simulation.alphaMin()) / Math.log(1 - sec_simulation.alphaDecay())); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        sec_simulation.tick();
    }
};

export const GroupCirclesPack = () => {
    d3.select('.pack-group').attr("transform", "scale(2)");
    d3.selectAll('.bubble').attr("transform", d => `translate(${d.x},${d.y})`);
    d3.selectAll('.labels').attr("transform", d => `translate(${d.x},${d.y})`);
};

export const MapCirclesPack = () => {
    d3.select('.pack-group').attr("transform", "scale(1)");
    d3.selectAll('.bubble').attr("transform", d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : "translate(-10000,-10000)");
    d3.selectAll('.labels').attr("transform", d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : "translate(-10000,-10000)");
};

export const CountiesMap = (geoCounties, geojsonFeatures) => {
    let zoomableGroup = d3.select("svg").select('.zoomable-group');

    const thisMapPath = d3.geoPath()
        .projection(
            Config.projection
                  .fitSize([Config.svg_width , Config.svg_height], geojsonFeatures));

    zoomableGroup.append("g")
        .attr("class", "map-features")
        .selectAll("path")
            .data(geoCounties)
            .enter()
            .append("path")
            .attr("d", thisMapPath)
                .attr("class", "land")
                .attr("opacity", 0.25);
};

export const TimeLine = (xScale, yScale) => {
    let zoomableGroup = d3.select("svg").select('.zoomable-group');

    const timeGraph = zoomableGroup.append("g")
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
            .ticks(30)
            .tickFormat(Config.multiFormat));
    xAxis.selectAll('text')
        .attr("class", "time-graph-x")
        .attr("font-weight", "bold")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("transform", "rotate(-65)");
    const yAxis = timeGraph.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(10));
    yAxis.selectAll('text')
        .attr("class", "time-graph-y")
        .attr("font-weight", "bold");
    const yLabel = timeGraph.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -Config.svg_height / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Cazuri pe zi")
}

export const NodesAndLinks = (graph, cases, simulation, positioning) => {
    let links, nodes;

    let zoomableGroup = d3.select("svg").select('.zoomable-group');
    let nodesGroup = zoomableGroup.append('g')
        .attr("class", 'nodes-group');

    // Add arrows for links
    const markerTypes = Array.from(new Set(graph.nodes.map(d => d.source)));
    nodesGroup.append("defs").selectAll("marker")
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
    
    links = nodesGroup.append("g")
            .attr("class", "link")
            .selectAll("path")
            .data(graph.links)
            .join("path")
                .attr("class", d => `CO-links-${d.source.name}`)
                .classed("links", true)
                .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
    links.exit().remove();

    nodes = nodesGroup.append("g")
        .attr("class", "node")
        .selectAll("g")
        .data(graph.nodes)
        .join("g")
            .call(Simulation.drag(simulation, positioning));

    nodes.append("circle")
        .attr("id", d => d.properties && `CO-${d.properties.case_no}`)
        .attr("class", d => d.properties && `CO-nodes-${d.properties.source_no}`)
        .classed("nodes", true)
        .attr("r", d => d.r)
        .on("touchmove mouseover", d => Tooltip.highlight(d, cases))
        .on("click", d => Layout.panTo(d));

    nodes.append('g')
        .classed("node-labels", true)
        .append("text")
            .attr("class", d => d.properties && `CO-labels-${d.properties.source_no} CO-labels-self-${d.properties.case_no}`)
            .attr("x", 8)
            .attr("y", "0.31em")
            .text(d => d.name)
            .clone(true).lower();

    nodes.exit().remove();
} 