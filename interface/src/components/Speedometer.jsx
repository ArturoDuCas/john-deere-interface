import React, { Component } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class HarvestingSpeedometer extends Component {
    componentDidMount() {
        this.ws = new WebSocket("ws://localhost:8080");
      
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'gas_capacity') {
                this.setState({ value: message.data });
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from server');
        };
    }

    componentWillUnmount() {
        this.ws.close();
    }

    state = {
        value: 0
    };

    render() {
        const radius = 200; // Same as the gauge

        return (
            <div>
                <h1 className="text-center text-4xl font-bold mb-8" style={{ fontFamily: 'Trebuchet MS, sans-serif' }}>
                    Harvester Load Capacity
                </h1>
                <div style={{ width: radius * 2, height: radius * 2, margin: '0 auto' }}>
                    <CircularProgressbar
                        value={this.state.value}
                        text={`${this.state.value} %`}
                        circleRatio={0.7} /* Make the circle only 0.7 of the full diameter */
                        styles={{
                            trail: {
                                strokeLinecap: 'butt',
                                transform: 'rotate(-126deg)',
                                transformOrigin: 'center center',
                                stroke: '#ddd' // Background color for unfilled part
                            },
                            path: {
                                strokeLinecap: 'butt',
                                transform: 'rotate(-126deg)',
                                transformOrigin: 'center center',
                                stroke: '#000', // Black color
                            },
                            text: {
                                fill: '#000', // Black color
                                fontFamily: 'Trebuchet MS, sans-serif',
                                fontWeight: 'bold',
                            },
                        }}
                        strokeWidth={10}
                    />
                </div>
            </div>
        );
    }
}

export default HarvestingSpeedometer;
