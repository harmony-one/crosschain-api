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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ethers_1 = require("ethers");
require('dotenv').config();
var app = express_1.default();
app.use(express_1.default.json());
var bridge = require('../bridge.js');
var viper = require('../viper.js');
var cors = require('cors');
app.use(cors({ origin: true, credentials: true }));
// ENDPOINTS
app.post('/swap', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var oneAddress, ethAddress, amount, wallet, result, provider, wallet_1, fromToken_1, toToken_1, destinationAddress_1, interval_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                oneAddress = req.body.oneAddress;
                ethAddress = req.body.ethAddress;
                amount = req.body.amount;
                wallet = req.body.wallet;
                return [4 /*yield*/, bridge.Bridge(0, oneAddress, ethAddress, process.env.ETH_NODE_URL, process.env.ETH_GAS_LIMIT, './abi/BUSD.json', process.env.ETH_BUSD_CONTRACT, './abi/BUSDEthManager.json', process.env.ETH_BUSD_MANAGER_CONTRACT, wallet, amount)];
            case 1:
                result = _a.sent();
                if (result.success == true) {
                    console.log("Assets Successfully Bridged");
                    provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
                    wallet_1 = new ethers_1.ethers.Wallet(req.body.wallet, provider);
                    fromToken_1 = process.env.HMY_BUSD_CONTRACT;
                    toToken_1 = process.env.HMY_BSCBUSD_CONTRACT;
                    destinationAddress_1 = oneAddress;
                    interval_1 = setInterval(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, viper.checkBalance(wallet_1, fromToken_1, "1")];
                                    case 1:
                                        if ((_a.sent()) > -1) {
                                            clearInterval(interval_1);
                                            viper.swapForToken(amount, wallet_1, fromToken_1, toToken_1, destinationAddress_1);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, 5000);
                    res.send("Assets Successfully Bridged");
                }
                else {
                    console.log("Assets Bridging Failed");
                    res.send("Assets Bridging Failed");
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('/swap/bridge-in', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, wallet, oneAddress, ethAddress, result, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                amount = req.body.amount;
                wallet = req.body.wallet;
                oneAddress = req.body.oneAddress;
                ethAddress = req.body.ethAddress;
                return [4 /*yield*/, bridge.Bridge(0, oneAddress, ethAddress, process.env.ETH_NODE_URL, process.env.ETH_GAS_LIMIT, './abi/BUSD.json', process.env.ETH_BUSD_CONTRACT, './abi/BUSDEthManager.json', process.env.ETH_BUSD_MANAGER_CONTRACT, wallet, amount)];
            case 1:
                result = _d.sent();
                _b = (_a = console).log;
                _c = ["result"];
                return [4 /*yield*/, result];
            case 2:
                _b.apply(_a, _c.concat([_d.sent()]));
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
app.post('/swap/bridge-out', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, wallet, oneAddress, ethAddress, result, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                amount = req.body.amount;
                wallet = req.body.wallet;
                oneAddress = req.body.oneAddress;
                ethAddress = req.body.ethAddress;
                return [4 /*yield*/, bridge.Bridge(1, oneAddress, ethAddress, process.env.HARMONY_NODE_URL, process.env.ETH_GAS_LIMIT, './abi/BUSD.json', process.env.HMY_BSCBUSD_CONTRACT, './abi/BridgeManager.json', process.env.HMY_BSCBUSD_MANAGER_CONTRACT, wallet, amount)];
            case 1:
                result = _d.sent();
                _b = (_a = console).log;
                _c = ["result"];
                return [4 /*yield*/, result];
            case 2:
                _b.apply(_a, _c.concat([_d.sent()]));
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
app.post('/swap/viper', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, oneAddress, provider, wallet, fromToken, toToken, destinationAddress;
    return __generator(this, function (_a) {
        amount = req.body.amount;
        oneAddress = req.body.oneAddress;
        provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
        wallet = new ethers_1.ethers.Wallet(req.body.wallet, provider);
        fromToken = process.env.HMY_BUSD_CONTRACT;
        toToken = process.env.HMY_BSCBUSD_CONTRACT;
        destinationAddress = oneAddress;
        viper.swapForToken(amount, wallet, fromToken, toToken, destinationAddress);
        res.send('Viper Swap');
        return [2 /*return*/];
    });
}); });
app.post('/viper/balance', function (req, res) {
    //viper.ExactInputTrade();
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    var provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    // Variables
    var account_from = {
        privateKey: process.env.PRIVATE_KEY,
    };
    // Create Wallet
    var wallet = new ethers_1.ethers.Wallet("", provider);
    // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
    // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813
    var fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425'; // BUSD
    res.send('Balance');
    viper.checkBalance(wallet, fromToken, "1");
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("App listening on PORT " + port); });
