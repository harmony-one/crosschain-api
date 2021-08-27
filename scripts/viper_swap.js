const BN = require("bn.js")
const Web3 = require("web3")
const https = require('https')
var contracts = require('./contracts.js')
const ChainId = require('@venomswap/sdk').ChainId
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
)

/* Receives all the required information to send a POST request
 * to the API's `/swap/viper` endpoint
 * @param {BigNumber} amount
 * @param {string} oneAddress
 * @param {string} ethAddress
 * @param {Contract} routerContract
 * @param {string} fromTokenContract
 * @param {string} toTokenContract
*/
async function perform(amount, oneAddress, ethAddress, routerContract, fromTokenContract, toTokenContract) {
  // Create the body of the POST request
  const data = new TextEncoder().encode(
    JSON.stringify({
      "amount" : amount,
      "oneAddress" : oneAddress,
      "ethAddress" : ethAddress,
      "destinationAddress" : ethAddress,
      "routerContract" : routerContract,
      "fromTokenContract" : fromTokenContract,
      "toTokenContract" : toTokenContract
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
    const destinationAddress = ethAddress
    // get the Viper contracts
    const routerContract = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
    const fromTokenContract = await contracts.getTokenContract(fromAddress, wallet)
    const toTokenContract = await contracts.getTokenContract(toAddress, wallet)
    // send the transaction to the API
    setTimeout(() => {
      await perform(amount, fromAddress, toAddress, routerContract, fromTokenContract, toTokenContract).then(() => {
        console.log("done")
      })
    }, 10000)
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body)
  }
}

main().then(() => {})
