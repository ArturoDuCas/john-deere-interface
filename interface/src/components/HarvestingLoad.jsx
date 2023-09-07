import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React, { Component } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';

class App extends Component {
    componentDidMount() {
        this.ws = new WebSocket("ws://localhost:8082");
      
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'harvester_capacity') {
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

    startColor = '#808080'; // grey
    endColor = '#FFFF00'; // yellow

    render() {
        const radius = 150;
        const textStyle = {
            fill: '#000', // Black color
            fontFamily: 'Trebuchet MS, sans-serif',
            fontWeight: 'bold',
        };
        const interpolate = interpolateRgb(this.startColor, this.endColor);
        const fillColor = interpolate(this.state.value / 100);
        const gradientStops = [
            {
                key: '0%',
                stopColor: this.startColor,
                stopOpacity: 1,
                offset: '0%'
            },
            {
                key: '50%',
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
                key: '100%',
                stopColor: this.endColor,
                stopOpacity: 0.5,
                offset: '100%'
            }
        ];
        

        return (
            <div>
                <h1 className="text-center text-4xl font-bold mb-8" style={textStyle}>
                    Harvester Load Capacity
                </h1>
                <LiquidFillGauge
                    style={{ margin: '0 auto' }}
                    width={radius * 2}
                    height={radius * 2}
                    value={this.state.value}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2.4);
                        const valueStyle = {
                            fontSize: textPixels,
                        };
                        const percentStyle = {
                            fontSize: textPixels
                        };
                        
                        return (
                            <tspan>
                                <tspan className="value" style={valueStyle}>{value}</tspan>
                                <tspan style={percentStyle}>{props.percent}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation
                    waveAnimation={false}
                    gradient
                    gradientStops={gradientStops}
                    circleStyle={{
                        fill: fillColor
                    }}
                    waveStyle={{
                        fill: fillColor
                    }}
                    textStyle={textStyle}
                    waveTextStyle={textStyle}
                />
            </div>
        );
    }
}

export default App;
