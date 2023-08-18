import React, {useContext} from "react";
import { AppContext } from "../context/AppContext.jsx";
import BeforeSimulationPage from "../components/BeforeSimulationPage.jsx";
import DuringSimulationPage from "../components/DuringSimulationPage.jsx";
import AfterSimulationPage from "../components/AfterSimulationPage.jsx";

export default function Routes() {
  const { step } = useContext(AppContext);
  console.log(step);

  return(
    <>
      {step === 0 ?
        <BeforeSimulationPage />
      : step === 1 ?
        <DuringSimulationPage />
      : step === 2 ?
        <AfterSimulationPage />
      :
        null
      }
    </>
  );
}