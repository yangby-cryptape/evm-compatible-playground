async function displayAccount(name, address) {
  console.log("%s:", name);
  console.log(`- address: ${address}`);
  let balance = await ethers.provider.getBalance(address);
  console.log(`- balance: ${balance}`);
}

async function deployContract(contractName) {
  const contract = await ethers.getContractFactory(contractName);
  const deployed = await contract.deploy();
  console.log("The contract %s is being deployed to \"%s\".", contractName, deployed.target);
  return deployed;
}

async function deployContracts(contractNames: string[]) {
  let contracts = [];
  for (var contractName of contractNames) {
    const contract = await ethers.deployContract(contractName);
    console.log("The contract %s is being deployed to \"%s\".", contractName, contract.target);
    contracts.push(contract);
  }
  let deployedContracts = []
  for (var contract of contracts) {
    const deployed = await contract.waitForDeployment();
    deployedContracts.push(deployed);
  }
  console.log("All contracts are deployed.");
  return deployedContracts;
}

async function getTransactionReceipt(txHash, seconds) {
  const ms_per_turn = 500;
  let milliSecs = seconds * 1000;
  for (let i = 0; i < milliSecs; i+=ms_per_turn) {
    const receipt = await ethers.provider.getTransactionReceipt(txHash);
    if (receipt !== null) {
      return receipt;
    }
    await sleep(ms_per_turn);
  }
  return null;
}

async function sleep(milliSecs) {
  await new Promise(r => setTimeout(r, milliSecs));
}

async function unimplementedTask(args) {
  console.log("This task is unimplemented!");
  console.log("The arguments that provided are:");
  console.log(args);
}

module.exports = {
  displayAccount,
  deployContract,
  deployContracts,
  getTransactionReceipt,
  sleep,
  unimplementedTask,
}
