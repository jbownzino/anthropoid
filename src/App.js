import React, { Component } from 'react';
import MapGL from 'react-map-gl';
//import DeckGLOverlay from './deckgl-overlay.js';
import token from './constants.js';
import logo from './logo.svg';
import './App.css';

const FLIGHT_DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/line/heathrow-flights.json';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: []
        }
    }

    componentDidMount() {
        this.getFlightData();
    }

    getFlightData = () => {
        fetch(FLIGHT_DATA_URL)
            .then(response => response.json())
            .then(data => this.setState({ flights: JSON.stringify(data) }));
    }

    render() {
        return (
            <div>test: {this.state.flights}</div>
        );
    }
}

export default App;
