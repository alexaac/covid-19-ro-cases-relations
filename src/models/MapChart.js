import * as Config from '../Config';

// MapChart Class
export default class MapChart {
    constructor (_parentElement, geoCounties, geojsonFeatures) {
        this.parentElement = _parentElement;
        this.geoCounties = geoCounties;
        this.geojsonFeatures = geojsonFeatures;

        this.initViz();
    };
  
    initViz () {
        var viz = this;

        viz.height = Config.svg_height;
        viz.width = Config.svg_width;
    
        viz.g = d3.select(viz.parentElement).append("g")
            .attr('class', 'map-features')
            .attr('opacity', 1);

        viz.setupData();
    };

    setupData () {
        var viz = this;

        viz.dataFiltered = viz.geoCounties;
        
        viz.updateVis();
    };

    updateVis () {
        var viz = this;

        if (viz.dataFiltered !== undefined) {
            console.log(viz.dataFiltered);
                    
            const thisMapPath = d3.geoPath()
                .projection(
                    Config.projection
                        .fitSize([viz.width , viz.height], viz.geojsonFeatures));

            const mapFeatures = viz.g.selectAll('path')
                .data(viz.dataFiltered)
                .enter()
                .append('path')
                .attr('d', thisMapPath)
                    .attr('class', 'land')
                    .attr('opacity', 0.25);
        
            mapFeatures.append('title').text(d => d.id);
        };
    };
}
