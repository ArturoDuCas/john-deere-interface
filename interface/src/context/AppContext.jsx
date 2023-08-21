import React, {createContext, useEffect, useState} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const AppContext = createContext({});

export function AppContextProvider({children}) {
  const [step, setStep] = useState(0); // 0: establish connection, 1: before simulation, 2: during simulation, 3: after simulation
  const [id, setId] = useState(null); // TODO: set step back to 0
  const [ws, setWs] = useState(null);
  const [unityId, setUnityId] = useState("");

  function handleMessage(ev) {
    const data = JSON.parse(ev.data);
    console.log(data);
    if (data.type === "connection_info") {
      setId(data.data);
    } else if(data.type === "connected") {
      if(data.data === "true") {
        setStep(1);
      } else {
        toast.error("El ID es incorrecto", {
          pauseOnHover: false,
        })
        console.log("Connection failed.");
      }
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);


  return(
    <AppContext.Provider
      value={{
        step,
        setStep,
        ws,
        setWs,
        id,
        setId,
        unityId,
        setUnityId
      }}
    >
      {children}
    </AppContext.Provider>
  )
}