const Reducer = (state, action) => {
  switch (action.type) {
    case SET_WALLET_ADDRESS:
      let wallet = state.wallet || {};
      wallet = { ...wallet, ...action.payload };
      return { ...state, wallet };
    default:
      return state;
  }
};

export const SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS";

export default Reducer;
