import React, {Component} from 'react';
import hubs from './hubs.json';

const defaultContainer =  ({children}) => <div className="controls">{children}</div>;

export default class TransitionControl extends Component {

    _renderButton = (hubs, index) => {
        console.log('coordinates: ' + hubs.coordinates[0] + ', ' + hubs.coordinates[1]);
        return (
            <div key={`btn-${index}`} className="input" >
                <input type="radio" name="city"
                       id={`city-${index}`}
                       defaultChecked={hubs.name === 'Virginia'}
                       onClick={() => this.props.onViewportChange(hubs.coordinates[0], hubs.coordinates[1])} />
                <label htmlFor={`city-${index}`}>{hubs.name}</label>
            </div>
        );
    };

    render() {
        const Container = this.props.containerComponent || defaultContainer;

        return (
            <Container>
                <h3>Datarobot</h3>
                <p>Click to view offices</p>
                <hr />
                { hubs.map(this._renderButton) }
            </Container>
        );
    }
}