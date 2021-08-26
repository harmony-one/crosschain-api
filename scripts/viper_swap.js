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
const configs = require("bridge-sdk/lib/configs")
var contracts = require('./contracts.js')
const ChainId = require('@venomswap/sdk').ChainId

async function perform(amount, fromAddress, destinationAddress, routerContract, fromTokenContract, toTokenContract) {
  const https = require('https')

    const data = new TextEncoder().encode(
        JSON.stringify({
            "amount" : amount,
            "oneAddress" : oneAddress,
            "ethAddress" : ethAddress,
            "destinationAddress" : ethAddress,
            "routerContract" : routerContract,
            "fromTokenContract" = fromTokenContract,
            "toTokenContract" = toTokenContract
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
    const fromAddress = "Your From Address"
    const ethAddress = "Your To Address"
    let amount = web3.utils.toWei("1", "ether")
    const destinationAddress = ethAddress
    const routerContract = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
    const fromTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, fromToken, wallet)
    const toTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, toToken, wallet)
    
    setTimeout(() => {
      perform(amount, fromAddress, destinationAddress, routerContract, fromTokenContract, toTokenContract).then(() => {
        console.log("done");
      });
    }, 10000);
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});
