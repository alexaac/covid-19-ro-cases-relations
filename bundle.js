
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    // set the dimensions and margins of the graph
    const margin = { top: 100, left: 100, bottom: 50, right: 100 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom,
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

    const projection = d3.geoAlbers()
        .center([24.7731, 45.7909])
        .rotate([-14, 3.3, -10])
        .parallels([37, 54])
        .scale(5000)
        .translate([svg_width / 2, svg_height / 2]);

    const path = d3.geoPath()
        .projection(projection);

    const locale = d3.timeFormatLocale({
        'dateTime': '%A, %e %B %Y г. %X',
        'date': '%d.%m.%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
        'shortDays': ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa', 'Du'],
        'months': ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
        'shortMonths': ['Ian', 'Feb', 'Mart', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    });

    const formatMillisecond = locale.format('.%L'),
        formatSecond = locale.format(':%S'),
        formatMinute = locale.format('%I:%M'),
        formatHour = locale.format('%I %p'),
        formatDay = locale.format('%a %d'),
        formatWeek = locale.format('%b %d'),
        formatMonth = locale.format('%B'),
        formatYear = locale.format('%Y');

    const multiFormat = (date) => {
        return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
    };

    const formatNodes = (nodes, countiesCentroids) => {
        let parseTime = d3.timeParse('%d-%m-%Y');
        let formattedData = [];

        let idToTargetNodes = idToTargetNodesFnc(nodes);
        let rScale = d3.scaleLinear()
            .domain([0,d3.max(Object.values(idToTargetNodes))])
            .range([5,25]);

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
            }    });
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
            formattedData.push(...valuesPerDay);
        });

        return formattedData;
    };

    const idToNodeFnc = (graph) => {
        let dict = {};
        graph.nodes.forEach(n => dict[n.name] = n);
        return dict;
    };

    const idToTargetNodesFnc = (nodes) => {
        return d3.nest()
            .key(d => d.properties && d.properties.source_no)
            .rollup(v => v.length)
            .object(nodes); // returns a nested object
    };

    const infoHtml = (language) => {
        return language === 'ro'
        ? '<strong>Relația cazurilor confirmate</strong>.<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/><br/>Dați click în afara cercului pentru a deselecta.'
        : '<strong>Relationship between confirmed cases</strong>.<br/>The status until the date this information has been officially reported.<br/><br/>Click outside the circle to clear the selection.';
    };

    const status = (language) => {
        return language === 'ro'
            ? 'Stare'
            : 'Status';
    };

    const county = (language) => {
        return language === 'ro'
            ? 'Județ'
            : 'County';
    };

    const gender = (language) => {
        return language === 'ro'
            ? 'Gen'
            : 'Gender';
    };

    const age = (language) => {
        return language === 'ro'
            ? 'Vârstă'
            : 'Age';
    };

    // use a tooltip to show node info
    const tooltip_div = d3.select('body')
       .append('tooltip_div')
       .attr('class', 'tooltip')
       .style('opacity', 0)
       .style('display', 'none');

    const highlight = (d, cases) => {
        let positioning = d3.select('#positioning').node().value;

        if (positioning === 'clusters') {
            return;
        }
        let left = d3.event.pageX -20;
        let top = d3.event.pageY + 20;
     
        let caseId = d.name;

        if (window.innerWidth - left < 150){
            left = d3.event.pageX - 40;
        }
     
        d3.selectAll('.nodes')
            .attr('r', d => d.r)
            .style('opacity', 0.3);
        d3.selectAll('.links')
            .style('stroke', '#999')
            .style('opacity', 0.3);
        d3.selectAll('.node-labels > text')
            .style('opacity', 0.3);

        tooltip_div.transition()
            .duration(200)
            .style('opacity', .9);

        d3.select('#CO-' + caseId)
            .attr('r', d => 2 * d.r)
            .style('opacity', 1);
        d3.selectAll('.CO-labels-self-' + caseId)
            .style('opacity', '1');
        d3.selectAll('.CO-links-' + caseId)
            .style('stroke', 'firebrick')
            .transition()
                .duration(200)
                .attr('stroke-dashoffset', 0)
                .style('opacity', 1)
                .on('end', (d, i) => {
                    if (i === 0) {
                        d3.selectAll('.CO-nodes-' + caseId)
                            .style('opacity', '1');
                        d3.selectAll('.CO-labels-' + caseId)
                            .style('opacity', '1');
                    }            });

        // adjust the text on the range slider
        let name = cases.indexOf(caseId);
        d3.select('#nRadius-value').text(caseId);
        d3.select('#nRadius').property('value', name);

        tooltip_div.html(tooltipHTML(d))
            .style('left', left + 'px')
            .style('top', top + 'px')
            .style('display', null);
    };

    const tooltipHTML = (d) => {
        if (d.properties !== undefined) {
            let language = d3.select('#language').node().value;

            let labels = {
                cazulLabel: { 'ro': 'Cazul', 'en': 'Case' },
                maleLabel: { 'ro': 'Bărbat', 'en': 'Male' },
                femaleLabel: { 'ro': 'Femeie', 'en': 'Female' },
                unspecLabel: { 'ro': 'Gen nespecificat', 'en': 'Unspecified gender' },
                statusLabel: { 'ro': 'Stare', 'en': 'Status' },
                releasedLabel: { 'ro': 'vindecat', 'en': 'released' },
                confirmedLabel: { 'ro': 'confirmat', 'en': 'confirmed' },
                deceasedLabel: { 'ro': 'deces', 'en': 'deceased' },
                confdateLabel: { 'ro': 'Data confirmării', 'en': 'Confirmation date' },
                recoverydateLabel: { 'ro': 'Data recuperării', 'en': 'Recovery date' },
                infectionCountryLabel: { 'ro': 'Țara de infectare', 'en': 'Country of infection' },
                detailsLabel: { 'ro': 'Detalii', 'en': 'Details' },
                aiciLabel: { 'ro': 'aici', 'en': 'here' },
            };

            let genderInfo = d.properties.gender === 'Bărbat'
                    ? labels.maleLabel[language]
                    : (d.properties.gender === 'Femeie'
                        ? labels.femaleLabel[language]
                        : labels.unspecLabel[language]),
                ageInfo = d.properties.age != null && d.properties.age != 0
                    ? (', ' + d.properties.age)
                    : '',
                countyInfo = d.properties.county != null && d.properties.county != ''
                    ? (', ' + d.properties.county)
                    : '',
                statusInfo = d.properties.status != null
                    ? (labels.statusLabel[language] + ': ' + (d.properties.status === 'Vindecat'
                            ? labels.releasedLabel[language]
                            : (d.properties.status === 'Confirmat'
                                ? labels.confirmedLabel[language]
                                : labels.deceasedLabel[language])) + '.<br />')
                    : '',
                diagnosticDateInfo = d.properties.diagnostic_date !== null
                    ? (labels.confdateLabel[language] + ': ' + d.properties.diagnostic_date + '.<br />')
                    : '',
                healingDateInfo = d.properties.healing_date !== null
                    ? (labels.recoverydateLabel[language] + ': ' + d.properties.healing_date + '.<br />')
                    : '',
                countyOfInfectionInfo = d.properties.country_of_infection !== null 
                                        && d.properties.country_of_infection !== 'România'
                                        && d.properties.country_of_infection !== 'Romania'
                    ? (labels.infectionCountryLabel[language] + ': ' + d.properties.country_of_infection + '.<br />')
                    : '',
                referenceInfo = d.properties.reference !== null && d.properties.reference !== ''
                    ? (labels.detailsLabel[language] + ': ' + '<a href="' + d.properties.reference + '" target= "_blank">'+ labels.aiciLabel[language] +'</a>')
                    : '';

            return '<b>' + labels.cazulLabel[language] + ' ' + d.properties.case_no + '</b>' +
                // genderInfo + ageInfo +
                countyInfo + '.<br />' +
                statusInfo +
                diagnosticDateInfo +
                healingDateInfo +
                countyOfInfectionInfo +
                referenceInfo
            ;
        } else {
            return d.name;
        }};

    const unHighlight = () => {
        d3.selectAll('.nodes')
            .style('opacity', 1);
        d3.selectAll('.link')
            .style('opacity', 1);
        d3.selectAll('.node-labels > text')
            .style('opacity', '1');
    };

    const hideTooltip = () => {
        d3.selectAll('.nodes')
            .attr('r', d => d.r);
        tooltip_div.transition()
            .duration(200)
            .style('opacity', 0);
    };

    const highlightSearchedId = (caseId) => {
        d3.select('#CO-' + caseId)
            .dispatch('mouseover');
            // .dispatch('click');
    };

    const toggleInfo = (infoStatus) => {
        if (infoStatus === true) {
            tooltip_div.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip_div.html(infoHtml(language))
                .style('left', svg_width / 2 + 'px')
                .style('top', svg_height / 2 + 'px')
                .style('display', null);
            infoStatus = false;
        } else {
            tooltip_div.transition()
                .duration(200)
                .style('opacity', 0);
            infoStatus = true;
        }

        return infoStatus;
    };

    const hovered = (hover) => {
        return (d) => {
            d3.selectAll(d.ancestors().map(d => d.node)).classed('node--hover', hover);
        };
    };

    const graphSimulation = (graph) => {
        return d3.forceSimulation(graph.nodes)
            .force('link', d3.forceLink(graph.links).id( d => d.name))
            .force('center', d3.forceCenter(svg_width / 2, svg_height / 2))
            .force('charge', d3.forceManyBody())
            // .force('collision', d3.forceCollide().radius(d => d.radius))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .alphaDecay([0.02]);
    };

    const packSimulation = () => {
        return d3.forceSimulation()
        .force('collision', d3.forceCollide()
            .radius(d => d.radius )
            .strength(0.01))
        .force('attract', d3.forceAttract()
            .target(d => [d.foc_x, d.foc_y])
            .strength(0.5));
    };

    // simulation link
    const linkArc = (d) => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
    };

    const update = (idToNode, nodes, links, labels, positioning, xScale, yScale) => {

        links.attr('d', d => {
            if (positioning === 'arcs') {
                if (typeof(d.source.name) === 'string') {
                    return linkArc(d)
                } else {
                    let start = xScale(idToNode[d.source.name].date) || 0;
                    let end = xScale(idToNode[d.target.name].date);
                    const arcPath = ['M', start, yScale(idToNode[d.source.name].dayOrder), 'A', (start - end)/2, ',', (start-end)/2, 0,0,',',
                                start < end ? 1: 0, end, yScale(idToNode[d.target.name].dayOrder)].join(' ');
                    return arcPath;
                }
            } else {
                return linkArc(d)
            }
        });
        nodes.attr('transform', d => `translate(${d.x},${d.y})`);
        labels.attr('transform', d => `translate(${d.x},${d.y})`);
    };

    const statusColor = (language) => {
        return language === 'ro'
            ? d3.scaleOrdinal(['var(--main-confirmate)', 'var(--main-recuperari)', 'var(--main-decese)']).domain(['Confirmat', 'Vindecat', 'Decedat'])
            : d3.scaleOrdinal(['var(--main-confirmate)', 'var(--main-recuperari)', 'var(--main-decese)']).domain(['Confirmed', 'Discharged', 'Deceased']);
    };

    // https://medialab.github.io/iwanthue/
    // hcl[0]>=0 && hcl[0]<=340
    //     && hcl[1]>=30 && hcl[1]<=80
    //     && hcl[2]>=35 && hcl[2]<=100
    const countyColors = [
        '#e4588c', '#35d394', '#ba1ea8', '#4caf1c', '#1848ca', '#aad42b', '#9b85ff', '#068400', '#8b2487', '#97ff8b', '#d60042', '#00ae87', '#f94740', '#48d3ff', '#d17300', '#5ea2ff', '#cfb100', '#53498f', '#ffe353', '#325383', '#86a700', '#ff9eeb', '#007f30', '#d9b6ff', '#3b5c12', '#89c2ff', '#964000', '#00bfbb', '#ff6f54', '#01aac6', '#ffb65d', '#008857', '#ff8e90', '#145f36', '#952e31', '#fffea6', '#8e3440', '#5a936f', '#883d0c', '#ffaf81', '#34a6c2', '#b09764', '#458a18'
    ];
    const counties = [
        'ALBA', 'ARAD', 'ARGEȘ', 'BACĂU', 'BIHOR', 'BISTRIȚA-NĂSĂUD', 'BOTOȘANI', 'BRAȘOV', 'BRĂILA', 'BUCUREȘTI', 'BUZĂU', 'CARAȘ-SEVERIN', 'CLUJ', 'CONSTANȚA', 'COVASNA', 'CĂLĂRAȘI', 'DOLJ', 'DÂMBOVIȚA', 'GALAȚI', 'GIURGIU', 'GORJ', 'HARGHITA', 'HUNEDOARA', 'IALOMIȚA', 'IAȘI', 'ILFOV', 'NECUNOSCUT', 'MARAMUREȘ', 'MEHEDINȚI', 'MUREȘ', 'NEAMȚ', 'OLT', 'PRAHOVA', 'SATU MARE', 'SIBIU', 'SUCEAVA', 'SĂLAJ', 'TELEORMAN', 'TIMIȘ', 'TULCEA', 'VASLUI', 'VRANCEA', 'VÂLCEA'
    ];
    const countyColor = d3.scaleOrdinal(countyColors).domain(counties);

    const genderColor = (language) => {
        return language === 'ro'
            ? d3.scaleOrdinal(['var(--main-barbat)', 'var(--main-femeie)']).domain(['Bărbat', 'Femeie'])
            : d3.scaleOrdinal(['var(--main-barbat)', 'var(--main-femeie)']).domain(['Male', 'Female']);
    };

    const ageColor = d3.scaleQuantile()
        .domain([0, 100])
        .range(d3.schemeSpectral[10]);

    const colorStatus = () => {
        let svg = d3.select('#chart').select('svg');

        svg.selectAll('.nodes')
            .transition().duration(100)
            .attr('fill', d => {
                return (d.is_country_of_infection)
                    ? 'black'
                    : d.properties ? statusColor('ro')(d.properties.status) : ''
            });

        showLegend('status-legend');
    };

    const colorCounties = () => {
        let svg = d3.select('#chart').select('svg');

        svg.selectAll('.nodes')
            .transition().duration(100)
            .attr('fill', d => {
                return (d.is_country_of_infection)
                    ? 'black'
                    : d.properties ? countyColor(d.properties.county) : ''
            });

        showLegend('county-legend');
    };

    const colorGender = () => {
        let svg = d3.select('#chart').select('svg');

        svg.selectAll('.nodes')
            .transition().duration(100)
            .attr('fill', d => {
                return (d.is_country_of_infection)
                    ? 'black'
                    : d.properties
                        ? d.properties.gender === null
                            ? 'var(--main-null)'
                            : genderColor('ro')(d.properties.gender)
                        : ''
            });

        showLegend('gender-legend');
    };

    const colorAge = () => {
        let svg = d3.select('#chart').select('svg');

        svg.selectAll('.nodes')
            .transition().duration(100)
            .attr('fill', d => {
                return (d.is_country_of_infection)
                    ? 'black'
                    : d.properties
                        ? d.properties.age === null
                            ? 'var(--main-null)'
                            : ageColor(d.properties.age)
                        : ''
            });

        showLegend('age-legend');
    };

    const createLegend = (colorScale, height, vbHeight, legendClass, legendTitle) => {

        const legend = d3.select('#legend-div')
            .append('div')
                .attr('class', legendClass)
            .append('svg')
                .attr('class', 'category-legend')
                .attr('width', 110)
                .attr('height', height)
                .attr('preserveAspectRatio', 'xMidYMid')
                .attr('viewBox', '-10, -10 ' + 120 + ' ' + vbHeight)
                .attr('x', 0)
                .attr('y', 0);

        const categoryLegend = d3.legendColor()
                                .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                                .shapePadding(10)
                                .title(legendTitle)
                                .titleWidth(100)
                                .labelFormat(d3.format('.0f'))
                                .labelAlign('start')
                                .scale(colorScale);

        legend.call(categoryLegend);
    };

    const showLegend = category => {
        d3.select('.county-legend').classed('hide', true);
        d3.select('.status-legend').classed('hide', true);
        d3.select('.gender-legend').classed('hide', true);
        d3.select('.age-legend').classed('hide', true);

        if (category === 'county-legend') {
            d3.select('.county-legend').classed('hide', false);
        } else if (category === 'status-legend') {
            d3.select('.status-legend').classed('hide', false);
        } else if (category === 'gender-legend') {
            d3.select('.gender-legend').classed('hide', false);
        } else if (category === 'age-legend') {
            d3.select('.age-legend').classed('hide', false);
        }
    };

    const updateRadius = (cases, nRadius) => {
        // adjust the text on the range slider
        d3.select('#nRadius-value').text(cases[nRadius]);
        d3.select('#nRadius').property('value', cases[nRadius]);
        d3.select('#search-input').property('value', cases[nRadius]);

        // highlight case
        d3.selectAll('.nodes')
            .attr('r', d => d.r);
        d3.select('#CO-' + cases[nRadius])
            .attr('r', d => 2 * d.r)
            .dispatch('mouseover');
            // .dispatch('click');
    };

    const zoomed = () => {
        let zoomableGroup = d3.selectAll('.zoomable-group');
        let scale = d3.event.transform.k;

        zoomableGroup.attr('transform', 'translate(' + 0 + ') scale(' + scale + ')');
        if (scale > 0.8) {
            zoomableGroup.selectAll('.node-labels > text')
                .attr('transform', 'scale(' + (1 / scale) + ')');
            zoomableGroup.selectAll('.labels > text')
                .attr('transform', 'scale(' + (1 / scale) + ')');
        }    return hideLabels(scale);
    };

    const hideLabels = (z) => {
        d3.selectAll('.node-labels')
            .classed('hidden', d => {
                if (typeof(d.name) !== 'string') {
                    return z <= 1.9;
                } else {
                    return false;
                }
            });
        d3.selectAll('.labels')
            .classed('hidden', d => d.r < 10 / z);
    };

    const zoom = d3.zoom()
        .scaleExtent([0.2, 10])
        .on('zoom', zoomed);

    const resetZoom = () => {
        let svg = d3.select('#chart').select('svg');

        svg.call(zoom.scaleTo, 0.5);
    };

    const panTo = d => {
        let svg = d3.select('#chart').select('svg');

        d3.event.stopPropagation();
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity.translate(svg_width / 2, svg_height / 2)
                .scale(2)
                .translate(-d.x, -d.y),
            d3.mouse(svg.node())
        );
    };

    const fixed = (nodes, positioning, immediate, idToNode, xScale, yScale) => {
        if (positioning === 'map' || positioning === 'clusters') {
            nodes.forEach(function (d) {
                const pos = projection([d.longitude, d.latitude]);
                d.x = pos[0] || d.x;
                d.y = pos[1] || d.y;
            });
        } else {
            nodes.forEach(function (d) {
                d.x = xScale(d.date) || -100;
                d.y = yScale(d.dayOrder);
            });
        }

        const t = d3.transition()
            .duration(immediate ? 0 : 800)
            .ease(d3.easeElastic.period(0.5));

        update(idToNode, d3.selectAll('.nodes').transition(t), d3.selectAll('.links').transition(t), d3.selectAll('.node-labels').transition(t), positioning, xScale, yScale);

    };

    const showMap = (graph, simulation, idToNode, xScale, yScale) => {
        let positioning = 'map';

        d3.select('#positioning').attr('value', 'map');

        simulation.stop();
        resetZoom();

        d3.selectAll('.nodes-group').style('opacity', 1);
        d3.selectAll('.land').attr('opacity', 1);
        d3.selectAll('.time-graph').attr('opacity', 0);
        d3.selectAll('.pack-group').attr('transform', 'translate(-10000,-10000)');
        
        fixed(graph.nodes, positioning, 0, idToNode, xScale, yScale);
    };

    const showMapClusters = (graph, simulation, idToNode, xScale, yScale) => {
        let positioning = 'clusters';
        d3.select('#positioning').attr('value', 'map');

        simulation.stop();
        resetZoom();

        d3.selectAll('.nodes-group').style('opacity', 1);
        d3.selectAll('.land').attr('opacity', 1);
        d3.selectAll('.time-graph').attr('opacity', 0);
        d3.selectAll('.pack-group').attr('opacity', 1);
        
        fixed(graph.nodes, positioning, 0, idToNode, xScale, yScale);

        d3.selectAll('.nodes-group').style('opacity', 0);
    };

    const showGraph = (simulation) => {
        d3.select('#positioning').attr('value', 'diagram');

        simulation.alpha(1).restart();
        setTimeout(() => {
            simulation.stop();
        }, 5000);

        resetZoom();

        d3.selectAll('.nodes-group').style('opacity', 1);
        d3.selectAll('.land').attr('opacity', 0.25);
        d3.selectAll('.time-graph').attr('opacity', 0);
        d3.selectAll('.pack-group').attr('transform', 'translate(-10000,-10000)');
    };

    const showArcs = (graph, simulation, idToNode, xScale, yScale) => {
        let positioning = 'arcs';
        d3.select('#positioning').attr('value', 'arcs');

        simulation.stop();
        resetZoom();

        d3.selectAll('.nodes-group').style('opacity', 1);
        d3.selectAll('.land').attr('opacity', 0.25);
        d3.selectAll('.time-graph').attr('opacity', 1);
        d3.selectAll('.pack-group').attr('transform', 'translate(-10000,-10000)');
        
        fixed(graph.nodes, positioning, 0, idToNode, xScale, yScale);
    };

    const CirclesPacks = (geoCounties, graphNodes) => {
        let root,
        pack,
        packGroup,
        counties_list = {},
        countyCasesData = [],
        groupedByCountySource,
        sec_simulation,
        bubbles, en_bubbles, bubble_labels, en_bubble_labels;

        let zoomableGroup = d3.select('svg').select('.zoomable-group');

        packGroup = zoomableGroup.append('g')
            .attr('class', 'pack-group')
            .attr('opacity', 0);

        sec_simulation = packSimulation();

        groupedByCountySource = d3.nest()
            .key( d => d.properties && d.properties.county)
            .key( d => d.properties && d.properties.source_no)
            .entries(graphNodes);
        groupedByCountySource.forEach(key => counties_list[key.key] = 1);

        // Create a list containing the counties, the cases and root
        countyCasesData.push({
            id: 'root',
            parent: ''
        });

        geoCounties.forEach(d => {
            if (counties_list[d.id] !== undefined) {
                return countyCasesData.push({
                    id: d.id,
                    parent: 'root',
                    d: d
                });
            }
        });

        groupedByCountySource.forEach(key => {
            if (key.key !== 'undefined') {
                let valuesArr = [...key['values'] ]
                    .filter(d => d.key !== 'null')
                    .sort((a,b) => a.name - b.name);
                valuesArr.forEach(d => {
                    countyCasesData.push({
                        id: d.key,
                        parent: key.key,
                        source_case: d,
                        value: d.values.length
                    });
                });
            }    });

        // Stratify the list
        root = (d3.stratify()
            .id(d => d.id)
            .parentId(d => d.parent))(countyCasesData);
        root.sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        // Pack
        pack = d3.pack()
            .size([svg_width/2, svg_height/2])
            .padding(8);
        pack(root);

        // Define circles relations
        root.eachBefore(d => {
            if (d.parent != null) {
                d.relx = d.x - d.parent.x;
                return d.rely = d.y - d.parent.y;
            } else {
                d.relx = d.x;
                return d.rely = d.y;
            }
        });
        root.eachBefore(d => {
            if ((d.parent != null) && d.parent.id === 'root') {
            return d.data.d.force.r = d.r;
            }
        });

        let language = d3.select('#language').node().value;

        // Draw the circle packs
        bubbles = packGroup.selectAll('.bubble')
            .data(root.descendants())
            .enter().append('g')
            .each(function(d) { d.node = this; })
            .on('mouseover', hovered(true))
            .on('mouseout', hovered(false));
        en_bubbles = bubbles.append('circle')
            .attr('class', 'bubble')
            .attr('r', d => d.r)
            .on('touchmove mouseover', d => highlightSearchedId(d.id))
            .attr('fill', d => d.parent && d.parent.id !== 'root' ? countyColor(d.parent.id) : '#E8E8E8');
        en_bubbles.append('title').text(d => (language === 'ro'
                    ? d.data.parent + ' - sursa ' + d.id + '\n' + d.value + ' cazuri'
                    : d.data.parent + ' - source ' + d.id + '\n' + d.value + ' cases'));
        bubble_labels = packGroup.selectAll('.labels').data(root.leaves());
        en_bubble_labels = bubble_labels.enter().append('g').attr('class', 'labels');

        en_bubble_labels.append('text')
            .text(d => d.value)
            .attr('dy', '0.35em');
        hideLabels(1);

        // Move the circles to their place
        sec_simulation.nodes(geoCounties.map(d => d.force)).stop();
        let i,j,ref;
        for (i = j = 0, ref = Math.ceil(Math.log(sec_simulation.alphaMin()) / Math.log(1 - sec_simulation.alphaDecay())); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            sec_simulation.tick();
        }
    };

    const GroupCirclesPack = () => {
        d3.select('.pack-group').attr('transform', 'scale(2)');
        d3.selectAll('.bubble').attr('transform', d => `translate(${d.x},${d.y})`);
        d3.selectAll('.labels').attr('transform', d => `translate(${d.x},${d.y})`);
    };

    const MapCirclesPack = () => {
        d3.select('.pack-group').attr('transform', 'scale(1)');
        d3.selectAll('.bubble').attr('transform', d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : 'translate(-10000,-10000)');
        d3.selectAll('.labels').attr('transform', d => d.parent && d.parent.data.d ? `translate(${d.relx + d.parent.data.d.force.x},${d.rely + d.parent.data.d.force.y})` : 'translate(-10000,-10000)');
    };

    const CountiesMap = (geoCounties, geojsonFeatures) => {
        let zoomableGroup = d3.select('svg').select('.zoomable-group');

        const thisMapPath = d3.geoPath()
            .projection(
                projection
                      .fitSize([svg_width , svg_height], geojsonFeatures));

        const mapFeatures = zoomableGroup.append('g')
            .attr('class', 'map-features')
            .selectAll('path')
                .data(geoCounties)
                .enter()
                .append('path')
                .attr('d', thisMapPath)
                    .attr('class', 'land')
                    .attr('opacity', 0.25);

        mapFeatures.append('title').text(d => d.id);
    };

    const TimeLine = (xScale, yScale) => {
        let zoomableGroup = d3.select('svg').select('.zoomable-group');

        let language = d3.select('#language').node().value;

        const timeGraph = zoomableGroup.append('g')
            .attr('class', 'time-graph')
            .attr('opacity', 0);

        const xLabel = timeGraph.append('text')
            .attr('y', svg_height + 70)
            .attr('x', svg_width / 2)
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .text(language === 'ro' ? 'Ziua' : 'Day');
        const xAxis = timeGraph.append('g')
            .attr('transform', `translate(0,${svg_height})`)
            .call(d3.axisBottom(xScale)
                .ticks(30)
                .tickFormat(multiFormat));
        xAxis.selectAll('text')
            .attr('class', 'time-graph-x')
            .attr('font-weight', 'bold')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('transform', 'rotate(-65)');
        const yAxis = timeGraph.append('g')
            .call(d3.axisLeft(yScale)
                .ticks(10));
        yAxis.selectAll('text')
            .attr('class', 'time-graph-y')
            .attr('font-weight', 'bold');
        const yLabel = timeGraph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .attr('x', -svg_height / 2)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text(language === 'ro' ? 'Cazuri ordonate pe zi' : 'Ordered cases per day');
    };

    const NodesAndLinks = (graph, cases, simulation, positioning) => {
        let links, nodes;

        let zoomableGroup = d3.select('svg').select('.zoomable-group');
        let nodesGroup = zoomableGroup.append('g')
            .attr('class', 'nodes-group');

        // Add arrows for links
        const markerTypes = Array.from(new Set(graph.nodes.map(d => d.source)));
        nodesGroup.append('defs').selectAll('marker')
            .data(markerTypes)
                .join('marker')
                    .attr('id', d => `arrow-${d}`)
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 15)
                    .attr('refY', -0.5)
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('fill', '#999')
                    .attr('d', 'M0,-5L10,0L0,5');
        
        links = nodesGroup.append('g')
                .attr('class', 'link')
                .selectAll('path')
                .data(graph.links)
                .join('path')
                    .attr('class', d => `CO-links-${d.source.name}`)
                    .classed('links', true)
                    .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location.toString())})`);
        links.exit().remove();

        nodes = nodesGroup.append('g')
            .attr('class', 'node')
            .selectAll('g')
            .data(graph.nodes)
            .join('g');
                // .call(Simulation.drag(simulation, positioning));

        nodes.append('circle')
            .attr('id', d => d.properties && `CO-${d.properties.case_no}`)
            .attr('class', d => d.properties && `CO-nodes-${d.properties.source_no}`)
            .classed('nodes', true)
            .attr('r', d => d.r)
            .on('touchmove mouseover', d => highlight(d, cases))
            .on('click', d => panTo(d));

        nodes.append('g')
            .classed('node-labels', true)
            .append('text')
                .attr('class', d => d.properties && `CO-labels-${d.properties.source_no} CO-labels-self-${d.properties.case_no}`)
                .attr('x', 8)
                .attr('y', '0.31em')
                .text(d => d.name)
                .clone(true).lower();

        nodes.exit().remove();
    };

    let graph = {nodes: [], links: []};
    let svg, simulation, xScale, yScale, zoomableGroup, idToNode;
    let sources, casesData, geoData, layer, geoCounties, geojsonFeatures;
    let cases;
    let countiesCentroids = d3.map();

    let legendStatus = false, infoStatus = true, searchStatus = true;
    let playCasesNow, thisCaseId, thisCaseOrder;

    let positioning = d3.select('#positioning').node().value;

    // Switch the language to english/romanian
    let language$1 = d3.select('#language').node().value;
    let countiesSource = language$1 === 'ro' ? 'data/judete_wgs84.json' : '../data/judete_wgs84.json';

    (() => {

    // Options for loading spinner
    let opts = {lines: 9, length: 4, width: 5, radius: 12, scale: 1, corners: 1, color: '#f40000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 30, fps: 20, zIndex: 2e9, className: 'spinner', shadow: false, hwaccel: false, position: 'absolute'},
        target = document.getElementById('spinner'),
        spinner;

    // Load data
    const promises = [
        d3.json(countiesSource),
        d3.json('https://covid19.geo-spatial.org/api/statistics/getCaseRelations')
    ];

    Promise.all(promises).then( data => {
        geoData = data[0];
        casesData = data[1];

        spinner = new Spinner(opts).spin(target);
        setupGraph();
        drawGraph();
        setTimeout(setActions(), 100);
    }).catch(
        error => console.log(error)
    );

    const setupGraph = () => {

        sources = casesData.data.nodes.filter( d => d.properties.country_of_infection !== null && d.properties.country_of_infection !== 'România' && d.properties.country_of_infection !== 'Romania');

        graph.nodes = casesData.data.nodes;
        graph.links = casesData.data.links;

        cases = Array.from(new Set(graph.nodes.map(d => d.properties ? +d.properties.case_no : '')));

        // https://observablehq.com/d/cedc594061a988c6
        graph.nodes = graph.nodes.concat(Array.from(new Set(sources.map(d => d.properties.country_of_infection)), name => ({name})));
        graph.links = graph.links.concat(sources.map(d => ({target: d.name, source: d.properties.country_of_infection})));

        layer = 'judete_wgs84';
        geoCounties = topojson.feature(geoData, geoData.objects[layer]).features;
        geojsonFeatures = topojson.feature(geoData, {
            type: 'GeometryCollection',
            geometries: geoData.objects[layer].geometries
        });

        geoCounties.forEach( d => {
            let county = d.properties.county;
            // Get lat, lon for nodes within county
            countiesCentroids.set(county, {
                lat: d.properties.lat,
                lon: d.properties.lon,
            });
            d.id = county;
            d.centroid = projection.fitSize([svg_width, svg_height], geojsonFeatures)([d.properties.lon, d.properties.lat]);
            // Set force for group by county
            d.force = {};
            d.force.x = d.centroid[0];
            d.force.y = d.centroid[1];
            d.force.foc_x = d.centroid[0];
            d.force.foc_y = d.centroid[1];
        });

        graph.nodes = formatNodes(graph.nodes, countiesCentroids);
    };

    const drawGraph = () => {
        // Setup the simulation
        // https://gist.github.com/mbostock/1153292
        const ticked = () => {
            update(idToNode, d3.selectAll('.nodes'), d3.selectAll('.links'), d3.selectAll('.node-labels'), positioning, xScale, yScale);
        };

        simulation = graphSimulation(graph);
        simulation.on('tick', ticked);
        simulation.force('link').links(graph.links);

        // Append the svg object to the chart div
        svg = d3.select('#chart')
            .append('svg')
                .attr('class', 'chart-group')
                .attr('preserveAspectRatio', 'xMidYMid')
                .attr('width', svg_width)
                .attr('height', svg_height)
                .attr('viewBox', '0, 0 ' + svg_width + ' ' + svg_height)
                .on('click', () => { unHighlight(); hideTooltip(); });

        // Append zoomable group
        zoomableGroup = svg.append('g')
            .attr('class', 'zoomable-group')
            .style('transform-origin', '50% 50% 0');

        // Map nodes name with nodes details
        idToNode = idToNodeFnc(graph);
    };

    const setActions = () => {

        // Add legends
        createLegend(statusColor(language$1), 300, 300, 'status-legend', status(language$1));
        createLegend(countyColor, 900, 1100, 'county-legend', county(language$1));
        createLegend(genderColor(language$1), 200, 200, 'gender-legend', gender(language$1));
        createLegend(ageColor, 400, 400, 'age-legend', age(language$1));

        // Set scales for nodes by time
        xScale = d3.scaleTime()
            .domain(d3.extent(graph.nodes, d => d.date))
            .range([0, svg_width]);
        yScale = d3.scaleLinear()
            .domain(d3.extent(graph.nodes, d => d.dayOrder))
            .range([svg_height, 0]);

        // Zoom by scroll, pan
        d3.select('#zoom-in')
            .on('click', () => svg.transition().call(zoom.scaleBy, 2));
        d3.select('#zoom-out')
            .on('click', () => svg.transition().call(zoom.scaleBy, 0.5));
        d3.select('#reset-zoom').on('click', () => resetZoom());

        // Apply zoom handler and zoom out
        svg.call(zoom);
        resetZoom();

        // Toggle between map, graph and timeline chart
        d3.select('#show-map')
            .on('click', () => showMap(graph, simulation, idToNode, xScale, yScale));
        d3.select('#show-map-clusters')
            .on('click', () => {
                showMapClusters(graph, simulation, idToNode, xScale, yScale);
                MapCirclesPack();
            });
        d3.select('#show-clusters')
            .on('click', () => {
                showMapClusters(graph, simulation, idToNode, xScale, yScale);
                d3.selectAll('.land').attr('opacity', 0.5);
                GroupCirclesPack();
            });
        d3.select('#show-graph')
            .on('click', () => showGraph(simulation));
        d3.select('#show-arcs')
            .on('click', () => showArcs(graph, simulation, idToNode, xScale, yScale));

        // Change colors from status to counties and vice versa
        d3.select('#color-counties')
            .on('click', () => colorCounties());
        d3.select('#color-status')
            .on('click', () => colorStatus());
        d3.select('#color-gender')
            .on('click', () => colorGender());
        d3.select('#color-age')
            .on('click', () => colorAge());

        // Toggle the legend
        const toggleLegend = () => {
            if (legendStatus === true) {
                d3.select('#legend-div').classed('hide', true);
                legendStatus = false;
            } else {
                d3.select('#legend-div').classed('hide', false);
                legendStatus = true;
            }    };
        d3.select('#legend-div').classed('hide', true);
        d3.select('#toggle-legend')
            .on('click', () => toggleLegend());

        // Highlight and pan to searched Id
        d3.select('#search-case')
            .on('click', () => {
                if (searchStatus === true) {
                    d3.select('#search-input').classed('hide', false);
                    searchStatus = false;
                } else {
                    d3.select('#search-input').classed('hide', true);
                    searchStatus = true;
                }        });
        d3.select('#search-input')
            .on('input', () => {
                if (cases.includes(+undefined.value)) {
                    highlightSearchedId(+undefined.value);
                }
            });

        // General page info
        d3.select('#show-info').on('click', () => infoStatus = toggleInfo(infoStatus));

        // Start/stop the animation - highlight the cases ordered by day and case number
        d3.select('#play-cases')
            .on('click', () => {
                d3.select('#play-cases').classed('hide', true);
                d3.select('#pause-cases').classed('hide', false);
                playCases();
            });
        d3.select('#pause-cases')
            .on('click', () => {
                d3.select('#pause-cases').classed('hide', true);
                d3.select('#play-cases').classed('hide',false);
                pauseCases();
            });

        const playCases = () => {
            svg.call(zoom.scaleTo, 0.5);
            thisCaseOrder = d3.select('#nRadius').node().value;
            if (+thisCaseOrder === (+cases.length - 1)) thisCaseOrder = 0;

            playCasesNow = setInterval(() => {
                thisCaseId = cases[thisCaseOrder];
                if (thisCaseId !== undefined) {
                    updateRadius(cases, thisCaseOrder);
                    thisCaseOrder++;
                } else {
                    thisCaseOrder = 0;
                }
            }, 200);
        };
        const pauseCases = () => {
            clearInterval(playCasesNow);
        };

        // Case slider to highlight nodes by id
        // https://bl.ocks.org/d3noob/c4b31a539304c29767a56c2373eeed79/9d18fc47e580d8c940ffffea1179e77e62647e36

        // When the input range changes highlight the circle
        d3.select('#nRadius').on('input', function() {
            updateRadius(cases, +this.value);
        });
        d3.select('#nRadius').property('max', cases.length-1);
        updateRadius(cases, cases.length-1);


        // Draw cases by time
        TimeLine(xScale, yScale);

        // Draw counties map
        CountiesMap(geoCounties, geojsonFeatures);

        // Draw nodes and links
        NodesAndLinks(graph, cases);

        // Define the secondary simulation, for county groups
        CirclesPacks(geoCounties, graph.nodes);

        // Color the legend for counties
        colorStatus();

        // Hide case labels first
        hideLabels(1);


        // Zoom to latest case, when loading spinner stops
        setTimeout(() => {
            simulation.stop();
            spinner.stop();
            d3.select('tooltip_div').classed('tooltip-abs', true);
            d3.select('#CO-' + d3.max(cases))
                .attr('r', d => 2 * d.r)
                .dispatch('mouseover');
        }, 5000);

    };

    }).call(undefined);

}());
//# sourceMappingURL=bundle.js.map
