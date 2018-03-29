import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {ArcLayer, LineLayer, ScatterplotLayer} from 'deck.gl';

function getColor(d) {
  const z = d.start[2];
  const r = z / 10000;
    return [45,143,226];
  //return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
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
      latitude: 41.257160,
      longitude: -95.995102,
      zoom: 2,
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
        getSourceColor: d => [45, 143, 226],
        getTargetColor: d => [255, 255, 255, 0.5],
        pickable: Boolean(this.props.onHover),
        onHover: this.props.onHover
      })
    ];

    return <DeckGL {...viewport} layers={layers} onWebGLInitialized={this._initialize} />;
  }
}
