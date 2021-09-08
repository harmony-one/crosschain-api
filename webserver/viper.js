const ChainId = require('@venomswap/sdk').ChainId
const formatEther = require('ethers').utils.formatEther
const parseEther = require('ethers').utils.parseEther
const math = require('mathjs')
var contracts = require('./contracts.js');

module.exports.swapForToken = async function(amount, wallet, fromToken, toToken, destinationAddress) {
  return await swapForToken(amount, wallet, fromToken, toToken, destinationAddress);
}

module.exports.checkBalance = async function(amount, wallet, fromToken, toToken, destinationAddress) {
  return await checkBalance(amount, wallet, fromToken, toToken, destinationAddress);
}


const setAllowance = async function(fromTokenContract, amount, router) {
  await fromTokenContract.approve(router.address, amount)
}

const checkBalance = async function(wallet, token, amount) {
  return new Promise(async(resolve, reject) => {
    try {
      const tokenContract = contracts.getTokenContract(ChainId.HARMONY_TESTNET, token, wallet)
      const tokenSymbol = await tokenContract.symbol()
      console.log(`Checking ${tokenSymbol} balance for ${wallet.address} ...`)
      const tokenBalance = await tokenContract.balanceOf(wallet.address)
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

const swapForToken = async function(amount, wallet, fromToken, toToken, destinationAddress) {

  destinationAddress = destinationAddress ? destinationAddress : wallet.address
  const parsedAmount = parseEther(amount)

  let dryRun = false
  const deadline = Date.now() + 1000 * 60 * 3

  const router = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
  const fromTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, fromToken, wallet)
  const toTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, toToken, wallet)
    
  if (router && fromTokenContract && toTokenContract) {
    
    try {

      const fromTokenSymbol = await fromTokenContract.symbol()
      const toTokenSymbol = await toTokenContract.symbol()
      console.log(`Checking ${fromTokenSymbol} balance for ${wallet.address} ...`)
      const tokenBalance = await fromTokenContract.balanceOf(wallet.address)
      if (!tokenBalance.isZero()) {
        await setAllowance(fromTokenContract, tokenBalance, router)

        const amounts = await router.getAmountsOut(parsedAmount, [fromTokenContract.address, toTokenContract.address])
        const [_, targetAmount] = amounts
    
        const adjustedTargetAmount = targetAmount.sub(targetAmount.div(100))
        const swapMethod = 'swapExactTokensForTokens'
        
        const message = `${formatEther(
          parsedAmount
          )} ${fromTokenSymbol} to a minimum of ${formatEther(adjustedTargetAmount)} ${toTokenSymbol}`
    
        console.log(`Swap method: ${swapMethod}`)
        console.log(`Swapping ${message}`)
        console.log(`Output token address: ${toTokenContract.address}`)
        console.log(`Input token address: ${fromTokenContract.address}`)
        console.log(`Wallet address: ${wallet.address}`)
        console.log(`Destination address: ${destinationAddress}`)
        console.log(`Deadline (ms): ${deadline}`)
    
        if (!dryRun) {
          const tx = await router[swapMethod](
            parsedAmount,
            adjustedTargetAmount,
            [fromTokenContract.address, toTokenContract.address],
            destinationAddress,
            deadline,
            {
              gasLimit: 50000000
            }
          )
          const receipt = await tx.wait()
          const success = receipt && receipt.status === 1
          return { trx: "swap", success: true, message: `Swapped ${message} - Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}`}
        } else {
          return { trx: "swap", success: true, message: 'Not swapping due to running in dry run mode', error_body: "Only possible values are 0 or 1"}
        }
      }
    } catch (e) {
      return { trx: "swap", success: false, error_message: e.message, error_body: e.response?.body}
    }
  } else {
    return { trx: "swap", success: false, error_message: `Couldn't swap fromToken ${fromToken} or toToken ${toToken}`, error_body: null}
  }
}

const swapForTokenWithContracts = async function(amount, address, destinationAddress, routerContract, fromTokenContract, toTokenContract) {

  destinationAddress = destinationAddress ? destinationAddress : address
  const parsedAmount = parseEther(amount)

  let dryRun = false
  const deadline = Date.now() + 1000 * 60 * 3
  
  if (router && fromTokenContract && toTokenContract) {
    
    try {
      const fromTokenSymbol = await fromTokenContract.symbol()
      const toTokenSymbol = await toTokenContract.symbol()
      console.log(`Checking ${fromTokenSymbol} balance for ${address} ...`)
      const tokenBalance = await fromTokenContract.balanceOf(address)
      if (!tokenBalance.isZero()) {
        await setAllowance(fromTokenContract, tokenBalance, routerContract)

        const amounts = await routerContract.getAmountsOut(parsedAmount, [fromTokenContract.address, toTokenContract.address])
        const [_, targetAmount] = amounts
    
        const adjustedTargetAmount = targetAmount.sub(targetAmount.div(100))
        const swapMethod = 'swapExactTokensForTokens'
        
        const message = `${formatEther(
          parsedAmount
          )} ${fromTokenSymbol} to a minimum of ${formatEther(adjustedTargetAmount)} ${toTokenSymbol}`
    
        console.log(`Swap method: ${swapMethod}`)
        console.log(`Swapping ${message}`)
        console.log(`Output token address: ${toTokenContract.address}`)
        console.log(`Input token address: ${fromTokenContract.address}`)
        console.log(`Wallet address: ${address}`)
        console.log(`Destination address: ${destinationAddress}`)
        console.log(`Deadline (ms): ${deadline}`)
    
        if (!dryRun) {
          const tx = await routerContract[swapMethod](
            parsedAmount,
            adjustedTargetAmount,
            [fromTokenContract.address, toTokenContract.address],
            destinationAddress,
            deadline,
            {
              gasLimit: 50000000
            }
          )
          const receipt = await tx.wait()
          const success = receipt && receipt.status === 1
          return { trx: "swap", success: true, message: `Swapped ${message} - Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}`}
        } else {
          return { trx: "swap", success: true, message: 'Not swapping due to running in dry run mode', error_body: "Only possible values are 0 or 1"}
        }
      }
    } catch (e) {
      return { trx: "swap", success: false, error_message: e.message, error_body: e.response?.body}
    }
  } else {
    return { trx: "swap", success: false, error_message: `Swap Failed`, error_body: null}
  }
}


