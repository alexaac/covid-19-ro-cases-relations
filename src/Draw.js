import * as Config from './Config';
import * as Layout from './Layout';
import * as Simulation from './Simulation';
import * as Tooltip from './Tooltip';

export const GroupCirclesPack = () => {
    d3.select('.pack-group').attr('transform', 'scale(2)');
    d3.selectAll('.bubble').attr('transform', d => `translate(${d.x},${d.y})`);
    d3.selectAll('.labels').attr('transform', d => `translate(${d.x},${d.y})`);
};

export const MapCirclesPack = () => {
    d3.select('.pack-group').attr('transform', 'scale(1)');
    d3.selectAll('.bubble').attr('transform', d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : 'translate(-10000,-10000)');
    d3.selectAll('.labels').attr('transform', d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : 'translate(-10000,-10000)');
};

export const TimeLine = (xScale, yScale) => {
    let zoomableGroup = d3.select('svg').select('.zoomable-group');

    let language = d3.select('#language').node().value;

    const timeGraph = zoomableGroup.append('g')
        .attr('class', 'time-graph')
        .attr('opacity', 0);

    const xLabel = timeGraph.append('text')
        .attr('y', Config.svg_height + 70)
        .attr('x', Config.svg_width / 2)
        .attr('font-size', '16px')
        .attr('text-anchor', 'middle')
        .text(language === 'ro' ? 'Ziua' : 'Day');
    const xAxis = timeGraph.append('g')
        .attr('transform', `translate(0,${Config.svg_height})`)
        .call(d3.axisBottom(xScale)
            .ticks(30)
            .tickFormat(Config.multiFormat));
    xAxis.selectAll('text')
        .attr('class', 'time-graph-x')
        .attr('font-weight', 'bold')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('transform', 'rotate(-65)');
    const yAxis = timeGraph.append('g')
        .call(d3.axisLeft(yScale)
            .ticks(10));
    yAxis.selectAll('text')
        .attr('class', 'time-graph-y')
        .attr('font-weight', 'bold');
    const yLabel = timeGraph.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -Config.svg_height / 2)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text(language === 'ro' ? 'Cazuri ordonate pe zi' : 'Ordered cases per day');
}

export const NodesAndLinks = (graph, cases, simulation, positioning) => {
    let links, nodes;

    let zoomableGroup = d3.select('svg').select('.zoomable-group');
    let nodesGroup = zoomableGroup.append('g')
        .attr('class', 'nodes-group');

    // Add arrows for links
    const markerTypes = Array.from(new Set(graph.nodes.map(d => d.source)));
    nodesGroup.append('defs').selectAll('marker')
        .data(markerTypes)
            .join('marker')
                .attr('id', d => `arrow-${d}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 15)
                .attr('refY', -0.5)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
            .append('path')
                .attr('fill', '#999')
                .attr('d', 'M0,-5L10,0L0,5');
    
    links = nodesGroup.append('g')
            .attr('class', 'link')
            .selectAll('path')
            .data(graph.links)
            .join('path')
                .attr('class', d => `CO-links-${d.source.name}`)
                .classed('links', true)
                .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
    links.exit().remove();

    nodes = nodesGroup.append('g')
        .attr('class', 'node')
        .selectAll('g')
        .data(graph.nodes)
        .join('g');
            // .call(Simulation.drag(simulation, positioning));

    nodes.append('circle')
        .attr('id', d => d.properties && `CO-${d.properties.case_no}`)
        .attr('class', d => d.properties && `CO-nodes-${d.properties.source_no}`)
        .classed('nodes', true)
        .attr('r', d => d.r)
        .on('touchmove mouseover', d => Tooltip.highlight(d, cases))
        .on('click', d => Layout.panTo(d));

    nodes.append('g')
        .classed('node-labels', true)
        .append('text')
            .attr('class', d => d.properties && `CO-labels-${d.properties.source_no} CO-labels-self-${d.properties.case_no}`)
            .attr('x', 8)
            .attr('y', '0.31em')
            .text(d => d.name)
            .clone(true).lower();

    nodes.exit().remove();
} 
