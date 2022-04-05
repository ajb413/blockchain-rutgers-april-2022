const hre = require('hardhat');
const ethers = hre.ethers;
const { cTokens, underlyings, decimals, erc20Abi } = require('./tokens.js');

const provider = ethers.provider;
let accounts, snapshot;

describe('InterestRateApp', function() {
  let interestRateApp;

  before(async () => {
    accounts = (await ethers.getSigners()).map(a => a.address);
    await makeForkedChainSnapshot();
  });

  beforeEach(async () => {
    await resetForkedChain();
    await makeForkedChainSnapshot();

    // Make an ethers contract object with the owner (deployer) account as the signer
    const InterestRateApp = await ethers.getContractFactory('InterestRateApp');
    interestRateApp = await InterestRateApp.deploy();

    // Unlock cToken addresses so we can seed our accounts with tokens
    await unlockCTokenAddresses();

    await seedUsingLp(accounts[0], 'USDC', 1000, provider);
  });

  it('Deposits USDC', async () => {
    const USDC = 'USDC';
    const numTokens = 500 * Math.pow(10, decimals[USDC]);
    const usdc = new ethers.Contract(underlyings[USDC], erc20Abi, provider.getSigner(accounts[0]));

    const tx1 = await usdc.transfer(interestRateApp.address, numTokens);
    await tx1.wait(1);

    const tx2 = await interestRateApp.deposit(cTokens['c' + USDC], underlyings[USDC], numTokens);
    await tx2.wait(1);

    const cUsdc = new ethers.Contract(cTokens['c' + USDC], erc20Abi, provider.getSigner(accounts[0]));
    const balance = await cUsdc.callStatic.balanceOf(interestRateApp.address);

    console.log('cToken Balance', +balance.toString() / 1e8);
  });

  it('Redeems USDC', async () => {
    const USDC = 'USDC';
    const numTokens = 500 * Math.pow(10, decimals[USDC]);
    const usdc = new ethers.Contract(underlyings[USDC], erc20Abi,  provider.getSigner(accounts[0]));
    const tx1 = await usdc.transfer(interestRateApp.address, numTokens);
    await tx1.wait(1);

    const tx2 = await interestRateApp.deposit(cTokens['c' + USDC], underlyings[USDC], numTokens);
    await tx2.wait(1);

    const cUsdc = new ethers.Contract(cTokens['c' + USDC], erc20Abi,  provider.getSigner(accounts[0]));
    const balance = await cUsdc.callStatic.balanceOf(interestRateApp.address);

    const tx3 = await interestRateApp.withdraw(cTokens['c' + USDC], balance);
    await tx3.wait(1);

    const balanceUsdc = await usdc.callStatic.balanceOf(interestRateApp.address);
    console.log('USDC balance', +balanceUsdc.toString() / 1e6);
  });
});

async function resetForkedChain() {
  await hre.network.provider.request({
    method: 'evm_revert',
    params: [ snapshot ] // snapshot is global
  });
}

async function makeForkedChainSnapshot() {
  // snapshot is global
  snapshot = await hre.network.provider.request({ method: 'evm_snapshot' });
}

async function seedUsingLp(addressToSeed, underlyingSymbol, amount, provider) {
  const numToSeed = amount * Math.pow(10, decimals[underlyingSymbol]);
  const cTokenAddress = cTokens['c' + underlyingSymbol];
  const underlyingAddress = underlyings[underlyingSymbol];
  const unlockedCTokenSigner = provider.getSigner(cTokenAddress);
  let underlying = new ethers.Contract(underlyingAddress, erc20Abi, unlockedCTokenSigner);
  const trx = await underlying.transfer(addressToSeed, numToSeed.toString());
  await trx.wait(1);
}

async function unlockCTokenAddresses() {
  const txns = [];
  Object.keys(cTokens).forEach((symbol) => {
    const address = cTokens[symbol];
    txns.push(hre.network.provider.send('hardhat_impersonateAccount', [ address ]));
  });
  await Promise.all(txns);
}
