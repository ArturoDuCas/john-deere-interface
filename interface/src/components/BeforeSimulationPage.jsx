import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import Background from "../public/background.png"
//Prueba
import HarvestingLoad from './HarvestingLoad';
import Speedometer from './Speedometer';



export default function BeforeSimulationPage() {
  return (
      <div className="w-full bg-cover flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-y-4">
              <HarvestingLoad />
              <Speedometer initialGasCapacity={initialGasCapacity} /> {/* Pass the prop here */}
          </div>
          {/* Other column content, if any */}
      </div>
  );
}








 