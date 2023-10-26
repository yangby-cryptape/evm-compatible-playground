function addTasks() {
  const storageScope = scope("storage", "Run simple storage-related contracts.");

  storageScope.task("deploy", "Deploy all storage-related contracts.")
    .setAction(deployContracts);

  storageScope.task("save-uint256", "Save a uint256 into Storage contract.")
    .addParam("contract", "The address of deployed Storage contract.")
    .addParam("value", "The uint256 value which will be stored.")
    .setAction(storeUint256);

  storageScope.task("load-uint256", "Load the uint256 via StorageReader contract.")
    .addParam("contract", "The address of deployed StorageReader contract.")
    .addParam("targetContract", "The address of deployed Storage contract.")
    .setAction(loadUint256);
}

async function deployContracts() {
  const storage = await ethers.deployContract("Storage");
  const storageReader = await ethers.deployContract("StorageReader");

  console.log(`The contract Storage       is being deployed to ${storage.target} ...`);
  console.log(`The contract StorageReader is being deployed to ${storageReader.target} ...`);

  await storage.waitForDeployment();
  await storageReader.waitForDeployment();

  console.log("All contracts are deployed.");

  let value = await storageReader.loadUint256(storage.target);
  console.log(`The initialized uint256 is 0x${value.toString(16)}.`);
}

async function storeUint256 (args) {
  const contractName = "Storage";
  const deployed = await hre.ethers.getContractAt(contractName, args.contract);
  const result = await deployed.storeUint256(args.value);
  console.log(`Store ${args.value} via transaction "${result.hash}".`);
}

async function loadUint256 (args) {
  const contractName = "StorageReader";
  const deployed = await hre.ethers.getContractAt(contractName, args.contract);
  const result = await deployed.loadUint256(args.targetContract);
  console.log(`The result is 0x${result.toString(16)}.`);
}

module.exports = { addTasks }
