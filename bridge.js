export const operationCall = async (type,token,network,oneAddress,ethAddress,transactionHash) => {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 }); // 2 - full logs, 1 - only success & errors, 0 - logs off
  
    await bridgeSDK.init(configs.testnet);
  
    try {
      const operation = await bridgeSDK.createOperation({
        type: type,
        token: token,
        network: network, // NETWORK_TYPE.BINANCE
        amount: 0.01,
        oneAddress: oneAddress,
        ethAddress: ethAddress,
      });
  
      /********/
      // Here you need to generate and call contract methods to lock your token
      // We skipped this step in this example and will assume that you already have a successfully completed Locked Tokens transaction.
      /********/
  
      await operation.skipAction(ACTION_TYPE.approveEthManger);
  
      await operation.confirmAction({
        actionType: ACTION_TYPE.lockToken,
        transactionHash: transactionHash,
      });
    } catch (e) {
      console.error('Error: ', e.message, e.response?.body);
    }
  };