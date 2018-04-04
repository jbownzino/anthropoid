import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import MapGL, {FlyToInterpolator} from 'react-map-gl';
import DeckGLOverlay from './overlays.js';
import TransitionControl from './transition-control.js';
import {json as requestJson} from 'd3-request';
require('./index.css');

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamJvd256aW5vIiwiYSI6ImNqZWp6ZjBhMTNydnQydmxudzRqN3R2bW4ifQ.CquyG6X0xN3PfoeEDbi64A'; // eslint-disable-line

// Source data CSV
const DATA_URL = {DATAROBOT: './assets/datarobot.json', HUBS: './assets/hubs.json', TEST: '/assets/test_arc.json'};

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            strokeWidth: 0,
            time: 0,
            nodes: [],
            hubs: []
        };

    //@@TODO We need to be using flux to handle data
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
        this._animate();
    }

    _calculate = () => {
        console.log([38.592724 + (41.597782 - 38.592724) * 0.5, -77.711441 + (-72.755371 - -77.711441) * 0.5]);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => this._onViewportChange({
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
        //width: 800,
        //height: 600
    });

    _animate = () => {
        const timestamp = Date.now();
        const loopLength = 1800;
        const loopTime = 60000;
        const t = this.state.strokeWidth;
        const stroke = 1.25 > t ? t + 0.075 : t;

        this.setState({
            strokeWidth: stroke,
            time: (timestamp % loopTime) / loopTime * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate);
    }

    _onViewportChange = viewport => this.setState({
        viewport: {...this.state.viewport, ...viewport}
    });

    //We can even out the transitions by changing duration based on distance between origin/target
    _goToViewport = (hub) => {
        this._onViewportChange({
            longitude: hub.coordinates[0],
            latitude: hub.coordinates[1],
            zoom: hub.name === 'Origin' ? 1.38 : 4,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: hub.name === 'Origin' ? 4500 : 3500
        });
    };

    render() {
        const {viewport, nodes, hubs, time} = this.state;

        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/jbownzino/cjfdy2jmpa5232rpscctr8jp3"
                onViewportChange={this._onViewportChange}
                attributionControl={false}
                trackResize={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}

            >
                <DeckGLOverlay
                    viewport={viewport}
                    strokeWidth={this.state.strokeWidth}
                    nodes={nodes}
                    hubs={hubs}
                    time={time}
                />
                <TransitionControl containerComponent={this.props.containerComponent}
                                   onViewportChange={this._goToViewport}
                />
            </MapGL>
        );
    }
}

ReactDOM.render(<Root/>, document.getElementById('map'));