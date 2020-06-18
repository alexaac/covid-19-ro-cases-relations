import * as Config from '../Config';
import * as Data from '../Data';
import * as Layout from '../Layout';
import * as Tooltip from '../Tooltip';

// nodesChart Class
export default class nodesChart {
    constructor (_parentElement, graph, cases) {
        this.parentElement = _parentElement;
        this.graph = graph;
        this.cases = cases;

        this.initViz();
    };
  
    initViz () {
        var viz = this;

        viz.height = Config.height;
        viz.width = Config.width;
    
        viz.g = d3.select(viz.parentElement).append("g")
            .attr('class', 'nodes-group');

        viz.t = function() { return d3.transition().duration(1000); };

        viz.markers = viz.g.append('defs');
        viz.links = viz.g.append('g')
            .attr('class', 'link');
        viz.nodes = viz.g.append('g')
            .attr('class', 'node');

        viz.setupData();
    };

    setupData () {
        var viz = this;

        viz.dataFiltered = viz.graph;

        // Map nodes name with nodes details
        viz.idToNode = Data.idToNodeFnc(viz.dataFiltered);

        viz.updateViz();
    };

    updateViz () {
        var viz = this;

        if (viz.dataFiltered !== undefined) {
            // Add arrows for viz.links
            const markerTypes = Array.from(new Set(viz.dataFiltered.nodes.map(d => d.source)));
            viz.g.append('defs').selectAll('marker')
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
            
            viz.links = viz.g.append('g')
                    .attr('class', 'link')
                    .selectAll('path')
                    .data(viz.dataFiltered.links)
                    .join('path')
                        .attr('class', d => `CO-links-${d.source.name}`)
                        .classed('links', true)
                        .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
            viz.links.exit().remove();

            viz.node = viz.g.append('g')
                .attr('class', 'node')
                .selectAll('g')
                .data(viz.dataFiltered.nodes)
                .join('g');
                    // .call(Simulation.drag(viz.simulation, "diagram"));

            viz.nodes = viz.node.append('circle')
                .attr('id', d => d.properties && `CO-${d.properties.case_no}`)
                .attr('class', d => d.properties && `CO-nodes-${d.properties.source_no}`)
                .classed('nodes', true)
                .attr('r', d => d.r)
                .on('touchmove mouseover', d => Tooltip.highlight(d, viz.cases))
                .on('click', d => Layout.panTo(d));

            viz.labels = viz.nodes.append('g')
                .classed('node-labels', true)
                .append('text')
                    .attr('class', d => d.properties && `CO-labels-${d.properties.source_no} CO-labels-self-${d.properties.case_no}`)
                    .attr('x', 8)
                    .attr('y', '0.31em')
                    .text(d => d.name)
                    .clone(true).lower();

            viz.nodes.exit().remove();

        };
    };
}
