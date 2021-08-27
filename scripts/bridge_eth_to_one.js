require("dotenv").config()
const BN = require("bn.js")
const Web3 = require("web3")
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
);
const configs = require("bridge-sdk/lib/configs")
const https = require('https')

/* Create and sign a transaction to approve the Ethereum BUSD
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} Ethereum BUSD Manager Contract Approval hash
*/
async function approveBUSDEthManager(amountInWei) {
  // Get autheticated Web3 provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)
  )
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
  // retrieve BUSD contract
  const busdJson = require("./abi/BUSD.json")
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.ETH_BUSD_CONTRACT
  )
  // approve the transaction
  let transaction = await busdContract.methods
    .approve(process.env.ETH_BUSD_MANAGER_CONTRACT, amountInWei)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    })
  return transaction.transactionHash
}

/* Create and sign a lock transaction in the Ethereum BUSD
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} Lock transaction Approval hash
*/
async function lockTxn(amountInWei) {
  // Get autheticated Web3 provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)
  )
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  // retrieve BUSDEthManager contract
  const busdJson = require("./abi/BUSDEthManager.json")
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    process.env.ETH_BUSD_MANAGER_CONTRACT
  )
  // approve the transaction
  let transaction = await busdContract.methods
    .lockToken(amountInWei, account.address)
    .send({
      from: account.address,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash
}

/* Receives all the required information to send a POST request
 * to the API's `/swap/bridge-in` endpoint
 * @param {BigNumber} amount
 * @param {string} approveTxnHash
 * @param {string} lockTxnHash
 * @param {string} oneAddress
 * @param {string} ethAddress
*/
async function perform(approveTxnHash, lockTxnHash, amount, oneAddress, ethAddress) {
  // Create the body of the POST request
  const data = new TextEncoder().encode(
    JSON.stringify({
      "amount" : amount,
      "oneAddress" : oneAddress,
      "ethAddress" : ethAddress,
      "approveTxnHash" : approveTxnHash,
      "lockTxnHash" : lockTxnHash
    })
  )
  // set the option for the POST request
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
  // send the request and deal with the possible responses
  const request = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  request.on('error', error => {
    console.error(error)
  })
  request.write(data)
  request.end()
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
    // get the Ethereum BUSD Manager Contract Approval hash
    const approveTxnHash = await approveBUSDEthManager(amount)
    console.log("approveTxnHash", approveTxnHash)
    // get the Lock transaction hash
    const lockTxnHash = await lockTxn(amount)
    console.log("lockTxnHash", lockTxnHash)
    setTimeout(() => {
      // send the transaction to the API
      perform(approveTxnHash, lockTxnHash, amount, oneAddress, ethAddress).then(() => {
        console.log("done");
      })
    }, 10000)
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body)
  }
}

main().then(() => {})