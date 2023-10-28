import * as tools from "../tools";

function addTasks() {
  const currentScope = scope("storage", "Run simple storage-related contracts.");

  currentScope.task("deploy", "Deploy all storage-related contracts.")
    .setAction(deployContracts);

  currentScope.task("save-uint256", "Save a uint256 into Storage contract.")
    .addParam("contract", "The address of a deployed Storage contract.")
    .addParam("value", "The uint256 value which will be stored.")
    .setAction(storeUint256);

  currentScope.task("load-uint256", "Load the uint256 via StorageReader contract.")
    .addParam("contract", "The address of a deployed StorageReader contract.")
    .addParam("targetContract", "The address of a deployed Storage contract.")
    .setAction(loadUint256);
}

async function deployContracts() {
  const contracts = await tools.deployContracts(["Storage", "StorageReader"]);
  let value = await contracts[1].loadUint256(contracts[0].target);
  console.log(`The initialized uint256 is 0x${value.toString(16)}.`);
}

async function storeUint256(args) {
  const contractName = "Storage";
  const deployed = await hre.ethers.getContractAt(contractName, args.contract);
  const result = await deployed.storeUint256(args.value);
  console.log(`Store ${args.value} via transaction "${result.hash}".`);
}

async function loadUint256(args) {
  const contractName = "StorageReader";
  const deployed = await hre.ethers.getContractAt(contractName, args.contract);
  const result = await deployed.loadUint256(args.targetContract);
  console.log(`The result is 0x${result.toString(16)}.`);
}

module.exports = { addTasks }
