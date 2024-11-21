const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Yarntoken", function () {
  let Yarntoken;
  let Token;
  let owner;
  let user;
  let addr1;
  let token;
  let contract;
  let contractAddress;

  const initialBalance = ethers.parseEther("1000");
  const approveAmount = ethers.parseEther("100");

  beforeEach(async function () {
    [owner, user, addr1] = await ethers.getSigners();

    Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("Mock Token", "MTK", initialBalance);

    const tokenAddress = await token.getAddress();
    Yarntoken = await ethers.getContractFactory("Yarntoken");
    contract = await Yarntoken.deploy(tokenAddress);

    contractAddress = await contract.getAddress();

    // Transfer some tokens to the contract to ensure it has a balance
    await token.connect(owner).transfer(contractAddress, approveAmount);
  });

  describe("Deployment", function () {
    it("Should deploy the contract and set the correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the token address correctly", async function () {
      const tokenAddressFromContract = await contract.token();
      const tokenAddress = await token.getAddress();
      expect(tokenAddressFromContract).to.equal(tokenAddress);
    });
  });

  describe("Withdrawals", function () {
    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        await expect(contract.withdraw(approveAmount))
          .to.emit(contract, "Withdrawn")
          .withArgs(owner.address, approveAmount);
      });
    });

    it("Should only allow owner to withdraw tokens", async function () {
      await expect(
        contract.connect(user).withdraw(approveAmount)
      ).to.be.revertedWith("Not the owner");

      await expect(contract.withdraw(approveAmount))
        .to.emit(contract, "Withdrawn")
        .withArgs(owner.address, approveAmount);
    });

    it("Should revert if the contract does not have enough tokens", async function () {
      await expect(
        contract.withdraw(ethers.parseEther("10000"))
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Approvals", function () {
    it("Should emit event on approval and transfer", async function () {
      // First, approve the contract to spend tokens on behalf of the user
      await token.connect(owner).approve(contractAddress, approveAmount);

      // Now, perform the approveAndTransfer function
      await expect(contract.approveAndTransfer(owner.address, approveAmount))
        .to.emit(contract, "Approved")
        .withArgs(owner.address, approveAmount)
        .and.to.emit(contract, "Transfer")
        .withArgs(owner.address, contractAddress, approveAmount);
    });

    it("Should allow the contract to spend tokens after approval and transfer", async function () {
      // First, approve the contract to spend tokens on behalf of the user
      await token.connect(owner).approve(contractAddress, approveAmount);

      // Check contract's token balance before and after the transfer
      const contractBalanceBefore = await token.balanceOf(contractAddress);
      expect(contractBalanceBefore).to.equal(approveAmount);

      // Call approveAndTransfer to approve and transfer in one step
      await contract.approveAndTransfer(addr1.address, approveAmount);

      // The contract is supposed to receive the tokens from the user
      const contractBalanceAfter = await token.balanceOf(contractAddress);
      expect(contractBalanceAfter).to.equal(
        contractBalanceBefore + approveAmount
      );
    });
  });

  describe("Ownership", function () {
    it("Should allow ownership transfer", async function () {
      await expect(contract.transferOwnership(addr1.address))
        .to.emit(contract, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);
      expect(await contract.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        contract.connect(user).transferOwnership(addr1.address)
      ).to.be.revertedWith("Not the owner");
    });
  });
});
