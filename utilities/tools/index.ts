async function displayAccount(name, address) {
  console.log("%s:", name);
  console.log(`- address: ${address}`);
  let balance = await ethers.provider.getBalance(address);
  console.log(`- balance: ${balance}`);
}

async function displayAccounts(name, addresses, limit) {
  console.log("%s:", name);
  if (addresses.length <= limit) {
    for (var address of addresses) {
      var balance = await ethers.provider.getBalance(address);
      console.log(`- ${address}: ${balance}`);
    }
  } else {
    const half = Math.floor(limit / 2);
    for (var i = 0; i < half; i++) {
      var address = addresses[i];
      var balance = await ethers.provider.getBalance(address);
      console.log(`- ${address}: ${balance}`);
    }
    console.log("  ... skipped ...")
    const len = addresses.length;
    for (var i = len - half; i < len; i++) {
      var address = addresses[i];
      var balance = await ethers.provider.getBalance(address);
      console.log(`- ${address}: ${balance}`);
    }
  }
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
  displayAccounts,
  deployContract,
  deployContracts,
  getTransactionReceipt,
  sleep,
  unimplementedTask,
}
