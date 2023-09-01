import { useState, useEffect } from 'react';

// This custom hook handles incoming WebSocket messages and updates the related state values.
const useWebSocketData = (socket) => {
  // Define states for the three different message types
  // This allows your React components to reactively display the data.

  const [fieldDimensions, setFieldDimensions] = useState(null);
  const [gasCapacity, setGasCapacity] = useState(null);
  const [harvesterSpeed, setHarvesterSpeed] = useState(null);

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
  const { fieldDimensions, gasCapacity, harvesterSpeed } = useWebSocketData(socket);

  // Display the WebSocket data in the component's UI
  return (
    <div>
      {/* Display field dimensions if available */}
      <p>Field Dimensions: {fieldDimensions}</p>

      {/* Display gas capacity if available */}
      <p>Gas Capacity: {gasCapacity}</p>

      {/* Display harvester speed if available */}
      <p>Harvester Speed: {harvesterSpeed}</p>
    </div>
  );
}


export default DuringSimulationPage;