# Staking contract

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

```shell
npx hardhat run scripts/sample-script.js --network rinkeby

npx hardhat verify --contract contracts/XCoin.sol:XCoin --network rinkeby <address> "XCoin" "XCN" 1000

npx hardhat verify --contract contracts/Staking.sol:Staking --network rinkeby <address> "XCoin" "XCN" 1000 100000000000 10000000000000
```
