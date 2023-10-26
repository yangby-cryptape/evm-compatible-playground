import { ethers } from "hardhat";

async function main() {
  const storage = await ethers.deployContract("Storage");
  const storageReader = await ethers.deployContract("StorageReader");

  console.log(`The contract Storage       is being deployed to ${storage.target} ...`);
  console.log(`The contract StorageReader is being deployed to ${storageReader.target} ...`);

  await storage.waitForDeployment();
  await storageReader.waitForDeployment();

  console.log(`All contracts are deployed.`);

  let value = await storageReader.loadUint256(storage.target);
  console.log(`The initialized uint256 is 0x${value.toString(16)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
