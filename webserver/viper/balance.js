const ChainId = require('@venomswap/sdk').ChainId
const parseEther = require('ethers').utils.parseEther
const math = require('mathjs')
var contracts = require('./contracts.js')

module.exports.checkBalance = async function(wallet, token, amount) {
  return await checkBalance(wallet, token, amount);
}

module.exports.checkBalanceWithContract = async function(wallet, tokenContract, amount) {
  return await checkBalanceWithContract(address, tokenContract, amount);
}

const checkBalanceWithContract = async function(address, tokenContract, amount) {
  return new Promise(async(resolve, reject) => {
    try {
      const tokenSymbol = await tokenContract.symbol()
      console.log(`Checking ${tokenSymbol} balance for ${address} ...`)
      const tokenBalance = await tokenContract.balanceOf(address)
      var startTime = new Date().getTime();
      var interval = await setInterval(function() { 
        if(new Date().getTime() - startTime > 30000){
          clearInterval(interval)
          resolve({ trx: "viper", 
                    success: false, 
                    error_message: "No Balance Available", 
                    error_body: "There is not enough balance in the " + token + " wallet and the request at Viperswap timed out"})
        }
        if (math.compare(tokenBalance._hex, parseEther(amount)._hex)) {
          clearInterval(interval)
          resolve({ trx: "viper", success: true})
        }
      }, 10000);
      
    } catch (e) {
      resolve({ trx: "viper", 
                    success: false, 
                    error_message: e.message, 
                    error_body: e.response?.body})
    } 
  });
}

const checkBalance = async function(wallet, token, amount) {
  const tokenContract = contracts.getTokenContract(ChainId.HARMONY_TESTNET, token, wallet)
  return await checkBalanceWithContract(wallet.address, tokenContract, amount)
}