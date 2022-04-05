const cTokens = {
  "cWBTC": "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4",
  "cUSDC": "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
  "cDAI": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
};

const underlyings = {
  "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

const decimals = {
  "USDC": 6,
  "DAI": 18,
  "WBTC": 8,
};

const erc20Abi = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transfer(address recipient, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public returns (uint)',
];

module.exports = {
  cTokens,
  underlyings,
  decimals,
  erc20Abi,
};
