module.exports.OperationCall = async function(oneAddress, ethAddress, hash) {
  await operationCall(oneAddress, ethAddress, hash);
}

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk');
const configs = require('bridge-sdk/lib/configs');


const operationCall = async () => {
  const bridgeSDK = new BridgeSDK({ logLevel: 2 }); // 2 - full logs, 1 - only success & errors, 0 - logs off

  await bridgeSDK.init(configs.testnet);

  try {
    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ETH_TO_ONE,
      token: TOKEN.BUSD,
      network: NETWORK_TYPE.ETHEREUM, // NETWORK_TYPE.BINANCE
      amount: 0.01,
      oneAddress: oneAddress,
      ethAddress: ethAddress,
    });

    await operation.skipAction(ACTION_TYPE.approveEthManger);

    await operation.confirmAction({
      actionType: ACTION_TYPE.lockToken,
      transactionHash: hash,
    });
  } catch (e) {
    console.error('Error: ', e.message, e.response?.body);
  }
};
