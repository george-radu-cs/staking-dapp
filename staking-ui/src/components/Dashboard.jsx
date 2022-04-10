import React, { useContext } from "react";
import WalletConnector from "./WalletConnector";
import WalletContext from "../contexts/WalletContext";
import StakingInfo from "./StakingInfo";
import "./Dashboard.css";
import UserStakingControls from "./UserStakingControls";

const Dashboard = () => {
  const [walletContext, dispatch] = useContext(WalletContext);

  return (
    <main className="App">
      <header>
        <h1>Staking App</h1>
        <WalletConnector />
      </header>

      {walletContext.wallet.address ? (
        <div className="dashboard-container">
          <div className="dashboard-subcontainer">
            <StakingInfo />
          </div>

          <div className="dashboard-subcontainer">
            <UserStakingControls />
          </div>
        </div>
      ) : (
        <div className="dashboard-container">
          Please connect your wallet to use the app.
        </div>
      )}
    </main>
  );
};

export default Dashboard;
