require("dotenv").config()
const BN = require("bn.js")
const Web3 = require("web3")
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
);
const configs = require("bridge-sdk/lib/configs")
const https = require('https')

/* Create and sign a transaction to approve the Harmony Bridge
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} Harmony Bridge Manager Contract Approval hash
*/
async function approveBridgeManager(amountInWei) {
  // Get autheticated Web3 provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  )
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  // retrieve BUSD contract
  const busdJson = require("./abi/BUSD.json")
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.HMY_BSC_BUSD_CONTRACT
  )
  // approve the transaction
  let transaction = await busdContract.methods
    .approve(process.env.HMY_BRIDGE_MANAGER_MANAGER_CONTRACT, amountInWei)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    })
  return transaction.transactionHash
}

/* Create and sign a deposit transaction in the Harmony Bridge
 * manager contract.
 * @return {string} deposit transaction Approval hash
*/
async function deposit() {
  // Get autheticated Web3 provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  )
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  // retrieve Deposit contract
  const contractJson = require("./abi/Deposit.json")
  const contract = new web3.eth.Contract(
    contractJson.abi, 
    process.env.DEPOSIT
  )
  // approve the transaction
  let response = await contract.methods
    .deposit(web3.utils.toWei("15", "ether"))
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
      value: web3.utils.toWei("15", "ether"),
    })
  return response.transactionHash
}

/* Create and sign a burn transaction in the Harmony Bridge
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} burn transaction Approval hash
*/
async function burnTxn(amountInWei) {
  // Get autheticated Web3 provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
  )
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
  // retrieve BridgeManager contract
  const busdJson = require("./abi/BridgeManager.json")
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.HMY_BRIDGE_MANAGER_MANAGER_CONTRACT
  )
  // approve the transaction
  let transaction = await busdContract.methods
    .burnToken(process.env.HMY_BSC_BUSD_CONTRACT, amountInWei, account.address)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    })
  return transaction.transactionHash;
}

/* Receives all the required information to send a POST request
 * to the API's `/swap/bridge-out` endpoint
 * @param {BigNumber} amount
 * @param {string} approveTxnHash
 * @param {string} depositTxnHash
 * @param {string} burnTxnHash
 * @param {string} oneAddress
 * @param {string} ethAddress
*/
async function perform(amount, approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress) {
  // Create the body of the POST request
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
  // set the option for the POST request
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
  // send the request and deal with the possible responses
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

/* Generate the transaction hashes and send the
 * POST request to the cross-chain API
*/
async function main() {
  try {
    // Set initial values
    const oneAddress = "Your From Address"
    const ethAddress = "Your To Address"
    let amount = web3.utils.toWei("1", "ether")
    // get the Bridge Manager Contract Approval hash
    const approveTxnHash = await approveBridgeManager(amount)
    console.log("approveTxnHash", approveTxnHash)
    // get the deposit transaction hash
    const depositTxnHash = await deposit()
    console.log("depositTxnHash", depositTxnHash)
    // get the burn transaction hash
    const burnTxnHash = await burnTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount)
    console.log("burnTxnHash", burnTxnHash)
    // send the transaction to the API
    setTimeout(() => {
      await perform(amount, approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress).then(() => {
        console.log("done")
      })
    }, 10000)
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body)
  }
}

main().then(() => {});