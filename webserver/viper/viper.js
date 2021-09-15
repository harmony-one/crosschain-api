var swap = require('./swap.js')
var balance = require('./balance.js')
var liquidity = require('./liquidity.js')

module.exports.swapForToken = async function(amount, wallet, fromToken, toToken, destinationAddress) {
  return await swap.swapForToken(amount, wallet, fromToken, toToken, destinationAddress);
}

module.exports.swapForTokenWithContracts = async function(amount, address, destinationAddress, routerContract, fromTokenContract, toTokenContract) {
  return await swap.swapForTokenWithContracts(amount, address, destinationAddress, routerContract, fromTokenContract, toTokenContract)
}

module.exports.checkBalance = async function(amount, wallet, fromToken, toToken, destinationAddress) {
  return await balance.checkBalance(amount, wallet, fromToken, toToken, destinationAddress);
}

module.exports.addLiquidity = async function(wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo) {
  return await liquidity.addLiquidity(wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo)
}

module.exports.removeLiquidity = async function(wallet, tokenA, tokenB, removalPercentage) {
  return await liquidity.removeLiquidity(wallet, tokenA, tokenB, removalPercentage)
}