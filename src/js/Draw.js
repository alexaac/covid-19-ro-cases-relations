import { select, selectAll } from "d3-selection";
import * as Layout from "./Layout.js";
import * as Tooltip from "./Tooltip.js";

// Create a d3 Object with a subset of functions
const d3 = Object.assign(
  {},
  {
    select,
    selectAll,
  }
);

export const NodesAndLinks = (graph, cases) => {
  let links, nodes;

  let zoomableGroup = d3.select("svg").select(".zoomable-group");
  let nodesGroup = zoomableGroup.append("g").attr("class", "nodes-group");

  // Add arrows for links
  const markerTypes = Array.from(new Set(graph.nodes.map((d) => d.source)));
  nodesGroup
    .append("defs")
    .selectAll("marker")
    .data(markerTypes)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "#999")
    .attr("d", "M0,-5L10,0L0,5");

  links = nodesGroup
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("g")
    .attr("class", "link");

  const linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
            M${d.source.x},${d.source.y}
            A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
  };

  links
    .append("path")
    .attr("class", (d) => `CO-links-${d.source.name}`)
    .classed("links", true)
    .attr(
      "marker-end",
      (d) => `url(${new URL(`#arrow-${d.type}`, location.toString())})`
    )
    .attr("d", (d) => linkArc(d));

  links.exit().remove();

  nodes = nodesGroup
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node");

  nodes
    .append("circle")
    .attr("id", (d) => d.properties && `CO-${d.properties.case_no}`)
    .attr("class", (d) => d.properties && `CO-nodes-${d.properties.source_no}`)
    .classed("nodes", true)
    .attr("r", (d) => d.r)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .on("touchstart mouseover", (d) => Tooltip.highlight(d, cases))
    .on("dblclick", (d) => Layout.panTo(d));

  nodes
    .append("g")
    .classed("node-labels", true)
    .append("text")
    .attr(
      "class",
      (d) =>
        d.properties &&
        `CO-labels-${d.properties.source_no} CO-labels-self-${d.properties.case_no}`
    )
    .attr("x", 8)
    .attr("y", "0.31em")
    .text((d) => d.name)
    .clone(true)
    .lower();

  d3.selectAll(".node-labels").attr(
    "transform",
    (d) => `translate(${d.x},${d.y})`
  );

  nodes.exit().remove();
};
