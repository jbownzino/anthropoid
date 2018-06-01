import React, {Component} from 'react';
import hubs from '../assets/hubs.json';
import logo from '../assets/datarobot_text.png';

const defaultContainer =  ({children}) => <div className="controls">{children}</div>;

export default class InfoOverlay extends Component {

    _renderCounts(counts, index) {
        return (
            <div key={`count-${index}`} className="input" >
                {counts.predictions}
            </div>
        );
    };

    render() {
        const Container = this.props.containerComponent || defaultContainer;
        const counts = this.props.counts;

        return (
            <Container>
                <img className="logo" src={logo} />
                <ul className="info-overlay">
                    <li className="predictions">Predictions Made: {counts.predictions}</li>
                    <li className="projects">Projects Created: {counts.projects}</li>
                    <li className="models">Models Built: {counts.models}</li>
                    <li className="insights">Insights Built: {counts.insights}</li>
                </ul>
            </Container>
        );
    }
}