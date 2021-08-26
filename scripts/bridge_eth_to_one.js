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

async function perform(approveTxnHash, lockTxnHash, amount, oneAddress, ethAddress) {
  const https = require('https')

    const data = new TextEncoder().encode(
        JSON.stringify({
            "amount" : amount,
            "oneAddress" : oneAddress,
            "ethAddress" : ethAddress,
            "approveTxnHash" : approveTxnHash,
            "lockTxnHash" = lockTxnHash
        })
    )

    const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/swap/bridge-in',
    method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
}

async function main() {
  try {
    const oneAddress = "Your From Address"
    const ethAddress = "Your To Address"
    let amount = web3.utils.toWei("1", "ether");
    const approveTxnHash = await approveBUSDEthManager(amount);
    console.log("approveTxnHash", approveTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(approveTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);

    const lockTxnHash = await lockTxn(amount);
    console.log("lockTxnHash", lockTxnHash);

    // setTimeout(() => {  web3.eth.getTransactionReceipt(lockTxnHash).then((receipt)=>{console.log(receipt);}); }, 10000);
    setTimeout(() => {
      perform(approveTxnHash, lockTxnHash, amount, oneAddress, ethAddress).then(() => {
        console.log("done");
      });
    }, 10000);
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});
