import React, { createContext } from "react";
import { PersonasProvider } from "./ContextPersonas";
import { SeguimientosProvider } from "./ContextSeguimiento";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const globalContextValue = {};

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <PersonasProvider>
        <SeguimientosProvider>
        {children}
        </SeguimientosProvider>
      </PersonasProvider>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
