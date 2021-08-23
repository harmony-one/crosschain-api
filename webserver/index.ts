import express from "express";
import { ethers } from "ethers";


require('dotenv').config()

const app = express();

app.use(express.json());

var bridge = require('../bridge.js');
var viper = require('../viper.js');
var cors=require('cors');

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk');

app.use(cors({origin:true,credentials: true}));

// ENDPOINTS

app.post('/swap', async(req, res) => {

  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress 
  const amount = req.body.amount
  const wallet = req.body.wallet
  
  const result = await bridge.Bridge(0,
    oneAddress,
    ethAddress,
    process.env.ETH_NODE_URL,
    process.env.ETH_GAS_LIMIT,
    EXCHANGE_MODE.ETH_TO_ONE, 
    NETWORK_TYPE.ETHEREUM,
    ACTION_TYPE.approveEthManger,
    './abi/BUSD.json', 
    process.env.ETH_BUSD_CONTRACT,
    './abi/BUSDEthManager.json', 
    process.env.ETH_BUSD_MANAGER_CONTRACT, 
    wallet, 
    amount);

  if (result.success == true) {
    console.log("Assets Successfully Bridged");
    const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    let wallet = new ethers.Wallet(req.body.wallet, provider);
    const fromToken = process.env.HMY_BUSD_CONTRACT
    const toToken = process.env.HMY_BSCBUSD_CONTRACT
    const destinationAddress = oneAddress

    const interval = setInterval( async function() {
      if (await viper.checkBalance(wallet, fromToken, "1") > -1) {
        clearInterval(interval);
        viper.swapForToken(amount,wallet, fromToken, toToken, destinationAddress)
      }
    }, 5000);
    res.send("Assets Successfully Bridged");
  } else {
    console.log("Assets Bridging Failed");
    res.send("Assets Bridging Failed");
  }

});

app.post('/swap/viper', async(req, res) => {

  const amount = req.body.amount
  const oneAddress = req.body.oneAddress
  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);

  // Create Wallet
  let wallet = new ethers.Wallet(req.body.wallet, provider);

  const fromToken = process.env.HMY_BUSD_CONTRACT
  const toToken = process.env.HMY_BSCBUSD_CONTRACT
  const destinationAddress = oneAddress

  viper.swapForToken(amount,wallet, fromToken, toToken, destinationAddress)
  
  res.send('Viper Swap');
});

app.post('/viper/balance',(req, res) => {
  //viper.ExactInputTrade();
  // A Web3Provider wraps a standard Web3 provider, which is
  // what Metamask injects as window.ethereum into each page
  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);

  // Variables
  const account_from = {
    privateKey: process.env.PRIVATE_KEY,
  };

  // Create Wallet
  let wallet = new ethers.Wallet(account_from.privateKey, provider);

  // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
  // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813

  const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD

  res.send('Balance');

  viper.checkBalance(wallet, fromToken, "1")

});

// Test Endpoints

app.post('/test/bridge', async(req, res) => {

  const amount = req.body.amount
  const wallet = req.body.wallet
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  
  // const result = await bridge.Bridge(0,
  //   oneAddress,
  //   ethAddress,
  //   process.env.ETH_NODE_URL,
  //   process.env.ETH_GAS_LIMIT,
  //   EXCHANGE_MODE.ETH_TO_ONE, 
  //   NETWORK_TYPE.ETHEREUM,
  //   ACTION_TYPE.approveEthManger,
  //   './abi/BUSD.json', 
  //   process.env.ETH_BUSD_CONTRACT,
  //   './abi/BUSDEthManager.json', 
  //   process.env.ETH_BUSD_MANAGER_CONTRACT, 
  //   wallet, 
  //   amount);
  
  
  const result = await bridge.Bridge(1,
    oneAddress,
    ethAddress,
    process.env.HARMONY_NODE_URL,
    process.env.ETH_GAS_LIMIT,
    EXCHANGE_MODE.ONE_TO_ETH, 
    NETWORK_TYPE.BINANCE, 
    ACTION_TYPE.approveHmyManger,
    './abi/BUSD.json', 
    process.env.HMY_BSCBUSD_CONTRACT,
    './abi/BridgeManager.json', 
    process.env.HMY_BSCBUSD_MANAGER_CONTRACT, 
    wallet, 
    amount);
  

  console.log("result", await result);
  res.send(result);

});

app.get('/test/viper/swap',(req, res) => {
  
  //viper.ExactInputTrade();
  // A Web3Provider wraps a standard Web3 provider, which is
  // what Metamask injects as window.ethereum into each page
  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);

  // Variables
  const account_from = {
    privateKey: process.env.PRIVATE_KEY,
  };

  // Create Wallet
  let wallet = new ethers.Wallet(account_from.privateKey, provider);

  // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
  // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813

  const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD
  const toToken = '0x6d307636323688cc3fe618ccba695efc7a94f813'   // bscBUSD

  const destinationAddress = '0x9E1AD78422Fd571B26D93EeB895f631A67Cd5462'

  viper.swapForToken("1",wallet, fromToken, toToken, destinationAddress)
  
  res.send('Test Viper Swap');
});

app.get('/test/viper/balance',(req, res) => {
  //viper.ExactInputTrade();
  // A Web3Provider wraps a standard Web3 provider, which is
  // what Metamask injects as window.ethereum into each page
  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);

  // Variables
  const account_from = {
    privateKey: process.env.PRIVATE_KEY,
  };

  // Create Wallet
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
  // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813

  const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD

  viper.checkBalance(wallet, fromToken, "1")
  res.send('Test Balance');

  

});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
