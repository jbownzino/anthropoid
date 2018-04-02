/* global window,document */
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import MapGL, {FlyToInterpolator} from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import {json as requestJson} from 'd3-request';

require('./index.css');

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamJvd256aW5vIiwiYSI6ImNqZWp6ZjBhMTNydnQydmxudzRqN3R2bW4ifQ.CquyG6X0xN3PfoeEDbi64A'; // eslint-disable-line

// Source data CSV
const DATA_URL = {DATAROBOT: './src/datarobot.json', HUBS: './src/hubs.json'};

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            nodes: [],
            hubs: []
        };

        requestJson(DATA_URL.DATAROBOT, (error, response) => {
            if (!error) {
                this.setState({nodes: response});
            }
        });
        requestJson(DATA_URL.HUBS, (error, response) => {
            if (!error) {
                this.setState({hubs: response});
            }
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => this._onViewportChange({
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
    });

    _onViewportChange = viewport => this.setState({
        viewport: {...this.state.viewport, ...viewport}
    });

    _goToViewport = ({longitude, latitude}) => {
        this._onViewportChange({
            longitude,
            latitude,
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 3000
        });
    };

    render() {
        const {viewport, nodes, hubs} = this.state;

        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/jbownzino/cjfdy2jmpa5232rpscctr8jp3"
                onViewportChange={this._onViewportChange}
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                <DeckGLOverlay
                    viewport={viewport}
                    strokeWidth={1}
                    nodes={nodes}
                    hubs={hubs}
                />
            </MapGL>
        );
    }
}

ReactDOM.render(<Root/>, document.getElementById('map'));

//render(<Root />, document.body.appendChild(document.createElement('div')));
