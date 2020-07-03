import * as Config from './Config.js';
import * as Language from './Language.js';

// use a tooltip to show node info
export const tooltip_div = d3.select('body')
   .append('tooltip_div')
   .attr('class', 'tooltip')
   .style('opacity', 0)
   .style('display', 'none');

export const highlight = (d, cases) => {

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
                };
            });

    // adjust the text on the range slider
    let name = cases.indexOf(caseId);
    d3.select('#nRadius-value').text(caseId);
    d3.select('#nRadius').property('value', name);

    tooltip_div.html(tooltipHTML(d))
        .style('left', left + 'px')
        .style('top', top + 'px')
        .style('display', null);
};

export const tooltipHTML = (d) => {
    if (d.properties !== undefined) {
        let language = d3.select('#language').node().value;

        let labels = {
            valueLabel: { 'ro': 'cazuri legate', 'en': 'clustered cases' },
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

        let cazuriInfo = d.infected_persons ? (d.infected_persons + ' ' + labels.valueLabel[language] + '.<br />') : '',
            genderInfo = d.properties.gender === 'Bărbat'
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

        // return '<b>' + labels.cazulLabel[language] + ' ' + d.properties.case_no + '</b>' +
        return '<b>' + labels.cazulLabel[language] + ' ' + 'x' + '</b>' +
            // genderInfo + ageInfo +
            countyInfo + '.<br />' +
            cazuriInfo + // Note: a case id can have 303 related cases from two counties, and 301 from the same county in the Pack graphic
            statusInfo +
            diagnosticDateInfo +
            healingDateInfo +
            countyOfInfectionInfo +
            referenceInfo
        ;
    } else {
        return d.name;
    };
};

export const unHighlight = () => {
    d3.selectAll('.nodes')
        .style('opacity', 1);
    d3.selectAll('.link')
        .style('opacity', 1);
    d3.selectAll('.node-labels > text')
        .style('opacity', '1');
};

export const hideTooltip = () => {
    d3.selectAll('.nodes')
        .attr('r', d => d.r)
    tooltip_div.transition()
        .duration(200)
        .style('opacity', 0);
};

export const highlightSearchedId = (caseId) => {
    d3.select('#CO-' + caseId)
        .dispatch('mouseover');
        // .dispatch('click');
};

export const toggleInfo = (infoStatus, language) => {
    if (infoStatus === true) {
        tooltip_div.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip_div.html(Language.infoHtml(language))
            .style('left', Config.width / 2 + 'px')
            .style('top', Config.height / 2 + 'px')
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

