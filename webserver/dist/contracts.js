"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterBreederContract = exports.getPairContract = exports.getTokenContract = exports.getRouterContract = void 0;
var ethers = require('ethers').ethers;
var ROUTER_ADDRESSES = require('@venomswap/sdk').ROUTER_ADDRESSES;
var MASTER_BREEDER_ADDRESSES = require('@venomswap/sdk').MASTER_BREEDER_ADDRESSES;
var ROUTER_ABI = require('@venomswap/periphery/build/IUniswapV2Router02.json').ROUTER_ABI;
var IERC20_ABI = require('@venomswap/periphery/build/IERC20.json').IERC20_ABI;
var IUNISWAPV2PAIR_ABI = require('@venomswap/periphery/build/IUniswapV2Pair.json').IUNISWAPV2PAIR_ABI;
var MASTER_BREEDER_ABI = require('@venomswap/contracts/build/MasterBreeder.json').MASTER_BREEDER_ABI;
var getTokenWithDefault = require('./tokens').getTokenWithDefault;
var isAddress = require('./addresses').isAddress;
var ChainId = require('@venomswap/sdk').ChainId;
function getRouterContract(chainId, walletOrProvider) {
    var routerAddress = ROUTER_ADDRESSES[chainId];
    if (routerAddress && isAddress(routerAddress)) {
        return new ethers.Contract(routerAddress, ROUTER_ABI, walletOrProvider);
    }
    return undefined;
}
exports.getRouterContract = getRouterContract;
function getTokenContract(chainId, addressOrSymbol, walletOrProvider) {
    if (isAddress(addressOrSymbol)) {
        return new ethers.Contract(addressOrSymbol, IERC20_ABI, walletOrProvider);
    }
    var token = getTokenWithDefault(chainId, addressOrSymbol);
    if (!token)
        return undefined;
    return new ethers.Contract(token.address, IERC20_ABI, walletOrProvider);
}
exports.getTokenContract = getTokenContract;
function getPairContract(pairAddress, walletOrProvider) {
    if (isAddress(pairAddress)) {
        return new ethers.Contract(pairAddress, IUNISWAPV2PAIR_ABI, walletOrProvider);
    }
    return undefined;
}
exports.getPairContract = getPairContract;
function getMasterBreederContract(chainId, walletOrProvider) {
    var masterBreederAddress = MASTER_BREEDER_ADDRESSES[chainId];
    if (masterBreederAddress && isAddress(masterBreederAddress)) {
        return new ethers.Contract(masterBreederAddress, MASTER_BREEDER_ABI, walletOrProvider);
    }
    return undefined;
}
exports.getMasterBreederContract = getMasterBreederContract;
