import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AppContext } from "../context/AppContext.jsx";


/* 
// This custom hook handles incoming WebSocket messages and updates the related state values.
const useWebSocketData = (socket) => {
  
  // Define states for the three different message types
  // This allows your React components to reactively display the data
  useEffect(() => {
    socket.onmessage = (event) => {
      // Parse the received JSON message from the WebSocket
      const message = JSON.parse(event.data);

      // Depending on the message type, update the appropriate state variable
      switch (message.type) {
        case 'field-dimensionsX':
          setFieldDimensionsX(message.data);
          break;

        case'field-dimensionsY':
          setFieldDimensionsY(message.data);
          break;
        case 'gas_capacity':
          console.log('Gasolina restante:', message.data);
          setGasCapacity(message.data);
          break;
        case 'harvester_speed':
          console.log('Velocidad de harvester:', message.data);
          setHarvesterSpeed(message.data);
          break;
        case 'harvester_number':
          console.log('Cantidad de harvesters:', message.data);
          setHarvesterNumber(message.data);
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
  return { fieldDimensionsX, fieldDimensionsY, gasCapacity, harvesterSpeed, harvesterNumber};


}
*/


// This is a sample component that utilizes the above hook to receive and display WebSocket data.
const DuringSimulationPage = () => {


  // Use the hook and get the latest data from the WebSocket
  //const { fieldDimensions, gasCapacity, harvesterSpeed } = useWebSocketData(socket);

  const [fieldDimensionsX, setFieldDimensionsX] = useState(50);
  const [fieldDimensionsY, setFieldDimensionsY] = useState(50);
  const [gasCapacity, setGasCapacity] = useState(50);
  const [harvesterSpeed, setHarvesterSpeed] = useState(50);
  const [harvesterNumber, setHarvesterNumber] = useState(1);
  const [fieldDensity, setFieldDensity] = useState(1);

  const { ws, id, unityId } = useContext(AppContext);

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

  const maxSliderValue = Math.min(fieldDimensionsY/6, 10);

  function handleSubmit(e) {
    e.preventDefault();

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "field-dimensionsX",
        sender: id,
        receiver: unityId,
        data: `fieldDimensionsX:${fieldDimensionsX}`,
      }));
      //Y axis
      ws.send(JSON.stringify({
        type: "field-dimensionsY",
        sender: id,
        receiver: unityId,
        data: `fieldDimensionsY:${fieldDimensionsY}`,
      }));
      //Gas
      ws.send(JSON.stringify({
        type: "gas_capacity",
        sender: id,
        receiver: unityId,
        data: `gasCapacity:${gasCapacity}`,
      }));
      // speed
      ws.send(JSON.stringify({
        type: "harvester_speed",
        sender: id,
        receiver: unityId,
        data: `harvesterSpeed:${harvesterSpeed}`,
      }));
      //Harvester number
      ws.send(JSON.stringify({
        type: "harvester_number",
        sender: id,
        receiver: unityId,
        data: `harvesterNumber:${harvesterNumber}`,
      }));
      //Density 
      ws.send(JSON.stringify({
        type: "field-density",
        sender: id,
        receiver: unityId,
        data: `fieldDensity:${fieldDensity}`,
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
                    min={10}
                    max={100}
                    step={6}
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
                    min={10}
                    max={100}
                    step={6}
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
          Iniciar simulación
        </button>
        </div>

    </form>
</div>

    
  );
}

export default DuringSimulationPage;