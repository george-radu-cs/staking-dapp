import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import stakingContract from "./contracts/Staking.json";

class Staking {
  constructor() {
    if (window.ethereum) {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      this.contract = new ethers.Contract(
        contractAddress,
        stakingContract.abi,
        signer
      );
      this.wallet = "";
    }
  }

  // connect the wallet only on the rinkeby test network
  async connectWallet() {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const rinkebyChainId = "0x4";

      if (chainId !== rinkebyChainId) {
        this.wallet = "";
        return {
          address: "",
          err: "Please connect to the Rinkeby test network",
        };
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        this.wallet = accounts[0];

        return {
          address: accounts[0],
          err: "",
        };
      } catch (err) {
        this.wallet = "";
        return {
          address: "",
          err: err.message,
        };
      }
    } else {
      this.wallet = "";
      return {
        address: "",
        err: "You must install MetaMask, a crypto wallet, in your browser to connect to the web3. Visit https://metamask.io/download/",
        link: "https://metamask.io/download/",
      };
    }
  }

  async disconnectWallet() {
    this.wallet = "";
  }

  async isWalletConnected() {
    return !!this.wallet;
  }

  // readers
  async getTotalStakedAmount() {
    const totalStakedAmount = await this.contract.totalStakedAmount();
    return formatEther(totalStakedAmount);
  }

  async getTotalLoanedAmount() {
    const totalLoanedAmount = await this.contract.totalLoanedAmount();
    return formatEther(totalLoanedAmount);
  }

  async getRewardRate() {
    const rewardRate = await this.contract.rewardRate();
    return formatEther(rewardRate);
  }

  async getUserInfo(address) {
    const userInfo = await this.contract.users(address);
    return {
      stakedAmount: formatEther(userInfo.stakedAmount),
      rewardAmount: formatEther(userInfo.rewardAmount),
      lastRewardUpdate: userInfo.lastRewardUpdate * 1000,
    };
  }

  async getCurrentReward(address, oldRweardtring) {
    const currentReward = await this.contract.computeReward(address);
    const oldReward = parseEther(oldRweardtring)
    return formatEther(currentReward.add(oldReward));
  }

  // writers
  async stake(amount) {
    return await this.contract.stake(parseEther(amount));
  }

  async unstake(amount) {
    return await this.contract.unstake(parseEther(amount));
  }

  async withdrawReward() {
    return await this.contract.withdrawReward();
  }

  async reinvestReward() {
    return await this.contract.reinvestReward();
  }
}

export default Staking;
