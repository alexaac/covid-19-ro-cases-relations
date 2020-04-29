import * as Config from './Config';

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