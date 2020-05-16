export const formatNodes = (nodes, countiesCentroids) => {
    let parseTime = d3.timeParse("%d-%m-%Y");
    let formattedData = [];

    nodes.forEach( d => {
        if (d.properties !== undefined) {
            d.latitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lat;
            d.longitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lon;
            d.date = parseTime(d.properties.diagnostic_date).getTime();
            d.name = +d.name;
        };
    });
    nodes.sort((a,b) => a.date - b.date);

    var ed_data = d3.nest()
        .key(function(d) {
            return d.properties && d.properties.diagnostic_date;
        })
        // .key(function(d) { return d.properties.county; })
        // .rollup(function(v) { return v.length; })
        .entries(nodes);
    ed_data.forEach(function(key){
        let valuesArr = [...key["values"] ].sort((a,b) => a.name - b.name);
        let valuesPerDay = valuesArr.map(function(d){
                d.dayOrder = valuesArr.indexOf(d) + 1;
                return d;
            });
        formattedData.push(...valuesPerDay)
    });

    return formattedData;
};

export const idToNodeFnc = (graph) => {
    let dict = {};
    graph.nodes.forEach(function(n) {
        dict[n.name] = n;
    });
    return dict;
};

export const idToTargetNodesFnc = (graph) => {
    let dict = {};
    graph.nodes.forEach(function (n) {
        dict[n.name] = [];
        graph.links.forEach(function (l) {
            if (l.source.name === n.name) {
                dict[n.name].push(l.target.name);
            }
        });
    });
    return dict;
};
