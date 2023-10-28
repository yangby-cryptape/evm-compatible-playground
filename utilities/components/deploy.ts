import * as tools from "../tools";

function addTasks() {
  task("deploy", "Deploy contracts.")
    .addVariadicPositionalParam("contractNames", "A list of contract names which will be deployed.")
    .setAction(deployContracts);
}

async function deployContracts(args) {
  await tools.deployContracts(args.contractNames);
}

module.exports = { addTasks }
