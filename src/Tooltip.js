// use a tooltip to show node info
export const tooltip_div = d3.select("body")
   .append("tooltip_div")
   .attr("class", "tooltip")
   .style("opacity", 0)
   .style("display", "none");

export const highlight = (d) => {
    if (d.is_country_of_infection) {
        return;
    };
 
    let left = d3.event.pageX -20;
    let top = d3.event.pageY + 20;
 
    if (window.innerWidth - left < 150){
      left = d3.event.pageX - 40;
    }
 
    tooltip_div.transition()
        .duration(200)
        .style("opacity", .9);
 
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
    tooltip_div.transition()
        .duration(200)
        .style("opacity", 0);
};
