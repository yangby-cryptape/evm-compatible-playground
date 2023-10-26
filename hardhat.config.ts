import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

const defaultJsonRpcUrl = "http://127.0.0.1:8545";
const defaultMnemonic = "test test test test test test test test test test test junk";

dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.21",

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

export default config;
