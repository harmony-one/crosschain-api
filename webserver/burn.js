require("dotenv").config()

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk')
const BN = require('bn.js')
const Web3 = require('web3')
const configs = require('bridge-sdk/lib/configs')

module.exports.Burn = async function(depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, amount) {
  return await burn(depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, amount)
}

module.exports.Deposit = async function(node, gasLimit, abiJson,  wallet) {
  return await deposit(node, gasLimit, abiJson,  wallet)
}

module.exports.BurnTxn = async function(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei) {
  return await burnTxn(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei)
}

/* Signs a `deposit` transaction and generates a hash
 * @param {string} node
 * @param {string} gasLimit
 * @param {string} abiJson
 * @param {string} wallet
 * @param {string} amount
 * @return {string} JSON with the request response
*/
async function deposit(node, gasLimit, abiJson,  wallet) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(node)
  )
  let account = web3.eth.accounts.privateKeyToAccount(wallet)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
  const contractJson = require(abiJson)
  const contract = new web3.eth.Contract(contractJson.abi, process.env.HMY_DEPOSIT_CONTRACT)
  let response = await contract.methods
    .deposit(web3.utils.toWei("15", "ether"))
    .send({
      from: account.address,
      gas: gasLimit,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
      value: web3.utils.toWei("15", "ether"),
    })
  return response.transactionHash
}

/* Signs a `burn` transaction and generates a hash
 * @param {string} node
 * @param {string} gasLimit
 * @param {string} abiJson
 * @param {string} contractManagerAddress
 * @param {string} wallet
 * @param {BigNumber} amountInWei
 * @return {string} JSON with the request response
*/
async function burnTxn(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(node)
  )
  let account = web3.eth.accounts.privateKeyToAccount(wallet)
  web3.eth.accounts.wallet.add(account)
  web3.eth.defaultAccount = account.address
  const busdJson = require(abiJson)
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    contractManagerAddress
  )
  let transaction = await busdContract.methods
    .burnToken(process.env.HMY_BSCBUSD_CONTRACT, amountInWei, account.address)
    .send({
      from: account.address,
      gas: gasLimit,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    })
  return transaction.transactionHash
}

/* Bridges assets from Harmony to Ethereum or BSC networks
 * @param {string} depositTxnHash
 * @param {string} approveTxnHash
 * @param {string} burnTxnHash
 * @param {string} oneAddress
 * @param {string} ethAddress
 * @param {string} amount
 * @return {string} JSON with the request response
*/
const burn = async (depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, amount) => {
  try {
    
    const bridgeSDK = new BridgeSDK({ logLevel: 2 })
    await bridgeSDK.init(configs.testnet)

    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ONE_TO_ETH,
      token: TOKEN.ERC20,
      erc20Address: process.env.BSC_BUSD_CONTRACT,
      network: NETWORK_TYPE.BINANCE,
      amount: amount/1e18,
      oneAddress: oneAddress,
      ethAddress: ethAddress,
    })
    await operation.confirmAction({
      actionType: ACTION_TYPE.depositOne,
      transactionHash: depositTxnHash,
    })
    await operation.confirmAction({
      actionType: ACTION_TYPE.approveHmyManger,
      transactionHash: approveTxnHash,
    })
    console.log("Hmy Manager Approved")
    await operation.confirmAction({
      actionType: ACTION_TYPE.burnToken,
      transactionHash: burnTxnHash,
    })
    console.log("Burn Token Approved")
    return { trx: "swap", success: true}
  
  } catch (e) {
    return { trx: "swap", success: true, error_message: e.message, error_body: e.response?.body}
  }
}



