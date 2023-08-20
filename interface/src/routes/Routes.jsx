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
    <>
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
    </>
  );
}