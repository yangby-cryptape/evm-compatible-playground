function addTasks() {
  task("deploy", "Deploy contracts.")
    .addVariadicPositionalParam("contractNames", "A list of contract names which will be deployed.")
    .setAction(deployContracts);
}

async function deployContracts(args) {
  for (var contractName of args.contractNames) {
    const contract = await ethers.deployContract(contractName);
    await contract.waitForDeployment();
    console.log("The contract %s is being deployed to \"%s\".", contractName, contract.target);
  }
}

module.exports = { addTasks }
