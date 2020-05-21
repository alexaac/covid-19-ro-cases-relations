export const formatNodes = (nodes, countiesCentroids) => {
    let parseTime = d3.timeParse('%d-%m-%Y');
    let formattedData = [];

    let idToTargetNodes = idToTargetNodesFnc(nodes);
    let rScale = d3.scaleLinear()
        .domain([0,d3.max(Object.values(idToTargetNodes))])
        .range([5,25])

    nodes.forEach( d => {
        if (d.properties !== undefined) {
            d.latitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lat;
            d.longitude = countiesCentroids.get(d.properties.county) && countiesCentroids.get(d.properties.county).lon;
            d.date = parseTime(d.properties.diagnostic_date).getTime();
            d.name = +d.name;
            d.infected_persons = (idToTargetNodes[d.properties.case_no] + 1) || 1;
            d.r = rScale(d.infected_persons);
        } else {
            d.r = 3;
        };
    });
    nodes.sort((a,b) => a.date - b.date);

    var ed_data = d3.nest()
        .key(d => d.properties && d.properties.diagnostic_date)
        .entries(nodes);
    ed_data.forEach(key => {
        let valuesArr = [...key['values'] ].sort((a,b) => a.name - b.name);
        let valuesPerDay = valuesArr.map(d => {
                d.dayOrder = valuesArr.indexOf(d) + 1;
                return d;
            });
        formattedData.push(...valuesPerDay)
    });

    return formattedData;
};

export const idToNodeFnc = (graph) => {
    let dict = {};
    graph.nodes.forEach(n => dict[n.name] = n);
    return dict;
};

export const idToTargetNodesFnc = (nodes) => {
    return d3.nest()
        .key(d => d.properties && d.properties.source_no)
        .rollup(v => v.length)
        .object(nodes); // returns a nested object
};
