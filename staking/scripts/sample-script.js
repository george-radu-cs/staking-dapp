// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // test deploy XCoin
  // const XCoin = await hre.ethers.getContractFactory("XCoin");
  // const xCoin = await XCoin.deploy("XCoin", "XCN", 1000);

  // await xCoin.deployed();

  // console.log("XCoin deployed to:", xCoin.address);

  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy("XCoin", "XCN", 1000, BigNumber.from("10000000000000"));

  await staking.deployed();

  console.log("Staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
