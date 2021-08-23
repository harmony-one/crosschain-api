require("dotenv").config();

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HARMONY_NODE_URL));
const configs = require('bridge-sdk/lib/configs');

module.exports.Bridge = async function(trx, oneAddress, ethAddress, node, gasLimit, exchangeMode, networkType, ActionType, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount) {
  return await bridge(trx, oneAddress, ethAddress, node, gasLimit, exchangeMode, networkType, ActionType, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount);
}

module.exports.OperationCall = async function(exchangeMode, networkType, ActionType, approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) {
  await burn(exchangeMode, networkType, ActionType, approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);
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

// ===== LOCK ===== //

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

const lock = async (exchangeMode, networkType, ActionType, approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) => {
  try {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);
    const operation = await bridgeSDK.createOperation({
      type: exchangeMode, 
      token: TOKEN.BUSD,
      network: networkType,
      amount: amount,
      oneAddress: oneAddress,
      ethAddress: ethAddress,
    });
    await operation.confirmAction({
      actionType: ActionType,
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

// ===== BURN ===== //

async function deposit(node, gasLimit, abiJson,  wallet, amountInWei) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(node)
  );

  let account = web3.eth.accounts.privateKeyToAccount(wallet);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contractJson = require(abiJson);
  const contract = new web3.eth.Contract(contractJson.abi, process.env.HMY_DEPOSIT_CONTRACT);

  let response = await contract.methods
    .deposit(web3.utils.toWei("15", "ether"))
    .send({
      from: account.address,
      gas: gasLimit,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
      value: web3.utils.toWei("15", "ether"),
    });

  return response.transactionHash;
}

async function burnTxn(node, gasLimit, abiJson, contractManagerAddress, wallet, amountInWei) {
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
    .burnToken(process.env.HMY_BSCBUSD_CONTRACT, amountInWei, account.address)
    .send({
      from: account.address,
      gas: gasLimit,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  return transaction.transactionHash;
}

const burn = async (exchangeMode, networkType, ActionType, depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, amount) => {
  try {
    
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);

    const operation = await bridgeSDK.createOperation({
      type: exchangeMode,
      token: TOKEN.ERC20,
      erc20Address: process.env.BSC_BUSD_CONTRACT,
      network: networkType,
      amount: amount/1e18,
      oneAddress: oneAddress,
      ethAddress: ethAddress,
    });
    await operation.confirmAction({
      actionType: ACTION_TYPE.depositOne,
      transactionHash: depositTxnHash,
    });
    await operation.confirmAction({
      actionType: ActionType,
      transactionHash: approveTxnHash,
    });
    console.log("Hmy Manager Approved")
    await operation.confirmAction({
      actionType: ACTION_TYPE.burnToken,
      transactionHash: burnTxnHash,
    });
    console.log("Burn Token Approved")
    return { trx: "swap", success: true, error_message: null, error_body: null}
  
  } catch (e) {
    return { trx: "swap", success: true, error_message: e.message, error_body: e.response?.body}
  }
}

async function bridge(trx, oneAddress, ethAddress, node, gasLimit, exchangeMode, networkType, ActionType, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, wallet, amount) {
  try {

    let fomattedAmount = web3.utils.toWei(amount, "ether");

    console.log("Node:", node)
    console.log("Gas Limit:", gasLimit)
    console.log("Exchange Mode:", exchangeMode)
    console.log("Network Type:", networkType)
    console.log("Action Type:", ActionType)
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
        const lockTxnHash = await lockTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount);
        console.log("lockTxnHash", lockTxnHash);
        await lock(exchangeMode, networkType, ActionType, approveTxnHash, lockTxnHash, oneAddress, ethAddress, fomattedAmount);
        break;
      case 1: // Burn
      console.log("Trx:", "Burn it!") 
        const depositTxnHash = await deposit(node, gasLimit, './abi/Deposit.json', wallet, fomattedAmount);
        console.log("depositTxnHash", depositTxnHash);
        const burnTxnHash = await burnTxn(node, gasLimit, contractManagerAbiJson, contractManagerAddress, wallet, fomattedAmount);
        console.log("burnTxnHash", burnTxnHash);
        await burn(exchangeMode, networkType, ActionType, depositTxnHash, approveTxnHash, burnTxnHash, oneAddress, ethAddress, fomattedAmount);
        break;
      default:
        return { trx: "bridge", success: false, error_message: "Wrong transaction value", error_body: "Only possible values are 0 or 1"}
    }

    // ===== Done. ===== //
    return { trx: "bridge", success: true, error_message: null, error_body: null}
 
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}

