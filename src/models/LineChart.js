import * as Config from '../Config';

// LineChart Class
export default class LineChart {
    constructor (_parentElement, data) {
        this.parentElement = _parentElement;
        this.data = data;

        this.initViz();
    };
  
    initViz () {
        var viz = this;

        let language = d3.select('#language').node().value;

        viz.height = Config.svg_height;
        viz.width = Config.svg_width;
    
        viz.g = d3.select(viz.parentElement).append("g")
            .attr('class', 'time-graph')
            .attr('opacity', 0);

        viz.t = function() { return d3.transition().duration(1000); };

        // Set scales for nodes by time
        viz.xScale = d3.scaleTime().range([0, viz.width]);
        viz.yScale = d3.scaleLinear().range([viz.height, 0]);
    
        viz.yAxisCall = d3.axisLeft().ticks(10);
        viz.xAxisCall = d3.axisBottom().ticks(30);
    
        viz.xAxis = viz.g.append('g')
            .attr("class", "time-graph-x")
            .attr('transform', `translate(0,${viz.height})`);
        viz.yAxis = viz.g.append('g')
            .attr('class', 'time-graph-y');
    
        viz.xLabel = viz.g.append('text')
            .attr('y', viz.height + 70)
            .attr('x', viz.width / 2)
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .text(language === 'ro' ? 'Ziua' : 'Day');
        viz.yLabel = viz.g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', - 50)
            .attr('x', - viz.height / 2)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text(language === 'ro' ? 'Cazuri ordonate pe zi' : 'Ordered cases per day');
            
        viz.setupData();
    };

    setupData () {
        var viz = this;

        viz.dataFiltered = viz.data;
        
        viz.updateViz();
    };

    updateViz () {
        var viz = this;

        if (viz.dataFiltered !== undefined) {
            // Update scales
            viz.xScale.domain(d3.extent(viz.dataFiltered, d => d.date));
            viz.yScale.domain(d3.extent(viz.dataFiltered, d => d.dayOrder));

            // Update axes
            viz.xAxisCall.scale(viz.xScale);
            viz.xAxis.transition(viz.t()).call(viz.xAxisCall.tickFormat(Config.multiFormat));
            viz.yAxisCall.scale(viz.yScale);
            viz.yAxis.transition(viz.t()).call(viz.yAxisCall);

            viz.xAxis.selectAll('text')
                .attr('font-weight', 'bold')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('transform', 'rotate(-65)');
            viz.yAxis.selectAll('text')
                .attr('font-weight', 'bold');
        };
    };
}
