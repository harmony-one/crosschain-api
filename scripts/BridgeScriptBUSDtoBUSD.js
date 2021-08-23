
var request = require('request');
const ethers = require('ethers')
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

async function postRequest(url,body) {
  
  var clientServerOptions = {
    uri: url,
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(clientServerOptions, function (error, response) {
    console.log(error,response.body);
    return;
  });
}

async function main() {
  try {
    
    // const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);

    // let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    let amount = web3.utils.toWei("0.15", "ether");
    const approveTxnHash = await approveBUSDEthManager(amount);
    console.log("approveTxnHash", approveTxnHash);

    const lockTxnHash = await lockTxn(amount);
    console.log("lockTxnHash", lockTxnHash);

    const body = {
        "approveTxnHash" : approveTxnHash, 
        "lockTxnHash" : lockTxnHash, 
        "oneAddress" : "0x9E1AD78422Fd571B26D93EeB895f631A67Cd5462",
        "ethAddress" : "0x9E1AD78422Fd571B26D93EeB895f631A67Cd5462",
        "amount" : amount
        // "wallet" : wallet
      }

    await postRequest('http://localhost:3000/lp/addLiquidity',body)
    // await postRequest('http://localhost:3000/lp/swap',body) 
 
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});