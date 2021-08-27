# Using the Scripts the API

* These scripts will build the transactions required to call Harmony's production API, for more instructions on how to use the API check the (webserver repo)[https://dicdoc.gitbook.io/doc/smart-chain-api/cross-chain-api]

* Make sure to rename the `env_file` to `.env` and add your private key. 

* To run a script just execute the node file e.g. `node bridge_eth_to_one.js`

# The Scripts

* `bridge_eth_to_one.js` This script bridges ethereum BUSD to Harmony's ethereum BUSD
* `bridge_one_to_bsc.js` This script bridges Harmony's BSC BUSD to BSC BUSD
* `viper_swap.js` This script swaps Harmony's ethereum BUSD to Harmony's BSC BUSD to BSC BUSD