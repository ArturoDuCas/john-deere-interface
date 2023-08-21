import React, {useContext} from "react";
import { AppContext } from "../context/AppContext.jsx";
import EstablishConnection from "../components/establish-connection/EstablishConnection.jsx";
import BeforeSimulationPage from "../components/BeforeSimulationPage.jsx";
import DuringSimulationPage from "../components/DuringSimulationPage.jsx";
import AfterSimulationPage from "../components/AfterSimulationPage.jsx";

export default function Routes() {
  const { step } = useContext(AppContext);
  console.log(step);

  return(
    <div className="h-screen">
      <header className="bg-green-500 p-4 border-b-2 h-1/6 flex items-center">
        <h1 className="text-2xl text-white">John Deere</h1>
      </header>
      <div className="h-5/6">
        {step === 0 ?
          <EstablishConnection />
        : step === 1 ?
          <BeforeSimulationPage />
        : step === 2 ?
          <DuringSimulationPage />
        : step === 3 ?
          <AfterSimulationPage />
        :
          null
        }
    </div>
    </div>
  );
}