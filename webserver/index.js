const express = require("express");
const ethers = require("ethers");

require('dotenv').config()

const app = express();

app.use(express.json());

var bridge = require('./bridge.js');
var viper = require('./viper.js');
var cors=require('cors');

app.use(cors({origin:true,credentials: true}));

// ENPOINTS

app.post('/swap/bridge-in', async(req, res) => {

  const amount = req.body.amount
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  const approveTxnHash = req.body.approveTxnHash
  const lockTxnHash = req.body.lockTxnHash
  
  const result = await bridge.LockWithHash(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);

  console.log("result", await result);
  res.send(result);

});

app.post('/swap/bridge-out', async(req, res) => {

  const amount = req.body.amount
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  const approveTxnHash = req.body.approveTxnHash
  const depositTxnHash = req.body.depositTxnHash
  const burnTxnHash = req.body.burnTxnHash
  
  const result = await bridge.BurnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount);

  console.log("result", await result);
  res.send(result);

});

app.post('/swap/viper', async(req, res) => {
  const amount = req.body.amount
  const oneAddress = req.body.oneAddress
  const fromAddress = req.body.ethAddress
  const destinationAddress = ethAddress
  const routerContract = req.body.routerContract
  const fromTokenContract = req.body.fromTokenContract
  
  viper.swapForTokenWithContracts(amount, fromAddress, destinationAddress, routerContract, fromTokenContract, toTokenContract)
  res.send('Viper Swap');
});

app.post('/swap', async(req, res) => {

  //TODO: if (await viper.checkBalance(wallet, toToken, "1") > -1)

  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress 
  const amount = req.body.amount
  const lockApproveTxnHash = req.body.approveTxnHash
  const lockTxnHash = req.body.lockTxnHash
  const burnApproveTxnHash = req.body.approveTxnHash
  const depositTxnHash = req.body.depositTxnHash
  const burnTxnHash = req.body.burnTxnHash
  const routerContract = req.body.routerContract
  const fromTokenContract = req.body.fromTokenContract
  const destinationAddress = ethAddress
  
  const lockResult = await bridge.LockWithHash(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);

  if (lockResult.success == true) {
    console.log("Assets Successfully Bridged, swapping bridged assets");
    const fromToken = process.env.HMY_BUSD_CONTRACT
    const toToken = process.env.HMY_BSCBUSD_CONTRACT
    const fromAddress = req.body.ethAddress
    const destinationAddress = ethAddress
    const swapResult = await viper.swapForTokenWithContracts(amount, fromAddress, fromToken, toToken, destinationAddress, routerContract, fromTokenContract, toTokenContract)
    if (swapResult.success == true) {
      const result = await bridge.BurnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount);
    }
    res.send("Assets Successfully swapped");
  } else {
    console.log("Assets Bridging Failed");
    res.send("Assets Bridging Failed");
  }
});

// LOCAL ENDPOINTS

app.post('/local/swap/bridge-in', async(req, res) => {

  const amount = req.body.amount
  const wallet = req.body.wallet
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  
  const result = await bridge.Bridge(0,
    oneAddress,
    ethAddress,
    process.env.ETH_NODE_URL,
    process.env.ETH_GAS_LIMIT,
    './abi/BUSD.json', 
    process.env.ETH_BUSD_CONTRACT,
    './abi/BUSDEthManager.json', 
    process.env.ETH_BUSD_MANAGER_CONTRACT, 
    wallet, 
    amount);
  
  console.log("result", await result);
  res.send(result);

});

app.post('/local/swap/bridge-out', async(req, res) => {

  const amount = req.body.amount
  const wallet = req.body.wallet
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  
  const result = await bridge.Bridge(1,
    oneAddress,
    ethAddress,
    process.env.HARMONY_NODE_URL,
    process.env.ETH_GAS_LIMIT,
    './abi/BUSD.json', 
    process.env.HMY_BSCBUSD_CONTRACT,
    './abi/BridgeManager.json', 
    process.env.HMY_BSCBUSD_MANAGER_CONTRACT, 
    wallet, 
    amount);
  
  console.log("result", await result);
  res.send(result);

});

app.post('/local/swap/viper', async(req, res) => {
  
  const amount = req.body.amount
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress
  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
  let wallet = new ethers.Wallet(req.body.wallet, provider);
  const fromToken = process.env.HMY_BUSD_CONTRACT
  const toToken = process.env.HMY_BSCBUSD_CONTRACT
  const destinationAddress = ethAddress
  viper.swapForToken(amount,wallet, fromToken, toToken, destinationAddress)
  res.send('Viper Swap');
});

app.post('/local/swap', async(req, res) => {
  //TODO: if (await viper.checkBalance(wallet, toToken, "1") > -1)
  const oneAddress = req.body.oneAddress
  const ethAddress = req.body.ethAddress 
  const amount = req.body.amount
  const wallet = req.body.wallet
  
  const lockResult = await bridge.Bridge(0,
    oneAddress,
    ethAddress,
    process.env.ETH_NODE_URL,
    process.env.ETH_GAS_LIMIT,
    './abi/BUSD.json', 
    process.env.ETH_BUSD_CONTRACT,
    './abi/BUSDEthManager.json', 
    process.env.ETH_BUSD_MANAGER_CONTRACT, 
    wallet, 
    amount)

  if (lockResult.success == true) {
    console.log("Assets Successfully Bridged, swapping bridged assets");
    const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    let ethersWallet = new ethers.Wallet(req.body.wallet, provider);
    const fromToken = process.env.HMY_BUSD_CONTRACT
    const toToken = process.env.HMY_BSCBUSD_CONTRACT
    const destinationAddress = ethAddress
    await viper.checkBalance(ethersWallet, fromToken, amount).then(async(result) => {
      if (result.success == true) { 
        const swapResult = await viper.swapForToken(amount, ethersWallet, fromToken, toToken, destinationAddress)
        if (swapResult.success == true) {
          await viper.checkBalance(ethersWallet, toToken, amount).then(async(result) => {
            if (result.success == true) { 
              await bridge.Bridge(1,
                oneAddress,
                ethAddress,
                process.env.HARMONY_NODE_URL,
                process.env.ETH_GAS_LIMIT,
                './abi/BUSD.json', 
                process.env.HMY_BSCBUSD_CONTRACT,
                './abi/BridgeManager.json', 
                process.env.HMY_BSCBUSD_MANAGER_CONTRACT, 
                wallet, 
                amount)
            } else {
              res.send(result);
            }
          })
        }
        res.send({ trx: "viper", success: true});
      } else {
        res.send(result);
      }
    })

  } else {
    console.log("Assets Bridging Failed");
    res.send(lockResult);
  }
});

app.post('/viper/balance',(req, res) => {

  const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
  const account_from = {
    privateKey: process.env.PRIVATE_KEY,
  };
  let wallet = new ethers.Wallet("", provider);
  const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD
  res.send('Balance');
  viper.checkBalance(wallet, fromToken, "1")

});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
