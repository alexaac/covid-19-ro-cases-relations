import * as Config from '../Config.js';
import * as Data from '../Data.js';
import * as Layout from '../Layout.js';
import * as Tooltip from '../Tooltip.js';

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
            
            viz.links = viz.g.selectAll('.link')
                .data(viz.dataFiltered.links)
                .enter()
                .append('g')
                .attr('class', 'link');

            viz.links.append('path')
                .attr('class', d => `CO-links-${d.source.name}`)
                .classed('links', true)
                .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);

            viz.links.exit().remove();

            viz.node = viz.g.selectAll('.node')
                .data(viz.dataFiltered.nodes)
                .enter()
                .append('g')
                .attr('class', 'node');

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

            const linkArc = (d) => {
                const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
                return `
                    M${d.source.x},${d.source.y}
                    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
                `;
            };
        
            const ticked = () => {
                d3.selectAll('.links').attr('d', d => linkArc(d));
                d3.selectAll('.nodes').attr('transform', d => `translate(${d.x},${d.y})`);
                d3.selectAll('.node-labels').attr('transform', d => `translate(${d.x},${d.y})`);
            };
        
            let simulation = d3.forceSimulation(viz.dataFiltered.nodes)
                .force('link', d3.forceLink(viz.dataFiltered.links).id( d => d.name))
                .force('center', d3.forceCenter(Config.width / 2, Config.height / 2))
                .force('charge', d3.forceManyBody())
                .force('x', d3.forceX())
                .force('y', d3.forceY())
                .alphaDecay([0.02]);
            
            simulation.on('tick', ticked);
            simulation.force('link').links(viz.dataFiltered.links);
            
            setTimeout(() => {
                simulation.stop();
            }, 5000);            
        };
    };
}
