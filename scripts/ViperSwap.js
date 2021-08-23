
var request = require('request');
const ethers = require('ethers')
require("dotenv").config();

const BN = require("bn.js");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
);

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
    
    let wallet = process.env.PRIVATE_KEY;
    let amount = "1";
  
    const body = {
      "oneAddress" : process.env.SWAPPER_ONE_ADDRESS,
      "amount" : amount,
      "wallet" : wallet
    }

    await postRequest('http://localhost:3000/viper/swap',body) 
 
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});