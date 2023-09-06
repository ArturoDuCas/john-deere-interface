import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import EstablishConnection from "../components/establish-connection/EstablishConnection.jsx";
import BeforeSimulationPage from "../components/BeforeSimulationPage.jsx";
import DuringSimulationPage from "../components/DuringSimulationPage.jsx";
import AfterSimulationPage from "../components/AfterSimulationPage.jsx";
import JohnDeere_Logo from "../public/John_Deere_logo.svg.png";

export default function Routes() {
  //const { step } = useContext(AppContext);
  const step = 2;
  console.log(step);

  return (
    <div className="h-screen">
      <header className=" border-b-2 h-1/6 flex items-center">
        <div className="w-[30px] h-full bg-[#20720D] text-[#20720D]">asdf</div>
        <div className="w-[10px] h-full bg-[#FDE100] text-[#FDE100]"></div>
        <div className="flex flex-row items-baseline ml-6">

          <img src={JohnDeere_Logo} width={100} height={50} alt="" />
          <h1 className="ml-5 text-2xl text-black font-trebuchet-ms">John Deere Simulation</h1>
        </div>
      </header>
      <div className="h-5/6">
        {step === 0 ?
          <EstablishConnection />
          : step === 1 ?
            <DuringSimulationPage />
            : step === 2 ?
              <BeforeSimulationPage />
              : step === 3 ?
                <AfterSimulationPage />
                :
                null
        }
      </div>
    </div>
  );
}