const ethers = require('ethers')
const ROUTER_ADDRESSES = require('@venomswap/sdk').ROUTER_ADDRESSES
const MASTER_BREEDER_ADDRESSES = require('@venomswap/sdk').MASTER_BREEDER_ADDRESSES
const ROUTER_ABI = require('@viperswap/periphery/build/IUniswapV2Router02.json').abi
const IERC20_ABI = require('@venomswap/periphery/build/IERC20.json').abi
const IUNISWAPV2PAIR_ABI = require('@viperswap/periphery/build/IUniswapV2Pair.json').abi
const MASTER_BREEDER_ABI = require('@venomswap/contracts/build/MasterBreeder.json').abi

/* Retrieve Viper's router contract
 * @param {string} chainId
 * @param {string} walletOrProvider
 * @return ethers Contract object
*/
module.exports.getRouterContract = function(
    chainId,
    walletOrProvider
  ) {
    const routerAddress = ROUTER_ADDRESSES[chainId]
    if (routerAddress) {
      return new ethers.Contract(routerAddress, ROUTER_ABI, walletOrProvider)
    }
    return undefined
  }
  
  /* Retrieve Viper's ERC20 token contract
   * @param {string} chainId
   * @param {string} walletOrProvider
   * @return ethers Contract object
  */
  module.exports.getTokenContract = function(
    addressOrSymbol,
    walletOrProvider
  ) {
    return new ethers.Contract(addressOrSymbol, IERC20_ABI, walletOrProvider)
  }
  
  /* Retrieve Uniswap's pair contract
   * @param {string} pairAddress
   * @param {string} walletOrProvider
   * @return ethers Contract object
  */
  module.exports.getPairContract = function(
    pairAddress,
    walletOrProvider
  ) {
    if (isAddress(pairAddress)) {
      return new ethers.Contract(pairAddress, IUNISWAPV2PAIR_ABI, walletOrProvider)
    }
    return undefined
  }
  
  /* Retrieve Viper's MasterBreeders's contract
   * @param {string} chainId
   * @param {string} walletOrProvider
   * @return ethers Contract object
  */
  module.exports.getMasterBreederContract = function(
    chainId,
    walletOrProvider
  ) {
    const masterBreederAddress = MASTER_BREEDER_ADDRESSES[chainId]
    if (masterBreederAddress && isAddress(masterBreederAddress)) {
      return new ethers.Contract(masterBreederAddress, MASTER_BREEDER_ABI, walletOrProvider)
    }
    return undefined
  }
