require("@nomicfoundation/hardhat-toolbox");

const { vars } = require("hardhat/config");
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};
