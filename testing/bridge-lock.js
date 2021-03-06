require("dotenv").config();

const request = require('request');

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
    
    const wallet = process.env.PRIVATE_KEY;
    const amount = "0.01";
    const oneAddress = process.env.SWAPPER_ONE_ADDRESS
    const ethAddress = process.env.SWAPPER_ETH_ADDRESS

    const body = {
        "amount" : amount,
        "wallet" : wallet,
        "oneAddress" : oneAddress,
        "ethAddress" : ethAddress
    }

    await postRequest('http://localhost:3000/local/swap/bridge-in/',body)
 
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});