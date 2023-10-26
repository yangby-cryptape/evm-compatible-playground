async function displayAccount(name, address) {
  console.log("%s:", name);
  console.log(`- address: ${address}`);
  let balance = await ethers.provider.getBalance(address);
  console.log(`- balance: ${balance}`);
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
  getTransactionReceipt,
  sleep,
  unimplementedTask,
}
