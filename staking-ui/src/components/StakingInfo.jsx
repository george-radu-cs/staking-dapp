import React, { useContext, useEffect, useState } from "react";
import StakingContext from "../contexts/StakingContext";
import WalletContext from "../contexts/WalletContext";
import UseToastContext from "../hooks/UseToastContext";
import ReactLoading from "react-loading";
import { formatEther } from "ethers/lib/utils";
import * as utils from "../utils";
import "./StakingInfo.css";

const StakingInfo = () => {
  const stakingContext = useContext(StakingContext);
  const [walletContext, dispatch] = useContext(WalletContext);
  const [stakeInfo, setStakeInfo] = useState({
    totalStakedAmount: "0",
    totalLoanedAmount: "0",
    rewardRate: "0",
  });
  const [userInfo, setUserInfo] = useState({
    stakedAmount: "0",
    rewardAmount: "0",
    lastRewardUpdate: "",
    currentReward: "",
  });
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const addToast = UseToastContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const totalStakedAmountResponse =
        await stakingContext.getTotalStakedAmount();
      const totalLoanedAmountResponse =
        await stakingContext.getTotalLoanedAmount();
      const rewardRateResponse = await stakingContext.getRewardRate();
      const userInfoResponse = await stakingContext.getUserInfo(
        walletContext.wallet.address
      );
      const newStakeInfo = {
        ...stakeInfo,
        totalStakedAmount: totalStakedAmountResponse,
        totalLoanedAmount: totalLoanedAmountResponse,
        rewardRate: rewardRateResponse,
      };
      const newUserInfo = {
        ...userInfoResponse,
      };
      setStakeInfo(newStakeInfo);
      setUserInfo(newUserInfo);
      setFirstFetch(true);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (firstFetch) {
      stakingContext.contract.on(
        "UpdatedTotalStakedAmount",
        (totalStakedAmount) => {
          const newStakeInfo = {
            ...stakeInfo,
            totalStakedAmount: formatEther(totalStakedAmount),
          };
          setStakeInfo(newStakeInfo);
        }
      );

      stakingContext.contract.on(
        "UpdatedUserInfo",
        (stakedAmount, rewardAmount, lastRewardUpdate) => {
          const newUserInfo = {
            ...userInfo,
            stakedAmount: formatEther(stakedAmount),
            rewardAmount: formatEther(rewardAmount),
            lastRewardUpdate: lastRewardUpdate * 1000,
          };
          setUserInfo(newUserInfo);
        }
      );
    }
  }, [firstFetch]);

  const getCurrentReward = async () => {
    try {
      setUpdateLoading(true);
      const currentRewardResponse = await stakingContext.getCurrentReward(
        walletContext.wallet.address,
        userInfo.rewardAmount
      );
      const newUserInfo = {
        ...userInfo,
        currentReward: currentRewardResponse,
      };
      setUserInfo(newUserInfo);
      setUpdateLoading(false);
    } catch (err) {
      setUpdateLoading(false);
      addToast({
        title: "Reinvest reward failure",
        message: err.message,
        isError: true,
      });
    }
  };

  if (loading) {
    return <ReactLoading type={"spinningBubbles"} color={"#778899"} />;
  }

  return (
    <div className="staking-info-container">
      <div className="staking-info-subcontainer">
        <div className="staking-info-subcontainer-subtitle">Stake info</div>
        <div>
          Total staked: {stakeInfo.totalStakedAmount} {utils.TOKEN_SYMBOL}
        </div>
        <div>
          Total loaned: {stakeInfo.totalLoanedAmount} {utils.TOKEN_SYMBOL}
        </div>
        <div>
          Reward rate: {stakeInfo.rewardRate} {utils.TOKEN_SYMBOL}
        </div>
      </div>

      <div className="staking-info-subcontainer">
        <div className="staking-info-subcontainer-subtitle">User info</div>
        <div>
          Your stake: {userInfo.stakedAmount} {utils.TOKEN_SYMBOL}
        </div>
        <div>
          Your computed reward reward: {userInfo.rewardAmount}{" "}
          {utils.TOKEN_SYMBOL}
        </div>
        <div>
          Last reward update:{" "}
          {new Date(userInfo.lastRewardUpdate).toLocaleString()}
        </div>

        <div
          style={{ marginTop: "1rem", marginBottom: "1rem", textAlign: "left" }}
        >
          Your reward is increasing little by little as you read this. The above
          amount is latest saved amount when you interacted with this contract.
          To see your current reward click on the button below To see your
          current reward click on the button below.
        </div>

        <button
          className="btn"
          onClick={getCurrentReward}
          disabled={updateLoading}
        >
          Check current reward
        </button>

        {updateLoading ? (
          <ReactLoading type={"spinningBubbles"} color={"#778899"} />
        ) : null}
        {userInfo.currentReward ? (
          <div>
            Your current reward: {userInfo.currentReward} {utils.TOKEN_SYMBOL}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StakingInfo;
