import * as Layout from './Layout';
import * as Tooltip from './Tooltip';

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
