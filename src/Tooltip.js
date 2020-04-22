// use a tooltip to show node info
export const tooltip_div = d3.select("body")
   .append("tooltip_div")
   .attr("class", "tooltip")
   .style("opacity", 0)
   .style("display", "none");

export const highlight = (d) => {
    // TODO: slider
    let left = d3.event.pageX -20;
    let top = d3.event.pageY + 20;
 
    if (window.innerWidth - left < 150){
      left = d3.event.pageX - 40;
    }
 
    d3.selectAll("circle")
        .attr("r", 5);

    tooltip_div.transition()
        .duration(200)
        .style("opacity", .9);

    d3.select("#CO-" + d.name)
        .attr("r", 15);

    // adjust the text on the range slider
    d3.select("#nRadius-value").text(d.name);
    d3.select("#nRadius").property("value", d.name);

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
       (d.properties.healing_date !== null ? ("Data recuperării: " + d.properties.healing_date + ".<br />") : "") +
       (d.properties.reference !== null && d.properties.reference !== "" ? ("Detalii: " + '<a href="' + d.properties.reference + '" target= "_blank">aici</a>') : "");
    } else {
        return d.name;
    };
};

export const unHighlight = () => {
    d3.selectAll("circle")
        .attr("r", 5);

    tooltip_div.transition()
        .duration(200)
        .style("opacity", 0);
};
