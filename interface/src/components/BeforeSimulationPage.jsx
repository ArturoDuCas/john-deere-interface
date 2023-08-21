import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export default function BeforeSimulationPage() {
  const [x, setX] = useState(50);
  const [z, setZ] = useState(50);


  const { ws, id, unityId } = useContext(AppContext);


  function handleSubmit(e) {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "field-dimensions",
        sender: id,
        receiver: unityId,
        data: `x:${x},z:${z}`,
      }));
    } else {
      console.log("WebSocket connection not ready.");
    }
  }


  return (
    <form
      className="h-full p-6"
      onSubmit={handleSubmit}

    >
      <div className="w-full flex">
        <div className="flex-col w-1/2 px-4">
          <label
            for="xDimension"
          >
            Dimensiones del terreno en x
          </label>
          <input
            id="xDimension"
            type="range"
            min="0"
            max="100"
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="w-full cursor-pointer"
          />
        </div>
        <div className="flex-col w-1/2 px-4">
          <label
            for="zDimension"
          >
            Dimensiones del terreno en z
          </label>
          <input
            id="zDimension"
            type="range"
            min="0"
            max="100"
            value={z}
            onChange={(e) => setZ(e.target.value)}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          className="bg-green-500 text-white rounded p-1 mt-4 w-1/2"
          type="submit"
        >
          Iniciar simulación
        </button>
      </div>
    </form>
  );
}