// https://gist.github.com/mbostock/1153292

// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    svg_width = width + margin.left + margin.right,
    svg_height = height + margin.top + margin.bottom;

// use a tooltip to show node info
const tooltip_div = d3.select("body")
   .append("tooltip_div")
   .attr("class", "tooltip")
   .style("opacity", 0)
   .style("display", "none");

const highlight = (d) => {
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

const tooltipHTML = (d) => {
   return "<b>Cazul " + d.properties.case_no + "</b><br />" +
       (d.properties.gender === 'Bărbat' ? "Bărbat" : "Femeie") +
       (d.properties.age != null && d.properties.age != 0 ? (", " + d.properties.age) : "") +
       (d.properties.county != null && d.properties.county != "" ? (", din  " + d.properties.county) : "") + ".<br />" +
       (d.properties.status != null
           ? ("Status: " + (d.properties.status === "Vindecat" ? "vindecat" : "spitalizat") + ".<br />")
           : "") +
       (d.properties.healing_date !== null ? ("Data recuperării: " + d.properties.healing_date + ".<br />") : "") +
       (d.properties.reference !== null && d.properties.reference !== "" ? ("Detalii: " + '<a href="' + d.properties.reference + '" target= "_blank">aici</a>') : "");
};

const unHighlight = () => {
   tooltip_div.transition()
       .duration(200)
       .style("opacity", 0);
};

// simulation drag
const drag = simulation => {
    const dragstarted = d => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    const dragged = d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    const dragended = d => {
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
const linkArc = d => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
};

(() => {

    // d3.json("cases_relations.json").then( data => { // dummy data
    d3.json("https://covid19.geo-spatial.org/api/statistics/getCaseRelations").then( data => {

        const graph = { nodes: [], links: [] };
        const graph1 = { nodes: [], links: [] };

        const nodes = data.data.nodes;
        const links = data.data.links;

        graph.nodes = nodes;
        graph.links = links;

        const sources = nodes.filter( d => d.properties.country_of_infection !== null && d.properties.country_of_infection !== "România" && d.properties.country_of_infection !== "Romania");

        // https://observablehq.com/d/cedc594061a988c6
        graph1.nodes = nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
        graph1.links = links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

        // show spinner when changing view from round 1 to 2 and vice versa
        d3.select("#switch-data")
            .on("click", function(){
                var button = d3.select(this);
                if (button.text() === "Grupează după caz"){
                    changeView(graph);
                    button.text("Grupează după țară");
                } else {
                    changeView(graph1);
                    button.text("Grupează după caz");
                };
            })

        changeView(graph1);
    });

    const changeView = (graph) => {
        d3.select("#chart").selectAll("*").remove();

        // append the svg object to the chart div
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        const svg = d3.select("#chart")
            .append("svg")
            .attr("class", "chart-group")
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .attr("viewBox", '0, 0 ' + svg_width + ' ' + svg_height)
            .on("click", () => { unHighlight(); });

        var g = svg.append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        const types = Array.from(new Set(graph.nodes
            .filter(d => d.is_country_of_infection !== 1)
            .map(d => d.source)));
        const cases = Array.from(new Set(graph.nodes
            .filter(d => d.is_country_of_infection !== 1)
            .map(d => d.properties ? d.properties.case_no : "")));
        const color = (status) => {
            return status === "Confirmat"
                ? "var(--main-confirmate)"
                :  status === "Vindecat"
                    ? "var(--main-recuperari"
                    : "var(--main-decese)";
        };

        // graph.nodes.shift();
        const links = graph.links;
        const nodes = graph.nodes;

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id( d => {
                let name = JSON.parse(JSON.stringify(d)).name;
                return name;
            }))
            .force("charge", d3.forceManyBody()
                                .strength(-50)
                                .distanceMax(900))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius( d => {
                return d.radius * 3
            }))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(svg);

        function zoom_actions(){
            g.attr("transform", d3.event.transform)
        }

        // Per-type markers, as they don't inherit styles.
        g.append("defs").selectAll("marker")
        .data(types)
                .join("marker")
                    .attr("id", d => `arrow-${d}`)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15)
                    .attr("refY", -0.5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                .append("path")
                    .attr("fill", color)
                    .attr("fill", "#999")
                    .attr("d", "M0,-5L10,0L0,5");
        
        const link = g.append("g")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .selectAll("path")
                .data(links)
                .join("path")
                    .attr("stroke", d => "#999")
                    .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
        link.exit().remove();

        const node = g.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll("g")
            .data(nodes)
            .join("g")
                .call(drag(simulation));

        node.append("circle")
            .attr("class", d => d.properties && `CO-${d.properties.case_no}`)
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("r", 5)
            .attr("fill", d => {
                return (d.is_country_of_infection)
                    ? "black"
                    : (d.properties && d.parent
                        ? color(d.parent.properties.status)
                        : d.properties ? color(d.properties.status) : "black");
            })
            .attr("stroke", d => "#333")
            .on("touchend mouseenter", d => highlight(d))
            .on("touchend mouseover", fade(.2))
            .on("touchend mouseout", fade(1));

        node.append("text")
            .attr("x", 8)
            .attr("y", "0.31em")
            .text(d => {
                return d.is_country_of_infection ? d.country_name : ("#" + d.name);
            })
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);
        node.exit().remove();

        simulation.on("tick", () => {
            link.attr("d", linkArc);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // https://bl.ocks.org/martinjc/5e73d17699573ccd7c2d4468d61dce17/8c047553db6e8627553165ee283cfd525416605c
        // build a dictionary of nodes that are linked
        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        // check the dictionary to see if nodes are linked
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        // fade nodes on hover
        function fade(opacity) {
            return function(d) {
                // check all other nodes to see if they're connected
                // to this one. if so, keep the opacity at 1, otherwise
                // fade
                node.style("stroke-opacity", function(o) {
                    thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });
                node.style("fill-opacity", function(o) {
                    thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });
                // also style link accordingly
                link.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
            };
        }

        // Case slider
        // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36
        d3.select("#nRadius").property("max", d3.max(cases));

        // updateR the slider
        const updateRadius = (nRadius) => {

            // adjust the text on the range slider
            d3.select("#nRadius-value").text(nRadius);
            d3.select("#nRadius").property("value", nRadius);

            // highlight case
            d3.selectAll("circle")
                .attr("r", 5);
            d3.selectAll(".CO-" + nRadius)
                .attr("r", 10);
        }

        // when the input range changes highlight the circle
        d3.select("#nRadius").on("input", function() {
            updateRadius(+this.value);
        });

        // Select first case
        updateRadius(1);

        /******************************** Title ********************************/
        // svg.append("text")
        //     .attr("x", (width / 2))
        //     .attr("y", 0 - (margin.top))
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "16px")
        //     .style("text-decoration", "underline")
        //     .text("Relația cazurilor confirmate");

    };

}).call(this);
