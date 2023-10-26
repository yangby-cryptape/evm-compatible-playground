import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";

const defaultSolidityVersion = "0.8.21";
const defaultJsonRpcUrl = "http://127.0.0.1:8545";
const defaultMnemonic = "test test test test test test test test test test test junk";

function init(): HardhatUserConfig {
  dotEnvConfig();
  const config: HardhatUserConfig = {
    solidity: process.env.DEFAULT_SOLIDITY_VERSION || defaultSolidityVersion,

    networks: {
      customized: {
        url: process.env.JSONRPC_URL || defaultJsonRpcUrl,
        accounts: {
          mnemonic: process.env.ACCOUNTS_MNEMONIC || defaultMnemonic,
          initialIndex: 0,
          count: 1,
        }
      }
    }
  };
  return config;
}

module.exports = { init }
