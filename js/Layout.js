import * as Config from './Config.js';

export const statusColor = (language) => {
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
export const countyColor = d3.scaleOrdinal(countyColors).domain(counties);

export const genderColor = (language) => {
    return language === 'ro'
        ? d3.scaleOrdinal(['var(--main-barbat)', 'var(--main-femeie)']).domain(['Bărbat', 'Femeie'])
        : d3.scaleOrdinal(['var(--main-barbat)', 'var(--main-femeie)']).domain(['Male', 'Female']);
};

export const ageColor = d3.scaleQuantile()
    .domain([0, 100])
    .range(d3.schemeSpectral[10]);

export const colorStatus = () => {
    let svg = d3.select('#chart').select('svg');

    svg.selectAll('.nodes')
        .transition().duration(100)
        .attr('fill', d => {
            return (d.is_country_of_infection)
                ? 'black'
                : d.properties ? statusColor('ro')(d.properties.status) : ''
        });

    showLegend('status-legend');
}

export const colorCounties = () => {
    let svg = d3.select('#chart').select('svg');

    svg.selectAll('.nodes')
        .transition().duration(100)
        .attr('fill', d => {
            return (d.is_country_of_infection)
                ? 'black'
                : d.properties ? countyColor(d.properties.county) : ''
        });

    showLegend('county-legend');
}

export const colorGender = () => {
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
}

export const colorAge = () => {
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
}

export const createLegend = (colorScale, height, vbHeight, legendClass, legendTitle) => {

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
}

export const showLegend = category => {
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
}

export const updateRadius = (cases, nRadius) => {
    // adjust the text on the range slider
    d3.select('#nRadius-value').text(cases[nRadius]);
    d3.select('#nRadius').property('value', cases[nRadius]);
    d3.select('#search-input').property('value', cases[nRadius]);

    // highlight case
    d3.selectAll('.nodes')
        .attr('r', d => d.r)
    d3.select('#CO-' + cases[nRadius])
        .attr('r', d => 2 * d.r)
        .dispatch('mouseover');
        // .dispatch('click');
}

const zoomed = () => {
    let zoomableGroup = d3.selectAll('.zoomable-group');

    zoomableGroup.attr("transform", d3.event.transform);

    let scale = d3.event.transform.k;
    if (scale > 0.8) {
        zoomableGroup.selectAll('.node-labels > text')
            .attr('transform', 'scale(' + (1 / scale) + ')');
        zoomableGroup.selectAll('.labels > text')
            .attr('transform', 'scale(' + (1 / scale) + ')');
    };
    return hideLabels(scale);
}

export const hideLabels = (z) => {
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

export const zoom = d3.zoom()
    .scaleExtent([0.2, 10])
    .on('zoom', zoomed);

export const resetZoom = () => {
    let svg = d3.select('#chart').select('svg');

    svg.call(zoom.transform, d3.zoomIdentity.scale(0.3));
};

export const panTo = d => {
    let svg = d3.select('#chart').select('svg');

    d3.event.stopPropagation();
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
            .scale(2)
            .translate(-d.x, -d.y)
            .translate(Config.width / 2, Config.height / 2),
        d3.mouse(svg.node())
    );
};
