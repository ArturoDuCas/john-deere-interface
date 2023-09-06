// EstablishConnection.jsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

export default function EstablishConnection() {
  const { ws, id, unityId, setUnityId, setStep } = useContext(AppContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "connect",
          sender: id,
          receiver: unityId,
          data: unityId,
        })
      );
    } else {
      console.log(ws);
      console.log("WebSocket connection not ready.");
    }
  }

  function handleConnectionSuccess() {
    // Handle the logic when the connection is successful
    // For example, change the step to move to the BeforeSimulationPage
    setStep(2); // Assuming 2 represents BeforeSimulationPage
  }

  return (
    <div className="flex flex-col justify-center items-center bg-white h-full">
      <div className="w-1/4 bg-gray-50 rounded shadow p-6 flex items-center mb-6">
        <form onSubmit={handleSubmit}>
          <label className="block text-base mb-1">ID de conexión</label>
          <input
            className="border-2 border-gray-300 rounded p-1 w-full"
            value={unityId}
            onChange={(e) => setUnityId(e.target.value)}
            type="text"
            placeholder="12345"
          />

          <button
            className="bg-[#367c2b] text-white rounded p-1 mt-4 w-full"
            type="submit"
            onClick={handleConnectionSuccess}
          >
            Conectar
          </button>
        </form>
      </div>
    </div>
  );
}
