import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import Background from "../public/background.png"
import Background2 from "../public/johndeere.png"
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

    <div className="bg-cover grid grid-cols-2 gap-6">
      <div className="">
        <img src={Background} alt="" className="absolute w-1/2 h-full" />
        <div className=" w-full h-full p-10 justify-center items-center" >
          <form
            className="h-full w-full bg-[#ffffff6e] rounded-lg p-6 inline-block relative"
            onSubmit={handleSubmit}

          >
            <pre className="flex mb-11 justify-center items-center">
              <p className=" text-white ">Ingresar datos de su cultivo </p>
            </pre>

            <div className="w-full flex flex-col ">
              <div className="flex-col w-full px-4">
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
              <div className="flex-col w-full px-4 mt-5">
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

              <div className="flex-col w-full px-4 mt-5">
                <p>Cuantos harvesters </p>
              </div>
            </div>



            <div className="w-full flex justify-center mt-4">
              <button
                className="bg-[#20720D] text-white rounded p-1 mt-4 w-1/2 hover:bg-[#86ab7d]"
                type="submit"
              >
                Iniciar simulación
              </button>
            </div>
          </form>

        </div>

      </div>

      <div className="flex items-center content-center">
        render de inputs
      </div>

    </div >
  );
}