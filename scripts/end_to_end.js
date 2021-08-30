require("dotenv").config()
const BN = require("bn.js")
const Web3 = require("web3")
const https = require('https')
var contracts = require('./contracts.js')
const ChainId = require('@venomswap/sdk').ChainId
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
)

// Bridge ETH to ONE

/* Create and sign a transaction to approve the Ethereum BUSD
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} Ethereum BUSD Manager Contract Approval hash
*/
async function approveBUSDEthManager(amountInWei) {
  // Get autheticated Web3 provider
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

// Bridge ONE to BSC

/* Create and sign a transaction to approve the Harmony Bridge
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} Harmony Bridge Manager Contract Approval hash
*/
async function approveBridgeManager(amountInWei) {
  // Get autheticated Web3 provider
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
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
  let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
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
    });
  return response.transactionHash
}

/* Create and sign a burn transaction in the Harmony Bridge
 * manager contract.
 * @param {BigNumber} amountInWei
 * @return {string} burn transaction Approval hash
*/
async function burnTxn(amountInWei) {
  // Get autheticated Web3 provider
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
    });
  return transaction.transactionHash
}

/* Receives all the required information to send a POST request
 * to the API's `/swap/viper` endpoint
 * @param {BigNumber} amount
 * @param {string} oneAddress
 * @param {string} ethAddress
 * @param {Contract} routerContract
 * @param {string} fromTokenContract
 * @param {string} toTokenContract
*/
async function perform(
            amount, 
            oneAddress, 
            ethAddress, 
            routerContract, 
            fromTokenContract, 
            toTokenContract, 
            lockApproveTxnHash, 
            lockTxnHash,
            burnApproveTxnHash, 
            depositTxnHash, 
            burnTxnHash
            ) {
  // Create the body of the POST request
  const data = new TextEncoder().encode(
    JSON.stringify({
      "amount" : amount,
      "oneAddress" : oneAddress,
      "ethAddress" : ethAddress,
      "destinationAddress" : ethAddress,
      "routerContract" : routerContract,
      "fromTokenContract" : fromTokenContract,
      "toTokenContract" : toTokenContract,
      "lockApproveTxnHash" : lockApproveTxnHash,
      "lockTxnHash" : lockTxnHash,
      "burnApproveTxnHash" : burnApproveTxnHash,
      "depositTxnHash" : depositTxnHash,
      "burnTxnHash" : burnTxnHash
    })
  )
  // set the option for the POST request
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/swap',
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
    const fromAddress = "Your From Address"
    const toAddress = "Your To Address"
    let amount = web3.utils.toWei("1", "ether")
    // get the Ethereum BUSD Manager Contract Approval hash
    const lockApproveTxnHash = await approveBUSDEthManager(amount)
    console.log("approveTxnHash", approveTxnHash)
    // get the Lock transaction hash
    const lockTxnHash = await lockTxn(amount)
    console.log("lockTxnHash", lockTxnHash)
    // get the Bridge Manager Contract Approval hash
    const approveTxnHash = await approveBridgeManager(amount)
    console.log("approveTxnHash", burnApproveTxnHash)
    // get the deposit transaction hash
    const depositTxnHash = await deposit();
    console.log("depositTxnHash", depositTxnHash)
    // get the burn transaction hash
    const burnTxnHash = await burnTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount, burnApproveTxnHash, depositTxnHash, burnTxnHash)
    console.log("burnTxnHash", burnTxnHash)
    // get the Viper contracts
    const routerContract = contracts.getRouterContract(ChainId.HARMONY_TESTNET, process.env.PRIVATE_KEY)
    const fromTokenContract = await contracts.getTokenContract(fromAddress, process.env.PRIVATE_KEY)
    const toTokenContract = await contracts.getTokenContract(toAddress, process.env.PRIVATE_KEY)
    // send the transaction to the API
    setTimeout(() => {
      await perform(
        amount, 
        fromAddress, 
        toAddress, 
        routerContract, 
        fromTokenContract, 
        toTokenContract, 
        lockApproveTxnHash, 
        lockTxnHash,
        burnApproveTxnHash, 
        depositTxnHash, 
        burnTxnHash
        ).then(() => {
        console.log("done")
      })
    }, 10000)
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body)
  }
}

main().then(() => {})
