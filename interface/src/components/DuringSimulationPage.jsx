import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AppContext } from "../context/AppContext.jsx";
import BeforeSimulationPage from './BeforeSimulationPage';


// This is a sample component that utilizes the above hook to receive and display WebSocket data.
const DuringSimulationPage = () => {


  // Use the hook and get the latest data from the WebSocket
  //const { fieldDimensions, gasCapacity, harvesterSpeed } = useWebSocketData(socket);

  const [fieldDimensionsX, setFieldDimensionsX] = useState(20);
  const [fieldDimensionsY, setFieldDimensionsY] = useState(20);
  const [gasCapacity, setGasCapacity] = useState(50);
  const [harvesterSpeed, setHarvesterSpeed] = useState(50);
  const [harvesterNumber, setHarvesterNumber] = useState(1);
  const [fieldDensity, setFieldDensity] = useState(1);

  const { ws, id, unityId } = useContext(AppContext);

  const { setStep } = useContext(AppContext);

  // Display the WebSocket data in the component's UI
  const sliderContainerStyles = {
    display: 'flex',
    justifyContent: 'center', // Horizontally center aligns children
    marginBottom: '75px',  // Added this to create more spacing above the slider
  };

  const texto = {
    display: 'flex',
    flexDirection: 'column', // To make sure content is vertically stacked
    alignItems: 'center', // Horizontally center aligns children
    fontFamily: 'Trebuchet MS',   // Change this to your desired font
    fontSize: '40px',      // Adjust this to your desired size
    textAlign: 'center',  // This will center the text
    fontWeight: 'bold',   // This will make the text bold
    //justifyContent: 'center', // Vertically center aligns children if you want
    height: '8vh', // Full viewport height


  };

  const maxSliderValue = Math.min(fieldDimensionsY / 6, 10);

  const handleInitializeSimulation = () => {
    setStep(2);
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "config_field-dimensionsX",
        sender: id,
        receiver: unityId,
        data: fieldDimensionsX,
      }));
      //Y axis
      ws.send(JSON.stringify({
        type: "config_field-dimensionsY",
        sender: id,
        receiver: unityId,
        data: fieldDimensionsY,
      }));
      //Gas
      ws.send(JSON.stringify({
        type: "config_gas_capacity",
        sender: id,
        receiver: unityId,
        data: gasCapacity,
      }));
      // speed
      ws.send(JSON.stringify({
        type: "config_harvester_speed",
        sender: id,
        receiver: unityId,
        data: harvesterSpeed,
      }));
      //Harvester number
      ws.send(JSON.stringify({
        type: "config_harvester_number",
        sender: id,
        receiver: unityId,
        data: harvesterNumber,
      }));
      //Density 
      ws.send(JSON.stringify({
        type: "config_field-density",
        sender: id,
        receiver: unityId,
        data: fieldDensity,
      }));


    } else {
      console.log("WebSocket connection not ready.");
    }
  }


  // Pagina 
  return (

    <div>
      <form action="" onSubmit={handleSubmit}>
        {/* onSubmit={handleSubmit} -- This line seems to be redundant and misplaced, consider removing it. */}

        {/* Display field dimensions if available */}
        <p style={texto}>Field Dimensions X: {fieldDimensionsX}</p>
        <div style={sliderContainerStyles}>
          <Box sx={{ width: 300 }}>
            <Slider
              min={6}
              max={20}
              step={1}
              id="mySlider1"
              value={fieldDimensionsX}
              onChange={(e) => setFieldDimensionsX(e.target.value)}
              color="success"
            />
          </Box>
        </div>

        {/* Display field dimensions Z */}
        <p style={texto}>Field Dimensions Y: {fieldDimensionsY}</p>
        <div style={sliderContainerStyles}>
          <Box sx={{ width: 300 }}>
            <Slider
              min={6}
              max={20}
              step={1}
              id="mySlider2"
              value={fieldDimensionsY}
              onChange={(e) => setFieldDimensionsY(e.target.value)}
              color="success"
            />
          </Box>
        </div>

        {/* Display gas capacity if available */}
        <p style={texto}>Gas Capacity: {gasCapacity}</p>
        <div style={sliderContainerStyles}>
          <Box sx={{ width: 300 }}>
            <Slider
              step={50}
              min={100}
              max={1000}
              id="mySlider3"
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
              min={10}
              max={100}
              step={10}
              id="mySlider4"
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
              min={1}
              max={maxSliderValue}
              step={1}
              id="mySlider5"
              value={harvesterNumber}
              onChange={(e) => setHarvesterNumber(e.target.value)}
              color="success"
            />
          </Box>
        </div>
        {/*Density*/}
        <p style={texto}>Field Density: {fieldDensity}</p>
        <div style={sliderContainerStyles}>
          <Box sx={{ width: 300 }}>
            <Slider
              min={1}
              max={maxSliderValue}
              step={1}
              id="mySlider6"
              value={fieldDensity}
              onChange={(e) => setFieldDensity(e.target.value)}
              color="success"
            />
          </Box>
        </div>

        <div className="w-full flex justify-center mt-4" style={texto} >
          <button className="bg-[#20720D] text-white p-1 mt-4 mb-20 w-1/2 hover:bg-[#86ab7d]" type="submit">
            Enviar datos
          </button>
        </div>

      </form>
      <div className="w-full flex justify-center mt-4" style={texto}>
        <button
          className="bg-[#20720D] text-white p-1 mt-4 mb-20 w-1/2 hover:bg-[#86ab7d]"
          type="submit"
          onClick={handleInitializeSimulation}
        >
          Inicializar simulacion
        </button>
      </div>
    </div>


  );
}

export default DuringSimulationPage;