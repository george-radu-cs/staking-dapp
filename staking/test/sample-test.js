const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Staking", () => {
  let stakingOwner;
  let user1;
  let user2;
  let name = "Xcoin";
  let symbol = "XCN";
  let initialSupply = 1000000;
  let rewardRate = 1;
  let staking;

  beforeEach(async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(name, symbol, initialSupply, rewardRate);
    await staking.deployed();
    stakingOwner = owner;
    user1 = addr1;
    user2 = addr2;
  });

  // stake
  it("You can't create a stake with 0 coins", async () => {
    await expect(staking.stake(BigNumber.from("0"))).to.be.revertedWith(
      "Amount to be staked must be a pozitive number!"
    );
  });

  it("You can't stake more coins than your balance", async () => {
    await expect(
      staking.connect(user1).stake(BigNumber.from("1000"))
    ).to.be.revertedWith("You don't have enough balance to stake!");
  });

  it("When someone stake the user data should change!", async () => {
    let initialBalance = await staking.balanceOf(stakingOwner.address);

    const stakeTx = await staking
      .connect(stakingOwner)
      .stake(BigNumber.from("10000"));
    await stakeTx.wait();

    let balanceAfterStake = await staking.balanceOf(stakingOwner.address);

    let user = await staking.users(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("10000"));
    expect(user.rewardAmount).to.eq(BigNumber.from("0"));
    expect(user.stakedAmount).to.eq(BigNumber.from("10000"));
    expect(balanceAfterStake).to.eq(
      initialBalance.sub(BigNumber.from("10000"))
    );
  });

  it("The amount of the reward should change if you already have a stake", async () => {
    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    let initialOwnerData = await staking.users(stakingOwner.address);
    expect(initialOwnerData.rewardAmount).to.eq(BigNumber.from("0"));

    const stakeTx2 = await staking.stake(BigNumber.from("10000"));
    await stakeTx2.wait();

    let secondOwnerData = await staking.users(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("20000"));
    expect(secondOwnerData.stakedAmount).to.eq(BigNumber.from("20000"));
    expect(secondOwnerData.rewardAmount).to.not.eq(BigNumber.from("0"));
  });

  it("Check stake with 2 user", async () => {
    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    const transferTX = await staking.transfer(
      user1.address,
      BigNumber.from("10000")
    );
    await transferTX.wait();

    const stakeTx2 = await staking
      .connect(user1)
      .stake(BigNumber.from("10000"));
    await stakeTx2.wait();

    let ownerData = await staking.users(stakingOwner.address);
    let userData = await staking.users(user1.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("20000"));
    expect(ownerData.stakedAmount).to.eq(BigNumber.from("10000"));
    expect(userData.stakedAmount).to.eq(BigNumber.from("10000"));
    expect(ownerData.rewardAmount).to.eq(BigNumber.from("0"));
    expect(userData.rewardAmount).to.eq(BigNumber.from("0"));
  });

  // unstake
  it("The unstake amount should be greater than 0", async () => {
    await expect(staking.unstake(BigNumber.from("0"))).to.be.revertedWith(
      "Amount to be unstaked must be a pozitive number!"
    );
  });

  it("The transaction will be reverted because the user unstake a bigger amount", async () => {
    await expect(staking.unstake(BigNumber.from("10"))).to.be.revertedWith(
      "You don't have enough staked amount to unstake!"
    );
  });

  it("When someone unstake some coins the total stake amount and user info should change!", async () => {
    let initialBalance = await staking.balanceOf(stakingOwner.address);

    const stakeTx = await staking
      .connect(stakingOwner)
      .stake(BigNumber.from("10000"));
    await stakeTx.wait();

    const unstakeTx = await staking
      .connect(stakingOwner)
      .unstake(BigNumber.from("5000"));
    await unstakeTx.wait();

    let finalBalance = await staking.balanceOf(stakingOwner.address);

    let user = await staking.users(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("5000"));
    expect(user.stakedAmount).to.eq(BigNumber.from("5000"));
    expect(user.rewardAmount).to.not.eq(BigNumber.from("0"));
    expect(initialBalance).to.eq(finalBalance.add(BigNumber.from("5000")));
  });

  it("When someone unstake their entire stake amount, the reward amount should be sent!", async () => {
    let initialBalance = await staking.balanceOf(stakingOwner.address);

    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    // add 10 seconds to have time to gather reward
    await ethers.provider.send("evm_increaseTime", [10]);
    // force mine the next block
    await ethers.provider.send("evm_mine", []);

    const unstakeTx = await staking.unstake(BigNumber.from("10000"));
    await unstakeTx.wait();

    let ownerData = await staking.users(stakingOwner.address);
    let finalBalance = await staking.balanceOf(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("0"));
    expect(ownerData.stakedAmount).to.eq(BigNumber.from("0"));
    expect(ownerData.rewardAmount).to.eq(BigNumber.from("0"));
    expect(finalBalance).to.be.gte(initialBalance);
  });

  it("After you unstake and withdraw reward try to stake", async () => {
    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    const unstakeTx = await staking.unstake(BigNumber.from("5000"));
    await unstakeTx.wait();

    const withdrawTx = await staking.withdrawReward();
    await withdrawTx.wait();

    // get balance after unstake half of staked amount and withdraw reward
    let initialBalance = await staking.balanceOf(stakingOwner.address);

    const secondStakeTx = await staking.stake(BigNumber.from("5000"));
    await secondStakeTx.wait();

    let ownerData = await staking.users(stakingOwner.address);

    // get the balance after staking another 5000 coints
    let finalBalance = await staking.balanceOf(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.eq(BigNumber.from("10000"));
    expect(ownerData.stakedAmount).to.eq(BigNumber.from("10000"));
    expect(ownerData.rewardAmount).to.not.eq(BigNumber.from("0"));
    expect(initialBalance).to.eq(finalBalance.add(BigNumber.from("5000")));
  });

  // withdrawReward
  it("The stake amount should not be 0 before withdrawing the reward", async () => {
    await expect(staking.withdrawReward()).to.be.revertedWith(
      "You must stake before withdrawing the reward!"
    );
  });

  it("The withdraw reward was a success", async () => {
    let initialBalance = await staking.balanceOf(stakingOwner.address);

    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    // add 5 seconds to have time to gather reward
    await ethers.provider.send("evm_increaseTime", [5]);

    const withdrawTx = await staking.withdrawReward();
    await withdrawTx.wait();

    let finalBalance = await staking.balanceOf(stakingOwner.address);

    expect(finalBalance).to.eq(initialBalance.sub(BigNumber.from("9995")));
  });

  // computeReward
  it("The stake amount should not be 0 before computing the reward", async () => {
    await expect(
      staking.computeReward(stakingOwner.address)
    ).to.be.revertedWith("User must stake before computing the reward!");
  });

  it("Test compute reward should return a pozitive amount", async () => {
    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    const stakeTx2 = await staking.stake(BigNumber.from("10000"));
    await stakeTx2.wait();

    // add 10 seconds to have time to gather reward
    await ethers.provider.send("evm_increaseTime", [10]);
    // force mine the next block
    await ethers.provider.send("evm_mine", []);

    expect(await staking.computeReward(stakingOwner.address)).to.be.gt(
      BigNumber.from("0")
    );
  });

  // reinvestReward
  it("You can't reinvest if stake amount is 0", async () => {
    await expect(staking.connect(user1).reinvestReward()).to.be.revertedWith(
      "You must stake before reinvesting the reward!"
    );
  });

  it("Reinvest test", async () => {
    const stakeTx = await staking.stake(BigNumber.from("10000"));
    await stakeTx.wait();

    let initialOwnerData = await staking.users(stakingOwner.address);

    expect(initialOwnerData.rewardAmount).to.eq(BigNumber.from("0"));
    expect(initialOwnerData.stakedAmount).to.eq(BigNumber.from("10000"));

    // add 10 seconds to have time to gather reward
    await ethers.provider.send("evm_increaseTime", [10]);
    // force mine the next block
    await ethers.provider.send("evm_mine", []);

    const reinvestTx = await staking.reinvestReward();
    await reinvestTx.wait();

    let finalOwnerData = await staking.users(stakingOwner.address);

    expect(await staking.totalStakedAmount()).to.be.gt(BigNumber.from("10000"));
    expect(finalOwnerData.stakedAmount).to.be.gt(BigNumber.from("10000"));
    expect(finalOwnerData.rewardAmount).to.eq(BigNumber.from("0"));
  });
});
