import { useEffect } from "react";
// import WebSocket from 'websocket';

const socket = new WebSocket('ws://localhost:8080');



export default function DuringSimulationPage() {

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle the received message data here
      console.log('Received message:', message);
    };

    // Optionally, handle socket.onclose, socket.onerror, etc.
  }, []);

  return (
    <div>
      <h1 className="text-4xl">
        {message}
      </h1>
    </div>
  );
}