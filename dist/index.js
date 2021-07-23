"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var _a = require('bridge-sdk'), BridgeSDK = _a.BridgeSDK, TOKEN = _a.TOKEN, EXCHANGE_MODE = _a.EXCHANGE_MODE, STATUS = _a.STATUS;
var configs = require('bridge-sdk/lib/configs');
var tools = require('../bridge.js');
var viper_1 = require("./viper");
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post('/lp/pair', function (req, res) {
    var tokenA = req.body.tokenA;
    var tokenB = req.body.tokenB;
});
app.post('/lp/explore', function (req, res) {
    var tokenA = req.body.tokenA;
    var tokenB = req.body.tokenB;
    var ethAddress = req.body.ethAddress;
    var oneAddress = req.body.oneAddress;
    var amountADesired = req.body.amountADesired;
    var amountBDesired = req.body.amountBDesired;
    var amountAMin = req.body.amountAMin;
    var amountBMin = req.body.amountBMin;
    var address = req.body.address;
    var deadLine = req.body.deadLine;
    viper_1.exactInputTrade(ChainId.MAINNET, tokenA, tokenB, 18, 18, "A", "B", "A", "B", amountADesired, amountBDesired).then(function (value) { return console.log(value); });
});
app.post('/lp/addLiquidity', function (req, res) {
    var tokenA = req.body.tokenA;
    var tokenB = req.body.tokenB;
    var ethAddress = req.body.ethAddress;
    var oneAddress = req.body.oneAddress;
    var amountADesired = req.body.amountADesired;
    var amountBDesired = req.body.amountBDesired;
    var amountAMin = req.body.amountAMin;
    var amountBMin = req.body.amountBMin;
    var address = req.body.address;
    var deadLine = req.body.deadLine;
    tools.operationCall(EXCHANGE_MODE.ETH_TO_ONE, TOKEN.BUSD, NETWORK_TYPE.ETHEREUM, oneAddress, ethAddress, '0x61b125de7560069aef96530ef9430715e3807f41a71056fxxxxxx');
});
app.post('/lp/removeLiquidity', function (req, res) {
    var tokenA = req.body.tokenA;
    var tokenB = req.body.tokenB;
    var ethWallet = req.body.ethWallet;
    var oneWallet = req.body.oneWallet;
    var liquidity = req.body.liquidity;
    var amountAMin = req.body.amountAMin;
    var amountBMin = req.body.amountBMin;
    var address = req.body.address;
    var deadLine = req.body.deadLine;
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("App listening on PORT " + port); });
