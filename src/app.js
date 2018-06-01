/* global document, fetch, window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {NavigationControl} from 'react-map-gl';
import InfoOverlay from './info-overlay.js';
import DeckGLOverlay from './deckgl-overlay.js';
import {json as requestJson} from 'd3-request';
require('./index.css');

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamJvd256aW5vIiwiYSI6ImNqZWp6ZjBhMTNydnQydmxudzRqN3R2bW4ifQ.CquyG6X0xN3PfoeEDbi64A'; // eslint-disable-line

// Source data CSV
const DATA_URL = {
    DATAROBOT: './assets/dr_live_data_eu.json', // eslint-disable-line
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
            counts: {
                predictions: 0,
                models: 0,
                insights: 0,
                projects: 0
            },
            requests: null,
            time: 0,
            counter: 0
        };

        requestJson(DATA_URL.DATAROBOT, (error, response) => {
            if (!error) {
                this.setState({requests: this.process(response)});
            }
        });
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

    process = (data) => {
        const requests = [];
        let counter = 0;
        for (let k in data) {
            data[k].forEach((item) => {
                counter += Math.round(Math.random()*5);
                const timestamp = parseInt(Date.parse(k).toFixed(2));
                const environment = (item.environment === 'UNITED_STATES') ? 'US' : 'EU';
                const sourcePosition = [parseInt(item.longitude), parseInt(item.latitude), counter];
                const targetPosition = (item.environment === 'UNITED_STATES') ? [-78.024902, 37.926868, counter + 200] : [-0.454295, 51.470020, counter + 200];
                const events = item.events;
                for (let event in events) {
                    for (let i = 0; i < events[event]; i++) {
                        requests.push({
                            environment: environment,
                            segments: [sourcePosition, targetPosition],
                            sourcePosition: sourcePosition,
                            targetPosition: targetPosition,
                            event: event
                        })
                    }
                }
            })
            this.setState({counter: counter})
        }
        this._getCounts(requests);
        return requests;
    }

    _getCounts = (requests) => {
        const counts = {
            predictions: requests.filter(request => request.event === 'PREDICTION_REQUEST').length,
            models: requests.filter(request => request.event === 'MODEL_BUILD').length,
            insights: requests.filter(request => request.event === 'INSIGHT_BUILD').length,
            projects: requests.filter(request => request.event === 'PROJECT_CREATION').length
        }
        this.setState({counts: counts})
    }

    _animate = () => {
        const timestamp = Date.now();
        const loopLength = 1800;
        const loopTime = 60000;

        this.setState({
            time: (timestamp % loopTime) / loopTime * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    _resize = () => this._onViewportChange({
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
        //width: 800,
        //height: 600
    });


    _onViewportChange = viewport => this.setState({
        viewport: {...this.state.viewport, ...viewport}
    });


    render() {
        const {viewport, requests, time} = this.state;

        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/jbownzino/cjfdxstp69vpl2rqvvfixo80d"
                onViewportChange={this._onViewportChange.bind(this)}
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                <DeckGLOverlay
                    viewport={viewport}
                    requests={requests}
                    trailLength={24}
                    time={time}
                />
                <InfoOverlay
                    containerComponent={this.props.containerComponent}
                    onViewportChange={this._goToViewport}
                    counts={this.state.counts}
                />
            </MapGL>
        );
    }
}

render(<Root/>, document.getElementById('map'));
