pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract XCoin is ERC20Capped, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 cap
    ) ERC20(name, symbol) ERC20Capped(cap * (10 ** 18)) {
        if (initialSupply <= cap) {
            ERC20._mint(_msgSender(), initialSupply * (10**18));
        }
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}
