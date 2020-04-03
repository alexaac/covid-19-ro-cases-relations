// set the dimensions and margins of the graph
export const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1600 - margin.left - margin.right,
    height = 1400 - margin.top - margin.bottom,
    svg_width = width + margin.left + margin.right,
    svg_height = height + margin.top + margin.bottom;

export const projection = d3.geoAlbers()
    .center([24.7731, 45.7909])
    .rotate([-14, 3.3, -10])
    .parallels([37, 54])
    .scale(5000);

export const path = d3.geoPath()
    .projection(projection);