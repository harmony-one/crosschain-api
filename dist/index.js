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
var app = express_1.default();
var _a = require('bridge-sdk'), BridgeSDK = _a.BridgeSDK, TOKEN = _a.TOKEN, EXCHANGE_MODE = _a.EXCHANGE_MODE, STATUS = _a.STATUS;
var configs = require('bridge-sdk/lib/configs');
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post('/lp/pair', function (req, res) {
    res.send('Hello Pair!');
    var tokenA = req.body.tokenA;
    var tokenB = req.body.tokenB;
});
app.post('/lp/explore', function (req, res) {
    res.send('Hello Explore!');
});
app.post('/lp/addLiquidity', function (req, res) {
    res.send('Hello addLiquidity!');
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
    var operationCall = function () { return __awaiter(void 0, void 0, void 0, function () {
        var bridgeSDK, operation, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    bridgeSDK = new BridgeSDK({ logLevel: 2 });
                    return [4 /*yield*/, bridgeSDK.init(configs.testnet)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, bridgeSDK.createOperation({
                            type: EXCHANGE_MODE.ETH_TO_ONE,
                            token: TOKEN.BUSD,
                            network: NETWORK_TYPE.ETHEREUM,
                            amount: 0.01,
                            oneAddress: oneAddress,
                            ethAddress: ethAddress,
                        })];
                case 3:
                    operation = _b.sent();
                    /********/
                    // Here you need to generate and call contract methods to lock your token
                    // We skipped this step in this example and will assume that you already have a successfully completed Locked Tokens transaction.
                    /********/
                    return [4 /*yield*/, operation.skipAction(ACTION_TYPE.approveEthManger)];
                case 4:
                    /********/
                    // Here you need to generate and call contract methods to lock your token
                    // We skipped this step in this example and will assume that you already have a successfully completed Locked Tokens transaction.
                    /********/
                    _b.sent();
                    return [4 /*yield*/, operation.confirmAction({
                            actionType: ACTION_TYPE.lockToken,
                            transactionHash: '0x61b125de7560069aef96530ef9430715e3807f41a71056fxxxxxx',
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.error('Error: ', e_1.message, (_a = e_1.response) === null || _a === void 0 ? void 0 : _a.body);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
});
app.post('/lp/removeLiquidity', function (req, res) {
    res.send('Hello removeLiquidity!');
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
