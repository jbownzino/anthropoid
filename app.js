/* global document, fetch, window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamJvd256aW5vIiwiYSI6ImNqZWp6ZjBhMTNydnQydmxudzRqN3R2bW4ifQ.CquyG6X0xN3PfoeEDbi64A'; // eslint-disable-line

// Source data CSV
const DATA_URL = {
    TRIPS:
        './assets/dr_live_data_eu.json' // eslint-disable-line
};

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            buildings: null,
            trips: null,
            time: 0,
            counter: 0
        };

        fetch(DATA_URL.TRIPS)
        //this.process(data)
            .then(resp => resp.json())
            .then(data => this.setState({trips: this.process(data)}));
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
        this._animate();
    }

    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }

    process(data) {
        const trips = [];
        for (let k in data) {
            const counter = Math.floor(Math.random() * 1800) + 400;
            data[k].forEach((item) => {
                const timestamp = parseInt(Date.parse(k).toFixed(2));
                const environment = (item.environment === 'UNITED_STATES') ? 'US' : 'EU';
                const sourcePosition = [parseInt(item.longitude), parseInt(item.latitude), counter + 20];
                const targetPosition = (item.environment === 'UNITED_STATES') ? [-78.024902, 37.926868, counter + 40] : [-0.454295, 51.470020, counter + 80];
                const events = item.events;
                trips.push({
                    environment: environment,
                    segments: [sourcePosition, targetPosition],
                    sourcePosition: sourcePosition,
                    targetPosition: targetPosition,
                    events: events
                });
            })
            this.setState({counter: counter})
        }
        return trips;
    }

    _animate() {
        const timestamp = Date.now();
        const loopLength = 1800;
        const loopTime = 60000;

        this.setState({
            time: (timestamp % loopTime) / loopTime * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
            //width: 800,
            //height: 600
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    }

    render() {
        const {viewport, trips, time} = this.state;

        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this._onViewportChange.bind(this)}
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                <DeckGLOverlay
                    viewport={viewport}
                    trips={trips}
                    trailLength={180}
                    time={time}
                />
            </MapGL>
        );
    }
}

render(<Root/>, document.body.appendChild(document.createElement('div')));
