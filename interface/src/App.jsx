import React from 'react'
import { AppContextProvider } from "./context/AppContext.jsx";
import Routes from "./routes/Routes.jsx";
import { ToastContainer } from "react-toastify";

function App() {

  return (
    <AppContextProvider >
      <Routes/>
      <ToastContainer
        position="bottom-left"
        pauseOnFocusLoss={false}
      />
    </AppContextProvider>
  )
}

export default App
