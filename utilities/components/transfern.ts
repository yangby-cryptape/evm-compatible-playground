import * as tools from "../tools";

const CONTRACT_NAME = "OneToManyCurrencySender";

function addTasks() {
  const currentScope = scope("transfern", "Run transfer-related contracts for multiple addresses.");

  currentScope.task("deploy", "Deploy related contracts.")
    .setAction(deployContracts);

  currentScope.task("same-value", "Transfer a same value for all addresses.")
    .addParam("contract", "The address of a deployed OneToManyCurrencySender contract.")
    .addParam("value", "The number of the currency that will be sent.")
    .addVariadicPositionalParam("addresses", "A list of destination address which will receive the currency.")
    .setAction(sendSameValue);

  currentScope.task("values", "Transfer different values to different addresses.")
    .addParam("contract", "The address of a deployed OneToManyCurrencySender contract.")
    .addVariadicPositionalParam("bills", "A list of destination address and the values which will be sent to them (format: `address,value`).")
    .setAction(sendValues);

  currentScope.task("machine-gun", "Transfer 1 wei to all addresses of consecutive private keys.")
    .addParam("contract", "The address of a deployed OneToManyCurrencySender contract.")
    .addParam("privateKey", "The private key to calculate the first address.")
    .addParam("count", "How many addresses to transfer?")
    .setAction(gunShot);
}

async function deployContracts() {
  await tools.deployContract("OneToManyCurrencySender");
  console.log("All contracts are deployed.");
}

async function sendSameValue(args) {
  let value = ethers.parseEther(args.value);
  let total = value * ethers.getBigInt(args.addresses.length);
  let params = { value: total };

  const [sender,] = await ethers.getSigners();
  await tools.displayAccount("Sender", sender.address);
  console.log(`Try to transfer ${total} to ${args.addresses.length} addresses ...`);
  const deployed = await hre.ethers.getContractAt(CONTRACT_NAME, args.contract);

  let result = await deployed.sendSameValue(args.addresses, value, params);
  console.log(`The transaction is "${result.hash}"`);
  let receipt = await tools.getTransactionReceipt(result.hash, 10);
  console.log(`Cost ${receipt.gasUsed} gas.`);
  await tools.displayAccount("Sender", sender.address);

  console.log("====    ====    ====    ====    ====    ====    ====    ====");
  await tools.displayAccounts("Receivers", args.addresses, 10);
}

async function sendValues(args) {
  let addresses = [];
  let bills = [];
  let total = ethers.parseEther("0");

  for (var i = 0; i < args.bills.length; i++) {
    let details = args.bills[i].split(",");
    if (details.length !== 2) {
      throw new Error(`Unknown bill "${details}" (${i}-th item in bills).`);
    }
    let bill = { payee: details[0], value: ethers.parseEther(details[1]) };
    addresses.push(bill.payee);
    total += bill.value;
    bills.push(bill);
  }
  let params = { value: total };

  const [sender,] = await ethers.getSigners();
  await tools.displayAccount("Sender", sender.address);
  console.log(`Try to transfer ${total} to ${addresses.length} addresses ...`);
  const deployed = await hre.ethers.getContractAt(CONTRACT_NAME, args.contract);

  let result = await deployed.sendValues(bills, params);
  console.log(`The transaction is "${result.hash}"`);
  let receipt = await tools.getTransactionReceipt(result.hash, 10);
  console.log(`Cost ${receipt.gasUsed} gas.`);
  await tools.displayAccount("Sender", sender.address);

  console.log("====    ====    ====    ====    ====    ====    ====    ====");
  await tools.displayAccounts("Receivers", addresses, 10);
}

async function gunShot(args) {
  let addresses = [];
  let privateValue = ethers.getBigInt(args.privateKey);
  for (var i = 0; i < args.count; i++) {
    var privateKey = privateValue.toString(16).padStart(64, '0');
    var receiver = new ethers.Wallet(privateKey, ethers.provider);
    addresses.push(receiver.address);
    privateValue += 1n;
  }

  let value = ethers.parseUnits("1", "wei");
  let total = value * ethers.getBigInt(args.count);
  const params = { value: total };

  const [sender,] = await ethers.getSigners();
  await tools.displayAccount("Sender", sender.address);
  console.log(`Try to transfer ${total} to ${addresses.length} addresses ...`);
  const deployed = await hre.ethers.getContractAt(CONTRACT_NAME, args.contract);

  let result = await deployed.sendSameValue(addresses, value, params);
  console.log(`The transaction is "${result.hash}"`);
  let receipt = await tools.getTransactionReceipt(result.hash, 10);
  console.log(`Cost ${receipt.gasUsed} gas.`);
  await tools.displayAccount("Sender", sender.address);

  console.log("====    ====    ====    ====    ====    ====    ====    ====");
  await tools.displayAccounts("Receivers", addresses, 10);
}

module.exports = { addTasks }
