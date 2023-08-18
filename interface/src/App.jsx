import React from 'react'
import { AppContextProvider } from "./context/AppContext.jsx";
import Routes from "./routes/Routes.jsx";

function App() {

  return (
    <AppContextProvider >
      <Routes/>
    </AppContextProvider>
  )
}

export default App
