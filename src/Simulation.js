import * as Config from './Config';

export const graphSimulation = (graph) => {
    return d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id( d => d.name))
        .force("center", d3.forceCenter(Config.svg_width / 2, Config.svg_height / 2))
        .force("charge", d3.forceManyBody())
        // .force("collision", d3.forceCollide().radius(d => d.radius))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaDecay([0.02]);
};

export const packSimulation = () => {
    return d3.forceSimulation()
    .force('collision', d3.forceCollide()
        .radius(d => d.radius )
        .strength(0.01))
    .force('attract', d3.forceAttract()
        .target(d => [d.foc_x, d.foc_y])
        .strength(0.5));
}

// simulation drag
export const drag = (simulation, positioning) => {
    const dragstarted = d => {
        if (positioning !== 'diagram') { return };
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    const dragged = d => {
        if (positioning !== 'diagram') { return };
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    const dragended = d => {
        if (positioning !== 'diagram') { return };
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
};

// simulation link
export const linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
};

export const update = (idToNode, nodes, links, labels, positioning, xScale, yScale) => {

    links.attr("d", d => {
        if (positioning === 'arcs') {
            if (typeof(d.source.name) === "string") {
                return linkArc(d)
            } else {
                let start = xScale(idToNode[d.source.name].date) || 0;
                let end = xScale(idToNode[d.target.name].date);
                const arcPath = ['M', start, yScale(idToNode[d.source.name].dayOrder), 'A', (start - end)/2, ',', (start-end)/2, 0,0,",",
                            start < end ? 1: 0, end, yScale(idToNode[d.target.name].dayOrder)].join(' ');
                return arcPath;
            }
        } else {
            return linkArc(d)
        }
    });
    nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    labels.attr("transform", d => `translate(${d.x},${d.y})`);
};
