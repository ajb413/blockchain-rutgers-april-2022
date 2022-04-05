// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface ERC20 {
  function approve(address spender, uint256 amount) external returns (bool);
}

interface CToken {
  function mint(uint mintAmount) external returns (uint);
  function redeem(uint redeemTokens) external returns (uint);
}

contract InterestRateApp {

  function deposit(address _cToken, address underlying, uint amount) public {
    ERC20 erc20 = ERC20(underlying);
    erc20.approve(_cToken, amount);

    CToken cToken = CToken(_cToken);
    uint result = cToken.mint(amount);
    require(result == 0);
  }

  function withdraw(address _cToken, uint amount) public {
    CToken cToken = CToken(_cToken);
    uint result = cToken.redeem(amount);
    require(result == 0);
  }

}