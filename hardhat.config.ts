import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

import { initConfig, initTasks } from "./utilities/hardhat";

const config = initConfig();
export default config;

initTasks();
