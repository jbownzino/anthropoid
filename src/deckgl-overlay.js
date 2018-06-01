import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';
import TripsLayer from './trips-layer/index';

//@@TODO make globalConstants file, these colors need to become contants
const getColor = (event) => {
    switch(event) {
        case 'PREDICTION_REQUEST':
            return [253, 128, 93]
            break;
        case 'MODEL_BUILD':
            return [23, 184, 190]
            break;
        case 'PROJECT_CREATION':
            return [146, 204, 139]
            break;
        case 'INSIGHT_BUILD':
            return [115, 188, 132]
            break;
        default:
            return [37, 121, 219]
    }
}

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      longitude: 15.368832,
      latitude: 13.633559,
      zoom: 1.6,
      maxZoom: 8,
      pitch: 30,
      bearing: 0
    };
  }

  render() {
    const {viewport, requests, trailLength, time} = this.props;

    if (!requests) {
      return null;
    }

    const layers = [
      new TripsLayer({
        id: 'requests',
        data: requests,
        getPath: d => d.segments,
        getColor: d => getColor(d),
        opacity: 0.5,
        strokeWidth: 3,
        trailLength,
        currentTime: time
      }),
        new ScatterplotLayer({
        id: 'hubs',
        data: requests,
        radiusScale: 20,
        getPosition: d => d.segments[1],
        getColor: d => [255, 109, 0],
        getRadius: d => 1200
        //pickable: Boolean(this.props.onHover),
        //onHover: this.props.onHover
      }),

    ];

    return <DeckGL {...viewport} layers={layers} />;
  }
}
