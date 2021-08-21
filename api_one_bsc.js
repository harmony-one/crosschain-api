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

async function deposit() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  );

  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contractJson = require("./abi/Deposit.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.DEPOSIT);

  let response = await contract.methods
    .deposit(web3.utils.toWei("15", "ether"))
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
      value: web3.utils.toWei("15", "ether"),
    });

  return response.transactionHash;
}

// create and sign approve BUSD txn
async function approveBUSDEthManager(amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  );

  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const busdJson = require("./abi/BUSD.json");
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.HMY_BSC_BUSD_CONTRACT
  );

  let transaction = await busdContract.methods
    .approve(process.env.HMY_BRIDGE_MANAGER_MANAGER_CONTRACT, amountInWei)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

async function burnTxn(amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  );

  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const busdJson = require("./abi/BridgeManager.json");
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.HMY_BRIDGE_MANAGER_MANAGER_CONTRACT
  );

  let transaction = await busdContract.methods
    .burnToken(process.env.HMY_BSC_BUSD_CONTRACT, amountInWei, account.address)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

async function perform(depositTxnHash, approveTxnHash, burnTxnHash, amt) {
  try {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);
    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ONE_TO_ETH,
      token: TOKEN.ERC20,
      erc20Address: process.env.BSC_BUSD_CONTRACT,
      network: NETWORK_TYPE.BINANCE, // NETWORK_TYPE.BINANCE
      amount: amt/1e18,
      oneAddress: "one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy",
      ethAddress: "0x0b585f8daefbc68a311fbd4cb20d9174ad174016",
    });

    await operation.confirmAction({
      actionType: ACTION_TYPE.depositOne,
      transactionHash: depositTxnHash,
    });

    await operation.confirmAction({
      actionType: ACTION_TYPE.approveHmyManger,
      transactionHash: approveTxnHash,
    });

    await operation.confirmAction({
      actionType: ACTION_TYPE.burnToken,
      transactionHash: burnTxnHash,
    });
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

async function main() {
  try {

    const depositTxnHash = await deposit();
    console.log("depositTxnHash", depositTxnHash);

    let amount = web3.utils.toWei("2", "ether");
    const approveTxnHash = await approveBUSDEthManager(amount);
    console.log("approveTxnHash", approveTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(approveTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);

    const burnTxnHash = await burnTxn(amount);
    console.log("burnTxnHash", burnTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(lockTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);
    setTimeout(() => {
      perform(depositTxnHash, approveTxnHash, burnTxnHash, amount).then(() => {
        console.log("done");
      });
    }, 15000);
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});
