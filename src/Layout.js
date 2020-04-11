export const statusColor = d3.scaleOrdinal(["var(--main-confirmate)", "var(--main-recuperari", "var(--main-decese)"]).domain(["Confirmat", "Vindecat", "Decedat"]);

// https://medialab.github.io/iwanthue/
// hcl[0]>=0 && hcl[0]<=340
//     && hcl[1]>=30 && hcl[1]<=80
//     && hcl[2]>=35 && hcl[2]<=100
const countyColors = [
    "#e4588c", "#35d394", "#ba1ea8", "#4caf1c", "#1848ca", "#aad42b", "#9b85ff", "#068400", "#8b2487", "#97ff8b", "#d60042", "#00ae87", "#f94740", "#48d3ff", "#d17300", "#5ea2ff", "#cfb100", "#53498f", "#ffe353", "#325383", "#86a700", "#ff9eeb", "#007f30", "#d9b6ff", "#3b5c12", "#89c2ff", "#964000", "#00bfbb", "#ff6f54", "#01aac6", "#ffb65d", "#008857", "#ff8e90", "#145f36", "#952e31", "#fffea6", "#8e3440", "#5a936f", "#883d0c", "#ffaf81", "#34a6c2", "#b09764", "#458a18"
];
const counties = [
    "ALBA", "ARAD", "ARGEȘ", "BACĂU", "BIHOR", "BISTRIȚA-NĂSĂUD", "BOTOȘANI", "BRAȘOV", "BRĂILA", "BUCUREȘTI", "BUZĂU", "CARAȘ-SEVERIN", "CLUJ", "CONSTANȚA", "COVASNA", "CĂLĂRAȘI", "DOLJ", "DÂMBOVIȚA", "GALAȚI", "GIURGIU", "GORJ", "HARGHITA", "HUNEDOARA", "IALOMIȚA", "IAȘI", "ILFOV", "NECUNOSCUT", "MARAMUREȘ", "MEHEDINȚI", "MUREȘ", "NEAMȚ", "OLT", "PRAHOVA", "SATU MARE", "SIBIU", "SUCEAVA", "SĂLAJ", "TELEORMAN", "TIMIȘ", "TULCEA", "VASLUI", "VRANCEA", "VÂLCEA"
];
export const countyColor = d3.scaleOrdinal(countyColors).domain(counties);

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

    showLegend('status-legend');
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

    showLegend('county-legend');
}

export const createLegend = (colorScale, height, vbHeight, legendClass) => {

    const legend = d3.select("#legend-div")
        .append("div")
            .attr('class', legendClass)
        .append("svg")
            .attr('class', "category-legend")
            .attr("width", 110)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", '-10, -10 ' + 120 + ' ' + vbHeight)
            .attr("x", 0)
            .attr("y", 0);

    const categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(colorScale);

    legend.call(categoryLegend);
}

export const showLegend = category => {
    if (category === 'county-legend') {
        d3.select(".county-legend").classed("hide", false);
        d3.select(".status-legend").classed("hide", true);
    } else if (category === 'status-legend') {
        d3.select(".county-legend").classed("hide", true);
        d3.select(".status-legend").classed("hide", false);
    }
}