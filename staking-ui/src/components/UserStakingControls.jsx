import React, { useContext, useEffect, useState } from "react";
import StakingContext from "../contexts/StakingContext";
import WalletContext from "../contexts/WalletContext";
import UseToastContext from "../hooks/UseToastContext";
import ReactLoading from "react-loading";
import * as utils from "../utils";
import "./UserStakingControls.css";

const UserStakingControls = () => {
  const stakingContext = useContext(StakingContext);
  const [walletContext, dispatch] = useContext(WalletContext);
  const [state, setState] = useState({
    stakeAmount: "0.0",
    unstakeAmount: "0.0",
  });
  const [loading, setLoading] = useState(false);
  const addToast = UseToastContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (utils.validateEtherValue(value)) {
      const newState = { ...state, [name]: value };
      setState(newState);
    }
  };

  const onStake = async () => {
    try {
      setLoading(true);
      const stakeResponse = await stakingContext.stake(state.stakeAmount);
      addToast({
        title: "Processing",
        message: "Your request is being processed",
      });

      await stakeResponse.wait();
      addToast({
        title: "Stake success",
        message: "The transaction was suscessful",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addToast({
        title: "Stake failure",
        message: err.message,
        isError: true,
      });
    }
  };

  const onUnstake = async () => {
    try {
      setLoading(true);
      const unstakeResponse = await stakingContext.unstake(state.unstakeAmount);
      addToast({
        title: "Processing",
        message: "Your request is being processed",
      });

      await unstakeResponse.wait();
      addToast({
        title: "Unstake success",
        message: "The transaction was suscessful",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addToast({
        title: "Unstake failure",
        message: err.message,
        isError: true,
      });
    }
  };

  const onWithdrawReward = async () => {
    try {
      setLoading(true);
      const withdrawRewardResponse = await stakingContext.withdrawReward();
      addToast({
        title: "Processing",
        message: "Your request is being processed",
      });

      await withdrawRewardResponse.wait();
      addToast({
        title: "Withdraw reward success",
        message: "The transaction was suscessful",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addToast({
        title: "Withdraw reward failure",
        message: err.message,
        isError: true,
      });
    }
  };

  const onReinvestReward = async () => {
    try {
      setLoading(true);
      const reinvestRewardResposne = await stakingContext.reinvestReward();
      addToast({
        title: "Processing",
        message: "Your request is being processed",
      });

      await reinvestRewardResposne.wait();
      addToast({
        title: "Reinvest reward success",
        message: "The transaction was suscessful",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addToast({
        title: "Reinvest reward failure",
        message: err.message,
        isError: true,
      });
    }
  };

  return (
    <div className="user-staking-controls-container">
      {loading ? (
        <ReactLoading type={"spinningBubbles"} color={"#778899"} />
      ) : null}

      <div className="input-container">
        <label>Stake Amount</label>
        <div>
          <input
            name="stakeAmount"
            value={state.stakeAmount}
            onChange={handleInputChange}
          />
          <span>{utils.TOKEN_SYMBOL}</span>
        </div>
        <button className="btn" onClick={onStake} disabled={loading}>
          Stake
        </button>
      </div>

      <div className="input-container">
        <label>Unstake Amount</label>
        <div>
          <input
            name="unstakeAmount"
            value={state.unstakeAmount}
            onChange={handleInputChange}
          />
          <span>{utils.TOKEN_SYMBOL}</span>
        </div>
        <button className="btn" onClick={onUnstake} disabled={loading}>
          Unstake
        </button>
      </div>

      <div className="input-container">
        <div>You can withdraw your reward obtained</div>
        <button className="btn" onClick={onWithdrawReward} disabled={loading}>
          Withdraw Reward
        </button>
      </div>

      <div className="input-container">
        <div>Or you can choose to stake your reward as well</div>
        <button className="btn" onClick={onReinvestReward} disabled={loading}>
          Reinvest Reward
        </button>
      </div>
    </div>
  );
};

export default UserStakingControls;
