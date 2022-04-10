import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";
import React, { useContext, useEffect, useState } from "react";
import StakingContext from "../contexts/StakingContext";
import WalletContext from "../contexts/WalletContext";
import UseToastContext from "../hooks/UseToastContext";
import { SET_WALLET_ADDRESS } from "../reducers";
import "./WalletConnector.css";

const WalletConnector = () => {
  const stakingContext = useContext(StakingContext);
  const [walletContext, dispatch] = useContext(WalletContext);
  const addToast = UseToastContext();

  useEffect(() => {
    (async () => {
      await addWalletListener();
    })();
  }, []);

  const updateWalletContext = (address) => {
    dispatch({
      type: SET_WALLET_ADDRESS,
      payload: {
        address: address,
      },
    });
  };

  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          updateWalletContext("");
          addToast({
            title: "Wallet disconnected",
            message: "Please connect to the Rinkeby test network",
            isError: true,
          });
        }

        if (accounts.length > 0) {
          updateWalletContext(accounts[0]);
        } else {
          updateWalletContext("");
          addToast({
            title: "Wallet disconnected",
            message: "Accounts not found",
            isError: true,
          });
        }
      });
    } else {
      updateWalletContext("");
      addToast({
        title: "Wallet disconnected",
        message:
          "You must install MetaMask, a crypto wallet, in your browser to connect to the web3. Visit https://metamask.io/download/",
        link: "https://metamask.io/download/",
        isError: true,
      });
    }
  };

  const connectWallet = async () => {
    const { address, err, link } = await stakingContext.connectWallet();
    updateWalletContext(address);
    if (err) {
      addToast({
        title: "Wallet not connected",
        message: err,
        link: link,
        isError: true,
      });
    } else {
      addToast({
        title: "Wallet connected",
        message:
          "You've successfully connected your account with the application",
      });
    }
  };

  const disconnectWallet = async () => {
    await stakingContext.disconnectWallet();
    updateWalletContext("");
    addToast({
      title: "Wallet disconnected",
      message: "Wallet was successfully disconeccted",
    });
  };

  return (
    <div className="wallet-connector-container">
      {walletContext.wallet.address === "" ? (
        <button className="btn" onClick={connectWallet}>Connect wallet</button>
      ) : (
        <div className="wallet-connector-connected-container">
          <div className="wallet-connector-text">
            You are connected with the wallet: {walletContext.wallet.address}
          </div>
          <button className="btn" onClick={disconnectWallet}>Disconnect wallet</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
