import React, {Component} from 'react';
import hubs from './hubs.json';
import logo from './assets/datarobot_text.png';

const defaultContainer =  ({children}) => <div className="controls">{children}</div>;

export default class TransitionControl extends Component {

    _renderButton = (hub, index) => {
        console.log('coordinates: ' + hub.coordinates[0] + ', ' + hub.coordinates[1]);
        return (
            <div key={`btn-${index}`} className="input" >
                <input type="radio" name="city"
                       id={`city-${index}`}
                       defaultChecked={hub.name === 'Virginia'}
                       onClick={() => this.props.onViewportChange(hub)} />
                <label htmlFor={`city-${index}`}>{hub.name}</label>
            </div>
        );
    };

    render() {
        const Container = this.props.containerComponent || defaultContainer;

        return (
            <Container>
                <img className="logo" src={logo} />
                { hubs.map(this._renderButton) }
            </Container>
        );
    }
}