import { expect } from "chai";
import { ethers } from "hardhat";

describe("Storage", function () {
  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

    const StorageReader = await ethers.getContractFactory("StorageReader");
    const storageReader = await StorageReader.deploy();

    return { owner, storage, storageReader };
  }

  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { owner, storage, storageReader } = await deployContracts();
      const initValue = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      expect(await storage.loadUint256()).to.equal(initValue);
      const storageAddress = await storage.getAddress();
      expect(await storageReader.loadUint256(storageAddress)).to.equal(initValue);
    });

    it("Should be set to another uint256 value", async function () {
      const { owner, storage, storageReader } = await deployContracts();
      const newValue = "42";
      await storage.storeUint256(newValue);
      const storageAddress = await storage.getAddress();
      expect(await storageReader.loadUint256(storageAddress)).to.equal(newValue);
    });
  });
});
