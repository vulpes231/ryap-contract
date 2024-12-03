require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
// const SEPOLIA_PRIVATE_KEY =process.env("SEPOLIA_PRIVATE_KEY");
const BSCTEST_PRIVATE_KEY = process.env.BSCTEST_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    // sepolia: {
    //   url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [SEPOLIA_PRIVATE_KEY],
    // },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [BSCTEST_PRIVATE_KEY],
    },
    // bscmain: {
    //   url: "https://bsc-dataseed.bnbchain.org/",
    //   chainId: 56,
    //   gasPrice: 20000000000,
    //   accounts: [BSC_PRIVATE_KEY],
    // },
  },
};
