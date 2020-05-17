export const formatNodes = (nodes, countiesCentroids) => {
    let parseTime = d3.timeParse("%d-%m-%Y");
    let formattedData = [];

    let idToTargetNodes = idToTargetNodesFnc(nodes);
    let rScale = d3.scaleLinear()
        .domain([0,d3.max(Object.values(idToTargetNodes))])
        .range([3,15])

    nodes.forEach( d => {
        if (d.properties !== undefined) {
            d.latitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lat;
            d.longitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lon;
            d.date = parseTime(d.properties.diagnostic_date).getTime();
            d.name = +d.name;
            d.infected_persons = (idToTargetNodes[d.properties.case_no] + 1) || 1;
            d.r = rScale(d.infected_persons);
        };
    });
    nodes.sort((a,b) => a.date - b.date);

    var ed_data = d3.nest()
        .key(function(d) {
            return d.properties && d.properties.diagnostic_date;
        })
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

export const idToTargetNodesFnc = (nodes) => {
    return d3.nest()
        .key(function(d) {
            return d.properties && d.properties.source_no;
        })
        .rollup(function(v) { return v.length; })
        .object(nodes); // returns a nested object
};
