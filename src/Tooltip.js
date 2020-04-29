// use a tooltip to show node info
export const tooltip_div = d3.select("body")
   .append("tooltip_div")
   .attr("class", "tooltip")
   .style("opacity", 0)
   .style("display", "none");

export const highlight = (d, idToTargetNodes, cases) => {
    // TODO: slider
    let left = d3.event.pageX -20;
    let top = d3.event.pageY + 20;
 
    if (window.innerWidth - left < 150){
      left = d3.event.pageX - 40;
    }
 
    d3.selectAll("circle")
        .attr("r", 5)
        .style("opacity", 0.3);
    d3.selectAll(".links")
        .style("stroke", "#999")
        .style("opacity", 0.3);
    d3.selectAll(".node-labels")
        .style("opacity", 0.3);

    tooltip_div.transition()
        .duration(200)
        .style("opacity", .9);

    d3.select("#CO-" + d.name)
        .attr("r", 15)
        .style("opacity", 1);
    d3.selectAll(".CO-links-" + d.name)
        .style("stroke", "firebrick")
        .transition()
            .duration(500)
            .attr("stroke-dashoffset", 0)
            .style("opacity", 1)
            .on("end", function(d, i) {
                if (i === 0)  
                d3.selectAll("circle")
                    .filter(function(noded) {
                        return idToTargetNodes[d.source.name].includes(noded.name) || +d.source.name === +noded.name})
                    .style("opacity", "1");
                    d3.selectAll(".node-labels")
                    .filter(function(noded) {
                        return idToTargetNodes[d.source.name].includes(noded.name) || +d.source.name === +noded.name})
                    .style("opacity", "1");
            });
    d3.selectAll(".CO-labels-" + d.name)
        .style("color", "firebrick")
        .style("opacity", 1);

    // adjust the text on the range slider
    let name = cases.indexOf(d.name);
    d3.select("#nRadius-value").text(d.name);
    d3.select("#nRadius").property("value", name);

    tooltip_div.html(tooltipHTML(d))
        .style("left", left + 'px')
        .style("top", top + 'px')
        .style("display", null);
};

export const tooltipHTML = (d) => {
    if (d.properties !== undefined) {
        return "<b>Cazul " + d.properties.case_no + "</b><br />" +
        (d.properties.gender === 'Bărbat'
                ? "Bărbat"
                : (d.properties.gender === 'Femeie'
                    ? "Femeie"
                    : "Gen nespecificat")) +
        (d.properties.age != null && d.properties.age != 0 ? (", " + d.properties.age) : "") +
        (d.properties.county != null && d.properties.county != "" ? (", din  " + d.properties.county) : "") + ".<br />" +
        (d.properties.status != null
            ? ("Status: " + (d.properties.status === "Vindecat"
                    ? "vindecat"
                    : (d.properties.status === "Confirmat"
                        ? "confirmat"
                        : "deces")) + ".<br />")
            : "") +
        (d.properties.diagnostic_date !== null ? ("Data confirmării: " + d.properties.diagnostic_date + ".<br />") : "") +
        (d.properties.healing_date !== null ? ("Data recuperării: " + d.properties.healing_date + ".<br />") : "") +
        (d.properties.reference !== null && d.properties.reference !== "" ? ("Detalii: " + '<a href="' + d.properties.reference + '" target= "_blank">aici</a>') : "");
    } else {
        return d.name;
    };
};

export const unHighlight = () => {
    d3.selectAll("circle")
        .attr("r", 5);
    d3.selectAll("circle")
        .style("opacity", 1);
    d3.selectAll(".link")
        .style("opacity", 1);
    tooltip_div.transition()
        .duration(200)
        .style("opacity", 0);
};
