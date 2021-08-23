# Webserver

This is a webserver uses `node` and `express`, just run `npm install` and `npm run` to have it running. We assume that it will run in port 3000 but feel free to change it. Don't forget to update the scritps accordingly though.

## Endpoints


The general architectur of the API is the following

- You have a single endpoint to make swaps the `/swap`, this is a multi-step process that can fail if one of them fails. It uses Harmony's Horizon Bridge and Viper DEX, so for example, the bridging part can work but there is no liquidity in the pool so the who transaction will fail. Therefore use this enpoint only if you are sure that Viper's LPs have enough liquidity.

- If you prefer to do it setp-by-step, you should use the following end-points in the specified order:

    - `/swap/bridge-in` - Bridges `BUSD` in ethereum to Harmony's `BUSD`
    - `/swap/viper/` - Swaps Harmony's `BUSD` to `bscBUSD` (Both are bridged assets in the Harmony network)
    - `/swap/bridge-out` - Bridges `bscBUSD` into Binance's `BUSD`

Right now the following endpoints are enabled, but we will keep adding more reguarly, so remember to pull once in a while.

### **`POST /swap`** 

This enpoint will swap balances between Ethereum BUSD and Binance BUSD, the body for this request should look like this:

```
{
    "amount" : amount,
    "wallet" : wallet,
    "oneAddress" : oneAddress,
    "ethAddress" : ethAddress
}
```

- `amount`: this is a string with amount in decimals (e.g. "10.50") that you want to swap
- `wallet`: this is the private key of the wallets with the funds, please use an `.env` or equivalent to store this key, never put it in your code
- `oneAddress`: the address of the wallet owned by the private key in the Harmony wallet format i.e. `oneaxxxxxxxx`
- `ethAddress`: the address of the wallet owned by the private key in the Ethereum wallet format i.e. `Oxaxxxxxxxx`

_You can see an example of this call in the `swap.js` file in the scripts folder of this repo_

### **`POST /swap/bridge-in`** 

This enpoint will bridges `BUSD` in ethereum to Harmony's `BUSD`, it is the first step of the step-by-step swap, the body for this request should look like this:

```
{
    "amount" : amount,
    "wallet" : wallet,
    "oneAddress" : oneAddress,
    "ethAddress" : ethAddress
}
```

- `amount`: this is a string with amount in decimals (e.g. "10.50") that you want to swap
- `wallet`: this is the private key of the wallets with the funds, please use an `.env` or equivalent to store this key, never put it in your code
- `oneAddress`: the address of the wallet owned by the private key in the Harmony wallet format i.e. `oneaxxxxxxxx`
- `ethAddress`: the address of the wallet owned by the private key in the Ethereum wallet format i.e. `Oxaxxxxxxxx`

_You can see an example of this call in the `bridge-lock.js` file in the scripts folder of this repo_

### **`POST /swap/viper`**

This enpoint will swap Harmony's `BUSD` to `bscBUSD` (Both are bridged assets in the Harmony network), it is the second step of the step-by-step swap, the body for this request should look like this:

```
{
    "amount" : amount,
    "wallet" : wallet,
    "oneAddress" : oneAddress,
}
```

- `amount`: this is a string with amount in decimals (e.g. "10.50") that you want to swap
- `wallet`: this is the private key of the wallets with the funds, please use an `.env` or equivalent to store this key, never put it in your code
- `oneAddress`: the address of the wallet owned by the private key in the Harmony wallet format i.e. `oneaxxxxxxxx`

_You can see an example of this call in the `viper.js` file in the scripts folder of this repo_

### **`POST /swap/bridge-out`** 

This enpoint will bridges `bscBUSD` into Binance's `BUSD`, it is the third step of the step-by-step swap, the body for this request should look like this:

```
{
    "amount" : amount,
    "wallet" : wallet,
    "oneAddress" : oneAddress,
    "ethAddress" : ethAddress
}
```

- `amount`: this is a string with amount in decimals (e.g. "10.50") that you want to swap
- `wallet`: this is the private key of the wallets with the funds, please use an `.env` or equivalent to store this key, never put it in your code
- `oneAddress`: the address of the wallet owned by the private key in the Harmony wallet format i.e. `oneaxxxxxxxx`
- `ethAddress`: the address of the wallet owned by the private key in the Ethereum wallet format i.e. `Oxaxxxxxxxx`

_You can see an example of this call in the `bridge-burn.js` file in the scripts folder of this repo_
