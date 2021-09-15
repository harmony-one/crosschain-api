require("dotenv").config();

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk');
const BN = require('bn.js');
const Web3 = require('web3');
const configs = require('bridge-sdk/lib/configs');

module.exports.Lock = async function(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) {
  return await lock(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);
}

module.exports.LockTxn = async function(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei) {
  return await lockTxn(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei);
}

async function lockTxn(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(node)
  );
  let account = web3.eth.accounts.privateKeyToAccount(wallet);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  const busdJson = require(abiJson);
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    contractManagerAddress
  );
  let transaction = await busdContract.methods
    .lockToken(amountInWei, account.address)
    .send({
      from: account.address,
      gas: gasLimit,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

const lock = async (approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) => {
  try {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);
    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ETH_TO_ONE, 
      token: TOKEN.BUSD,
      network: NETWORK_TYPE.ETHEREUM,
      amount: amount,
      oneAddress: oneAddress,
      ethAddress: ethAddress,
    });
    await operation.confirmAction({
      actionType: ACTION_TYPE.approveEthManger,
      transactionHash: approveTxnHash,
    });
    console.log("Eth Manager Approved")
    await operation.confirmAction({
      actionType: ACTION_TYPE.lockToken,
      transactionHash: lockTxnHash,
    });
    console.log("Lock Token Approved")
    return { trx: "swap", success: true, error_message: null, error_body: null}
  
  } catch (e) {
    return { trx: "swap", success: true, error_message: e.message, error_body: e.response?.body}
  }
}

