export const formatNodes = (nodes) => {
    let parseTime = d3.timeParse('%d-%m-%Y');
    let formattedData = [];

    let idToTargetNodes = idToTargetNodesFnc(nodes);

    let rScale = d3.scaleSqrt()
        .domain([0,d3.max(Object.values(idToTargetNodes))])
        .range([5,25])

    nodes.forEach( d => {
        if (d.properties !== undefined) {
            d.date = parseTime(d.properties.diagnostic_date).getTime();
            d.name = +d.name;
            d.infected_persons = (idToTargetNodes[d.properties.case_no]) || 0;
            d.r = rScale(d.infected_persons || 1);
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

export const idToTargetNodesFnc = (nodes) => {
    return d3.nest()
        .key(d => d.properties && d.properties.source_no)
        .rollup(v => v.length)
        .object(nodes); // returns a nested object
};
