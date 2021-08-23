"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Token = require('@venomswap/sdk').Token;
var TokenAmount = require('@venomswap/sdk').TokenAmount;
var ChainId = require('@venomswap/sdk').ChainId;
var Pair = require('@venomswap/sdk').Pair;
var Route = require('@venomswap/sdk').Route;
var Trade = require('@venomswap/sdk').Trade;
var TradeType = require('@venomswap/sdk').TradeType;
var ETHER = require('@venomswap/sdk').ETHER;
var WETH = require('@venomswap/sdk').WETH;
var HARMONY = require('@venomswap/sdk').HARMONY;
var JSBI = require('jsbi');
var CurrencyAmount = require('@venomswap/sdk').CurrencyAmount;
var Percent = require('@venomswap/sdk').Percent;
var currencyEquals = require('@venomswap/sdk').currencyEquals;
var Wallet = require('ethers').wallet;
var formatEther = require('ethers').utils.formatEther;
var contracts = require('./contracts.js');
var Web3 = require('web3');
var loco = 1;
module.exports.ExactInputTrade = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exactInputTrade()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// function toHex(Amount) {
//     return `0x${Amount.raw.toString(16)}`;
// }
var exactInputTrade = function () { return __awaiter(void 0, void 0, void 0, function () {
    var HARMONY_TESTNET_WONE, HARMONY_TESTNET_1BUSD, pair, route, amount, trade;
    return __generator(this, function (_a) {
        HARMONY_TESTNET_WONE = new Token(ChainId.HARMONY_TESTNET, '0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2', 18, 'WONE', 'Wrapped ONE');
        HARMONY_TESTNET_1BUSD = new Token(ChainId.HARMONY_TESTNET, '0x0E80905676226159cC3FF62B1876C907C91F7395', 18, '1BUSD', 'OneBUSD');
        // note that you may want/need to handle this async code differently,
        // for example if top-level await is not an option
        try {
            pair = new Pair(new TokenAmount(HARMONY_TESTNET_WONE, JSBI.BigInt(1000)), new TokenAmount(HARMONY_TESTNET_1BUSD, JSBI.BigInt(1000)));
            route = new Route([pair], HARMONY_TESTNET_1BUSD);
            amount = new TokenAmount(HARMONY_TESTNET_1BUSD, JSBI.BigInt(100));
            trade = new Trade(route, amount, TradeType.EXACT_INPUT);
            console.log(trade);
            //   const web3 = new Web3(
            //     new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL)
            //   );
            //   const gas = await web3.eth.getGasPrice();
            //   const slippageTolerance = new Percent('1', '100');
            //   const amountOutMin = toHex(trade.minimumAmountOut(slippageTolerance));
            //   const path = [HARMONY_MAINNET_BSCBUSD, HARMONY_MAINNET_BUSD];
            //   const to = 'PK_HERE';
            //   const deadline = Math.floor(Date.now()/1000) + 60*20;
            //   const value = toHex(trade.inputAmount);
            //   let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
            //   web3.eth.accounts.wallet.add(account);
            //   web3.eth.defaultAccount = account.address;
            //   const viperjson = require("????");
            //   const viperswap = new web3.eth.Contract(
            //         viperjson.abi,
            //         process.env.VIPER_SWAP_CONTRACT
            //  );
            //   const tx = await viperswap.swap(    //???
            //       amountOutMin,
            //       path,
            //       to,
            //       deadline,
            //       {value, gasPrice: gas}
            //   );     
            // console.log(Trade.bestTradeExactIn([], new TokenAmount(HARMONY_MAINNET_BSCBUSD, 101), HARMONY_MAINNET_BUSD))
        }
        catch (e) {
            console.error("Error: ", e.message);
        }
        return [2 /*return*/];
    });
}); };
var swapForToken = function (wallet, fromToken, toToken, destinationAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var dryRun, deadline, router, fromTokenContract, toTokenContract, fromTokenSymbol, toTokenSymbol, tokenBalance, amounts, _, targetAmount, adjustedTargetAmount, swapMethod, message, tx, receipt, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    destinationAddress = destinationAddress ? destinationAddress : wallet.address;
                    dryRun = false;
                    deadline = 1000000000000;
                    router = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet);
                    fromTokenContract = contracts.getTokenContract(ChainId.HARMONY_TESTNET, fromToken, wallet);
                    toTokenContract = contracts.getTokenContract(ChainId.HARMONY_TESTNET, toToken, wallet);
                    if (!(router && fromTokenContract && toTokenContract)) return [3 /*break*/, 10];
                    return [4 /*yield*/, fromTokenContract.symbol()];
                case 1:
                    fromTokenSymbol = _a.sent();
                    return [4 /*yield*/, toTokenContract.symbol()];
                case 2:
                    toTokenSymbol = _a.sent();
                    console.log("Checking " + fromTokenSymbol + " balance for " + wallet.address + " ...");
                    return [4 /*yield*/, fromTokenContract.balanceOf(wallet.address)];
                case 3:
                    tokenBalance = _a.sent();
                    if (!!tokenBalance.isZero()) return [3 /*break*/, 9];
                    return [4 /*yield*/, setAllowance(fromTokenContract, wallet, router.address)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, router.getAmountsOut(tokenBalance, [fromTokenContract.address, toTokenContract.address])];
                case 5:
                    amounts = _a.sent();
                    _ = amounts[0], targetAmount = amounts[1];
                    adjustedTargetAmount = targetAmount.sub(targetAmount.div(100));
                    swapMethod = 'swapExactTokensForTokens';
                    message = formatEther(tokenBalance) + " " + fromTokenSymbol + " to a minimum of " + formatEther(adjustedTargetAmount) + " " + toTokenSymbol;
                    console.log("Swap method: " + swapMethod);
                    console.log("Swapping " + message);
                    console.log("Output token address: " + toTokenContract.address);
                    console.log("Wallet address: " + wallet.address);
                    console.log("Destination address: " + destinationAddress);
                    console.log("Deadline (ms): " + deadline);
                    if (!!dryRun) return [3 /*break*/, 8];
                    return [4 /*yield*/, router[swapMethod](tokenBalance, adjustedTargetAmount, [fromTokenContract.address, toTokenContract.address], destinationAddress, deadline)];
                case 6:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 7:
                    receipt = _a.sent();
                    success = receipt && receipt.status === 1;
                    console.log("Swapped " + message + " - Transaction receipt - tx hash: " + receipt.transactionHash + ", success: " + success + "\n");
                    return [3 /*break*/, 9];
                case 8:
                    console.log('Not swapping due to running in dry run mode');
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    console.log("Couldn't find fromToken " + fromToken + " or toToken " + toToken);
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
};
