import React from "react";
import { ToastContextProvider } from "./contexts/ToastContext";
import { StakingContextProvider } from "./contexts/StakingContext";
import { WalletContextProvider } from "./contexts/WalletContext";
import Dashboard from "./components/Dashboard";
import "./App.css";

const App = () => {
  return (
    <ToastContextProvider>
      <WalletContextProvider>
        <StakingContextProvider>
          <Dashboard />
        </StakingContextProvider>
      </WalletContextProvider>
    </ToastContextProvider>
  );
};

export default App;
