import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {ArcLayer, LineLayer, ScatterplotLayer} from 'deck.gl';

function getSourceColor(d) {
  return d.category === 'cloud' ? [45, 143, 226] : [47, 115, 54];
}

function getSize(type) {
  if (type.search('major') >= 0) {
    return 100;
  }
  if (type.search('small') >= 0) {
    return 30;
  }
  return 60;
}
export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      latitude: 38.456085,
      longitude: -92.288368,
      zoom: 3,
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
    const {viewport, flightPaths, airports, strokeWidth} = this.props;

    if (!flightPaths || !airports) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'airports',
        data: airports,
        radiusScale: 20,
        getPosition: d => d.coordinates,
        getColor: d => [255, 140, 0],
        getRadius: d => getSize(d.type),
        pickable: Boolean(this.props.onHover),
        onHover: this.props.onHover
      }),
      new ArcLayer({
        id: 'flight-paths',
        data: flightPaths,
        strokeWidth,
        fp64: false,
        getSourcePosition: d => d.start,
        getTargetPosition: d => d.end,
        getSourceColor,
        getTargetColor: d => [255, 255, 255, 0.5],
        pickable: Boolean(this.props.onHover),
        onHover: this.props.onHover
      })
    ];

    return <DeckGL {...viewport} layers={layers} onWebGLInitialized={this._initialize} />;
  }
}
