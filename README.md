# crosschain-api
Welcome to Harmony's Crosschain API!

This API will let you swap assets between different chains, this is the current status:

Version: B0.1

* This version allow you to swap BUSD in Ethereum into BUSD in Binance, we thought this is a good first step because it will serve as a vehicle between any assets between the two networks.

* Testnets required for running this versions are:

    * Harmony Testnet (https://api.s0.b.hmny.io)
    * Ethereum Kovan (https://kovan.infura.io/v3/acb534b53d3a47b09d7886064f8e51b6)
    * BSC Testnet (https://data-seed-prebsc-2-s1.binance.org:8545/)

### Some Basic Instructions

* Right now you see two folders, `webserver` and `scripts`. The former contains the webserver that must be started to call the API endpoints locally in you machine (there is `.REDME` file there with more detailed instructions), he latter contains scripts in `javascript` and `postman` that can be used to test the endpoints once you have the webserber running and also as examples of how to make `GET` and `POST` calls.

* You will need to set `.env` files in both folders, we are adding samples for those files, you can just go ahead and rename them from `env_file` to `.env`, you will need to add your private key to the file in the scripts folder if you plan to use the `.js` file. If you plan to use postman, you will need to paste it into the workspace, so make sure that you create it outside the repo. In any case we encourage you to add `.env` files to the `.gitignore` and never paste you private keys in the code. 

Enjoy!