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

async function perform(approveTxnHash, lockTxnHash) {
  const https = require('https')

    const data = new TextEncoder().encode(
        JSON.stringify({
            "amount" : amount,
            "oneAddress" : oneAddress,
            "ethAddress" : ethAddress,
            "approveTxnHash" : approveTxnHash,
            "depositTxnHash" : depositTxnHash,
            "burnTxnHash" : burnTxnHash
        })
    )

    const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/swap/bridge-out',
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
