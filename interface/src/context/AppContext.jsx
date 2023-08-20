import {createContext, useEffect, useState} from "react";

export const AppContext = createContext({});

export function AppContextProvider({children}) {
  const [step, setStep] = useState(0); // 0: establish connection, 1: before simulation, 2: during simulation, 3: after simulation
  const [ws, setWs] = useState(null);

  function handleMessage(ev) {
    console.log("message received", ev);
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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}