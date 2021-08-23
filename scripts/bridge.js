require("dotenv").config();

const request = require('request');
const web3 = require('web3');

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
    let amount = "0.15";

    const body = {
        "amount" : amount,
        "wallet" : wallet
    }

    await postRequest('http://localhost:3000/bridge/busd2bscbusd',body)
 
  } catch (e) {
    console.error("Error: ", e.message, e.response?.body);
  }
}

main().then(() => {});