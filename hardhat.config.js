require('@nomiclabs/hardhat-waffle');

const providerUrl = process.env.MAINNET_PROVIDER_URL;
const mnemonic = process.env.DEV_ETH_MNEMONIC;

module.exports = {
  solidity: {
    version: '0.8.12',
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: providerUrl,
        blockNumber: 14522506,
      },
      accounts: {
        mnemonic,
      },
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  },
  mocha: {
    timeout: 60000
  }
};