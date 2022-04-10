import React from "react";
import Staking from "../Staking";

const StakingContext = React.createContext();

export const StakingContextProvider = ({ children }) => {
  const staking = new Staking();

  return (
    <StakingContext.Provider value={staking}>
      {children}
    </StakingContext.Provider>
  );
};

export default StakingContext;
