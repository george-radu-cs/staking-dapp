import React, { createContext, useReducer } from "react";
import Reducer from "../reducers";

const initialState = {
  wallet: {
    address: "",
  },
};

const WalletContext = createContext(initialState);

export const WalletContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <WalletContext.Provider value={[state, dispatch]}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
