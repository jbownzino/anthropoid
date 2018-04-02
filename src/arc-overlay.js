import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {ArcLayer, LineLayer, ScatterplotLayer} from 'deck.gl';

function getSourceColor(d) {
  return d.category === 'cloud' ? [255, 246, 188] : [45, 143, 206];
}

//testing out sizing dynamically on our scatterPlot layer
function getSize(type) {
  return type.search('major') >= 0 ? 600 : 0;
}

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      latitude: 32.613222,
      longitude: 29.032889,
      zoom: 1.38,
      maxZoom: 16,
      pitch: 30,
      bearing: 0
    };
  }

  _initialize(gl) {
    setParameters(gl, {
      blendFunc: [gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE],
      blendEquation: gl.FUNC_ADD
    });
  }

  render() {
    const {viewport, nodes, hubs, strokeWidth} = this.props;

    if (!nodes || !hubs) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'hubs',
        data: hubs,
        radiusScale: 20,
        getPosition: d => d.coordinates,
        getColor: d => [255, 140, 0],
        getRadius: d => getSize(d.type),
        //pickable: Boolean(this.props.onHover),
        //onHover: this.props.onHover
      }),
      new ArcLayer({
        id: 'nodes',
        data: nodes,
        strokeWidth,
        fp64: false,
        getSourcePosition: d => d.start,
        getTargetPosition: d => d.end,
        getSourceColor,
        getTargetColor: d => [45, 143, 206, .97],
        //pickable: Boolean(this.props.onHover),
        //onHover: this.props.onHover
      })
    ];

    return <DeckGL {...viewport} layers={layers} onWebGLInitialized={this._initialize} />;
  }
}
