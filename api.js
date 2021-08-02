require("dotenv").config();
const {
  BridgeSDK,
  TOKEN,
  EXCHANGE_MODE,
  NETWORK_TYPE,
  ACTION_TYPE,
} = require("bridge-sdk");
const BN = require("bn.js");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
);
const configs = require("bridge-sdk/lib/configs");

// create and sign approve BUSD txn
async function approveBUSDEthManager(amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)
  );

  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const busdJson = require("./abi/BUSD.json");
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.ETH_BUSD_CONTRACT
  );

  let transaction = await busdContract.methods
    .approve(process.env.ETH_BUSD_MANAGER_CONTRACT, amountInWei)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

async function lockTxn(amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)
  );

  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const busdJson = require("./abi/BUSDEthManager.json");
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.ETH_BUSD_MANAGER_CONTRACT
  );

  let transaction = await busdContract.methods
    .lockToken(amountInWei, account.address)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

async function perform(approveTxnHash, lockTxnHash) {
  try {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);
    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ETH_TO_ONE,
      token: TOKEN.BUSD,
      network: NETWORK_TYPE.ETHEREUM, // NETWORK_TYPE.BINANCE
      amount: 1,
      oneAddress: "one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy",
      ethAddress: "0x0b585f8daefbc68a311fbd4cb20d9174ad174016",
    });

    await operation.confirmAction({
      actionType: ACTION_TYPE.approveEthManger,
      transactionHash: approveTxnHash,
    });

    await operation.confirmAction({
      actionType: ACTION_TYPE.lockToken,
      transactionHash: lockTxnHash,
    });
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

async function main() {
  try {
    let amount = web3.utils.toWei("1", "ether");
    const approveTxnHash = await approveBUSDEthManager(amount);
    console.log("approveTxnHash", approveTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(approveTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);

    const lockTxnHash = await lockTxn(amount);
    console.log("lockTxnHash", lockTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(lockTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);
    setTimeout(() => {
      perform(approveTxnHash, lockTxnHash).then(() => {
        console.log("done");
      });
    }, 10000);
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});
