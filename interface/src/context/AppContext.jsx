import { createContext, useState } from "react";

export const AppContext = createContext({});

export function AppContextProvider({children}) {
  const [step, setStep] = useState(0); // 0: before simulation, 1: during simulation, 2: after simulation


  return(
    <AppContext.Provider
      value={{
        step,
        setStep,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}