import {
  displayAccount,
  getTransactionReceipt,
  unimplementedTask,
} from "../tools";

function addTasks() {
  const currentScope = scope("transfer1", "Run transfer-related contracts for one destination address.");

  currentScope.task("deploy", "Deploy all storage-related contracts.")
    .setAction(deployContracts);

  currentScope.task("simple", "Through the simplest transaction.")
    .addParam("to", "The destination address which will receive the currency.")
    .addParam("value", "The number of the currency that will be sent.")
    .setAction(simpleSend);

  currentScope.task("via-contract", "Through the CurrencySender contract.")
    .addParam("contract", "The address of a deployed CurrencySender contract.")
    .addParam("method", "The method which be used to transfer via the contract."
                        + " Optional parameters are: transfer, send and call.")
    .addParam("to", "The destination address which will receive the currency.")
    .addParam("value", "The number of the currency that will be sent.")
    .setAction(sendViaContract);
}

async function deployContracts() {
  const currencySender = await ethers.deployContract("CurrencySender");

  console.log(`The contract CurrencySender is being deployed to ${currencySender.target} ...`);

  await currencySender.waitForDeployment();

  console.log("All contracts are deployed.");
}

async function displayAccounts(sender, receiver) {
  await displayAccount("Sender", sender);
  await displayAccount("Receiver", receiver);
}

async function simpleSend(args) {
  const [sender,] = await ethers.getSigners();
  await displayAccounts(sender.address, args.to);
  let value = ethers.parseEther(args.value);

  console.log(`Try to transfer ${value} from sender to receiver ...`);
  let result = await sender.sendTransaction({
    to: args.to,
    value: value,
  });

  console.log(`The transaction is "${result.hash}"`);
  let receipt = await getTransactionReceipt(result.hash, 10);
  console.log(`Cost ${receipt.gasUsed} gas.`);
  await displayAccounts(sender.address, args.to);
}

async function sendViaContract(args) {
  const contractName = "CurrencySender";
  const [sender,] = await ethers.getSigners();
  await displayAccounts(sender.address, args.to);
  let value = ethers.parseEther(args.value);
  let params = { value: value };

  console.log(`Try to transfer ${value} via the ${args.method} method ...`);
  const deployed = await hre.ethers.getContractAt(contractName, args.contract);
  let result;
  switch (args.method) {
    case "transfer":
      result = await deployed.sendViaTransfer(args.to, params);
      break;
    case "send":
      result = await deployed.sendViaSend(args.to, params);
      break;
    case "call":
      result = await deployed.sendViaCall(args.to, params);
      break;
    default:
      throw new Error(`Unknown method "${args.method}" for transfer via a contract.`);
      break;
  }

  console.log(`The transaction is "${result.hash}"`);
  let receipt = await getTransactionReceipt(result.hash, 10);
  console.log(`Cost ${receipt.gasUsed} gas.`);
  await displayAccounts(sender.address, args.to);
}

module.exports = { addTasks }
