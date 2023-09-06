import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import Background from "../public/background.png"
//Prueba
import HarvestingLoad from './HarvestingLoad';


export default function BeforeSimulationPage() {

  const { ws, id, unityId } = useContext(AppContext);

  /*
  function handleSubmit(e) {
    e.preventDefault();

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "field-dimensions",
        sender: id,
        receiver: unityId,
        data: `x:${x},z:${z}`,
      }));
      //HHHHHHH
      ws.send(JSON.stringify({
        type: "gas_capacity",
        sender: id,
        receiver: unityId,
        data: `gasCapacity:${gasCapacity}`,
      }));
      // HHHHHHHH
      ws.send(JSON.stringify({
        type: "harvester_speed",
        sender: id,
        receiver: unityId,
        data: `harvesterSpeed:${harvesterSpeed}`,
      }));
      //HHHHHHHHHHH
      ws.send(JSON.stringify({
        type: "harvester_number",
        sender: id,
        receiver: unityId,
        data: `harvesterSpeed:${harvesterNumber}`,
      }));


    } else {
      console.log("WebSocket connection not ready.");
    }
  }
  */

  return (

    <div className="bg-cover grid grid-cols-2 gap-6">
      <div className="">
        <img src={Background} alt="" className="absolute w-1/2 h-full" />
        
      </div>

      <div>
          
            <HarvestingLoad />
            {/* other components and content */}
      </div>

    </div >
  );
}





 