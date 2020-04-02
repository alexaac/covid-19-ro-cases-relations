export const statusColor = d3.scaleOrdinal(["var(--main-confirmate)", "var(--main-recuperari", "var(--main-decese)"]).domain(["Confirmat", "Vindecat", "Decedat"]);

export const countyColors = ["#4cbf84", "#8e6def", "#c0c72d", "#605fd6", "#64bf44", "#bc5fd4", "#4ac66b", "#c946a2", "#9cbe3a", "#5581f2", "#e8ab24", "#8575db", "#f0cc6b", "#4f8be2", "#dd6227", "#41d1e8", "#e04845", "#4bd1b1", "#e14286", "#6cad66", "#dd6acc", "#80a84c", "#8567bb", "#b6a546", "#af8ee6", "#c9793e", "#5a90d4", "#d84f59", "#57c8c6", "#d36272", "#50a283", "#d26d98", "#8ba76d", "#9b6bb2", "#b59d58", "#e6a2e7", "#c98762", "#59a3d0", "#ca7b78", "#9a97d2", "#c382a5", "#b872ad"];

export const coloreazaStatus = () => {
    let svg = d3.select("#chart").select('svg');

    svg.selectAll('circle')
        .transition().duration(100)
        .attr("fill", d => {
            return (d.is_country_of_infection)
                ? "black"
                : (d.parent && d.parent.properties
                    ? statusColor(d.parent.properties.status)
                    : d.properties ? statusColor(d.properties.status) : "black");
        });

    createLegend(statusColor);
}

export const coloreazaJudete = (countyColor) => {
    let svg = d3.select("#chart").select('svg');

    svg.selectAll('circle')
        .transition().duration(100)
        .attr("fill", d => {
            return (d.is_country_of_infection)
                ? "black"
                : (d.parent && d.parent.properties
                        ? countyColor(d.parent.properties.county)
                        : d.properties ? countyColor(d.properties.county) : "");
        });

    createLegend(countyColor);
}

export const createLegend = (colorScale) => {
    let svg = d3.select("#chart").select('svg');
    let x = 20, y = 50;

    svg.selectAll('.category-legend')
        .attr('transform', `translate(${x},${y})`);

    const categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(colorScale);

    d3.select('.category-legend')
        .call(categoryLegend);
}