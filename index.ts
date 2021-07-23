import express from "express";

const app = express();

const { BridgeSDK, TOKEN, EXCHANGE_MODE, STATUS } = require('bridge-sdk');
const configs = require('bridge-sdk/lib/configs');

var bridge = require('../bridge.js');
var viper = require('../viper.js');

app.get('/',(req, res) => {
    res.send('Hello World!');
});
app.post('/lp/pair',(req, res) => {
    const tokenA = req.body.tokenA;
    const tokenB = req.body.tokenB;
});
app.post('/lp/explore',(req, res) => {
    const tokenA = req.body.tokenA;
    const tokenB = req.body.tokenB;
    const ethAddress = req.body.ethAddress;
    const oneAddress = req.body.oneAddress;
    const amountADesired = req.body.amountADesired;
    const amountBDesired = req.body.amountBDesired;
    const amountAMin = req.body.amountAMin;
    const amountBMin = req.body.amountBMin;
    const address = req.body.address;
    const deadLine = req.body.deadLine;

    viper.exactInputTrade(ChainId.MAINNET,tokenA,tokenB,18,18,"A","B","A","B",amountADesired,amountBDesired).then((value) => console.log(value))


});
app.post('/lp/addLiquidity',(req, res) => {
    const tokenA = req.body.tokenA;
    const tokenB = req.body.tokenB;
    const ethAddress = req.body.ethAddress;
    const oneAddress = req.body.oneAddress;
    const amountADesired = req.body.amountADesired;
    const amountBDesired = req.body.amountBDesired;
    const amountAMin = req.body.amountAMin;
    const amountBMin = req.body.amountBMin;
    const address = req.body.address;
    const deadLine = req.body.deadLine;

    bridge.operationCall(EXCHANGE_MODE.ETH_TO_ONE,TOKEN.BUSD,NETWORK_TYPE.ETHEREUM,oneAddress,ethAddress,'0x61b125de7560069aef96530ef9430715e3807f41a71056fxxxxxx');
});

app.post('/lp/removeLiquidity',(req, res) => {
    const tokenA = req.body.tokenA;
    const tokenB = req.body.tokenB;
    const ethWallet = req.body.ethWallet;
    const oneWallet = req.body.oneWallet;
    const liquidity = req.body.liquidity;
    const amountAMin = req.body.amountAMin;
    const amountBMin = req.body.amountBMin;
    const address = req.body.address;
    const deadLine = req.body.deadLine;
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
