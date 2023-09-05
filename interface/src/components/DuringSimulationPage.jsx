import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Slider from '@mui/material/Slider';



// This custom hook handles incoming WebSocket messages and updates the related state values.
const useWebSocketData = (socket) => {
  // Define states for the three different message types
  // This allows your React components to reactively display the data.

  const [fieldDimensions, setFieldDimensions] = useState(null);
  const [gasCapacity, setGasCapacity] = useState(null);
  const [harvesterSpeed, setHarvesterSpeed] = useState(null);
  const [harvesterNumber, setHarvesterNumber] = useState(null);
  

  useEffect(() => {
    socket.onmessage = (event) => {
      // Parse the received JSON message from the WebSocket
      const message = JSON.parse(event.data);

      // Depending on the message type, update the appropriate state variable
      switch (message.type) {
        case 'field-dimensions':
          setFieldDimensions(message.data);
          break;
        case 'gas_capacity':
          console.log('Gasolina restante:', message.data);
          setGasCapacity(message.data);
          break;
        case 'harvester_speed':
          console.log('Velocidad de harvester:', message.data);
          setHarvesterSpeed(message.data);
          break;
        default:
          console.log('Received message:', message);
      }
    };

    // Cleanup: remove the event listener when the component that uses this hook unmounts
    return () => {
      socket.onmessage = null;
    };

    // Optionally, you can handle socket.onclose, socket.onerror, etc. here as well.
  }, [socket]);  // 'socket' is a dependency, ensuring that if it changes, the effect runs again.

  // Return the states so they can be accessed and used in your component
  return { fieldDimensions, gasCapacity, harvesterSpeed };


}



// This is a sample component that utilizes the above hook to receive and display WebSocket data.
const DuringSimulationPage = () => {

  // Use the hook and get the latest data from the WebSocket
  //const { fieldDimensions, gasCapacity, harvesterSpeed } = useWebSocketData(socket);
  const [fieldDimensions, setFieldDimensions] = useState(50);
  const [gasCapacity, setGasCapacity] = useState(50);
  const [harvesterSpeed, setHarvesterSpeed] = useState(50);
  const [harvesterNumber, setHarvesterNumber] = useState(1);

 

  // Display the WebSocket data in the component's UI
  const sliderContainerStyles = {
    display: 'flex',
    justifyContent: 'center', // Horizontally center aligns children
    marginBottom: '75px',  // Added this to create more spacing above the slider
};
  const sliderStyles = {
    width: '50%',
    margin: '30px 5',
    appearance: 'none',
    backgroundColor: '#039108',
    height: '30px',
    border: '2px',
    borderRadius: '100px',
    outline: 'none',
    //background: 'linear-gradient(to right, green 100%, green calc(100% * (var(--value) - var(--min)) / (var(--max) - var(--min))), #d3d3d3 calc(100% * (var(--value) - var(--min)) / (var(--max) - var(--min))), #green 100%)'
    
  };
  const texto = {
    display: 'flex',
    flexDirection: 'column', // To make sure content is vertically stacked
    alignItems: 'center', // Horizontally center aligns children
    //fontFamily: 'Arial Black',   // Change this to your desired font
    fontSize: '40px',      // Adjust this to your desired size
    textAlign: 'center',  // This will center the text
    fontWeight: 'bold',   // This will make the text bold
    //justifyContent: 'center', // Vertically center aligns children if you want
    height: '8vh', // Full viewport height
    
    
  };

  const maxSliderValue = Math.min(fieldDimensions/6, 10);

  
  return (
   
    <div>
    {/* Display field dimensions if available */}
    <p style={texto}>Field Dimensions: {fieldDimensions}</p>
    <div style={sliderContainerStyles}>
   
       <Box sx={{ width: 300 }}>
      <Slider
        min={10}
        max = {100}
        step ={6}
        id="mySlider1"
        value={fieldDimensions}
        onChange={(e) => setFieldDimensions(e.target.value)}
        color="success" 
      />
    </Box>

    </div>

    {/* Display gas capacity if available */}
    <p style={texto}>Gas Capacity: {gasCapacity}</p>
    <div style={sliderContainerStyles}>
    <Box sx={{ width: 300 }}>
      <Slider
        step ={50}
        min ={100}
        max={1000}
        id="mySlider2"
        value={gasCapacity}
        onChange={(e) => setGasCapacity(e.target.value)}
        color="success" 
      />
    </Box>
    </div>

    {/* Display harvester speed if available */}
    <p style={texto}>Harvester Speed: {harvesterSpeed}</p>
    <div style={sliderContainerStyles}>
    <Box sx={{ width: 300 }}>
      <Slider
        step ={10}
        id="mySlider3"
        value={harvesterSpeed}
        onChange={(e) => setHarvesterSpeed(e.target.value)}
        color="success" 
      />
    </Box>
    </div>

    {/* Display harvester quantity if available */}
    <p style={texto}>Harvester Number: {harvesterNumber}</p>
    <div style={sliderContainerStyles}>
    <Box sx={{ width: 300 }}>
      <Slider
        
        min ={1}
        max={maxSliderValue}
        step ={1}
        id="mySlider4"
        value={harvesterNumber}
        onChange={(e) => setHarvesterNumber(e.target.value)}
        color="success" 
      />
    </Box>
    </div>
  </div>
  );
}

export default DuringSimulationPage;