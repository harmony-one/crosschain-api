require("dotenv").config();

const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL));

var lock = require('./lock.js');
var burn = require('./burn.js');

module.exports.Bridge = async function(trx, oneAddress, ethAddress, node, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount) {
  return await bridge(trx, oneAddress, ethAddress, node, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount);
}

module.exports.LockWithHash = async function(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) {
  return await lockWithHash(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);
}

module.exports.BurnWithHash = async function(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount) {
  return await burnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount);
}

// create and sign approve BUSD txn
async function approveContractManager(node, gasLimit, abiJson, contractAddress, contractManagerAddress, wallet, amountInWei) {
  
  const web3 = new Web3(
    new Web3.providers.HttpProvider(node) 
  );
  
  let account = web3.eth.accounts.privateKeyToAccount(wallet);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  const busdJson = require(abiJson);
  const busdContract = new web3.eth.Contract(
    busdJson.abi,
    contractAddress
  );
  let transaction = await busdContract.methods
    .approve(contractManagerAddress, amountInWei)
    .send({
      from: account.address,
      gas: gasLimit, 
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

async function bridge(trx, oneAddress, ethAddress, node, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount) {
  try {
    
    let fomattedAmount = web3.utils.toWei(amount, "ether");
    console.log("Node:", node)
    console.log("Gas Limit:", gasLimit)
    console.log("Token ABI:", contractAbiJson)
    console.log("Token Contract Address:", contractAddress)
    console.log("Manager ABI:", contractManagerAbiJson)
    console.log("Contract Manager Address:", contractManagerAddress)
    console.log("Amount:", amount)
    console.log("Amount in Wei:", fomattedAmount)

    // ===== Approve Contract Manager ===== //
    const approveTxnHash = await approveContractManager(node, gasLimit, contractAbiJson, contractAddress, contractManagerAddress, wallet, fomattedAmount);
    console.log("approveTxnHash", approveTxnHash);

    switch (trx) {
      case 0: //Lock
        console.log("Trx:", "Lock it!")
        const lockTxnHash = await lock.LockTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount);
        console.log("lockTxnHash", lockTxnHash);
        await lock.Lock(approveTxnHash, lockTxnHash, oneAddress, ethAddress, fomattedAmount);
        break;
      case 1: // Burn
      console.log("Trx:", "Burn it!") 
        const depositTxnHash = await burn.Deposit(node, gasLimit, './abi/Deposit.json', wallet, fomattedAmount);
        console.log("depositTxnHash", depositTxnHash);
        const burnTxnHash = await burn.BurnTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount);
        console.log("burnTxnHash", burnTxnHash);
        await burn.Burn(depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, fomattedAmount);
        break;
      default:
        return { trx: "bridge", success: false, error_message: "Wrong transaction value", error_body: "Only possible values are 0 or 1"}
    }
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}

async function lockWithHash(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) {
  try {
    let fomattedAmount = web3.utils.toWei(amount, "ether");
    console.log("approveTxnHash", approveTxnHash);
    console.log("Trx:", "Lock it!")
    console.log("lockTxnHash", lockTxnHash);
    await lock.Lock(approveTxnHash, lockTxnHash, oneAddress, ethAddress, fomattedAmount);
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}

async function burnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount) {
  try {
    let fomattedAmount = web3.utils.toWei(amount, "ether");
    console.log("Trx:", "Burn it!") 
    console.log("approveTxnHash", approveTxnHash);
    console.log("depositTxnHash", depositTxnHash);
    console.log("burnTxnHash", burnTxnHash);
    await burn.Burn(depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, fomattedAmount);
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}


