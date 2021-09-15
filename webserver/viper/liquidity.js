const ChainId = require('@venomswap/sdk').ChainId
var contracts = require('./contracts.js');

module.exports.addLiquidity = async function(wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo) {
    return await addLiquidity(wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo)
}

module.exports.removeLiquidity = async function(wallet, tokenA, tokenB, removalPercentage) {
    return await removeLiquidity(wallet, tokenA, tokenB, removalPercentage)
}

const setAllowance = async function(fromTokenContract, amount, router) {
  await fromTokenContract.approve(router.address, amount)
}

const addLiquidity = async function(wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo) {
        try {
            const deadline = Date.now() + 1000 * 60 * 3
            const routerContract = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
            const tokenAContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, tokenA, wallet)
            await setAllowance(tokenAContract, parseEther(amountADesired), routerContract)
            const tokenBContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, tokenB, wallet)
            await setAllowance(tokenBContract, parseEther(amountBDesired), routerContract)
            let tx = await routerContract.addLiquidity(
              tokenA,
              tokenB,
              parseEther(amountADesired),
              parseEther(amountBDesired),
              parseEther(amountAMin),
              parseEther(amountBMin),
              sendTo,
              deadline,
              {
                gasLimit: 50000000
              }
            );
            const receipt = await tx.wait()
            const success = receipt && receipt.status === 1
            console.log(
              `Add Liquidity -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
            )
            return { trx: "liquidity", success: true, message: `Add Liquidity -  Transaction receipt - tx:${tx} tx hash: ${receipt.transactionHash}, success: ${success}\n`}
          } catch (e) {
            console.error("Error: ", e.message, e)
            return { trx: "liquidity", success: false, error_message: `Could not Add Liquidity`, error_body: null}
          } 
    }

const removeLiquidity = async function(wallet, tokenA, tokenB, removalPercentage) {
    try {
        const deadline = Date.now() + 1000 * 60 * 3
        // Factory GetPair address for tokens
        const factoryContract = await contracts.getFactoryContract(ChainId.HARMONY_TESTNET, wallet)
        const routerContract = await contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
        let getPairResult = await factoryContract.getPair(tokenA, tokenB)
        console.log(`getPairResult: ${getPairResult}`)
        const pairContract = await contracts.getPairContract(getPairResult, wallet)
        // TokenPair Get balance for user
        let getBalanceResult = await pairContract.balanceOf(wallet.address)
        console.log(`getBalanceResult: ${getBalanceResult}`)
        console.log(`SettingAllowance`)
        await setAllowance(pairContract, getBalanceResult, routerContract)
        console.log(`AllowanceSet`)
        let removalAmount = getBalanceResult // 10^18 //* removalPercentage / 100 
        // Router Remove the amount
        const zeroMin = parseEther('0.1') //math.bignumber('0')
        console.log(`zeroMin: ${zeroMin}`)
        console.log(`wallet.address: ${wallet.address}`)
        console.log(`tokenA: ${tokenA}`)
        console.log(`tokenB: ${tokenB}`)
        console.log(`liquidity: ${removalAmount}`)
        console.log(`amountAMin: ${zeroMin}`)
        console.log(`amountBMin: ${zeroMin}`)
        console.log(`to: ${wallet.address}`)
        console.log(`Deadline (ms): ${deadline}`)
    
        let tx = await routerContract.removeLiquidity(
          tokenA, 
          tokenB, 
          removalAmount, 
          zeroMin,
          zeroMin,
          wallet.address,
          deadline,
          {
            gasLimit: 50000000
          }
        );
        const receipt = await tx.wait()
        const success = receipt && receipt.status === 1
        console.log(
          `Liquidity Removal -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
        )
        return { trx: "liquidity", success: true, message: `Liquidity Removal -  Transaction receipt - tx:${tx} tx hash: ${receipt.transactionHash}, success: ${success}\n`}
      } catch (e) {
        console.error("Error: ", e.message, e)
        return { trx: "liquidity", success: false, error_message: `Could not Add Liquidity`, error_body: null}
      } 
}