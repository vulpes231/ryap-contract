// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("YarntokenModule", (m) => {
  const yarnToken = m.contract("Yarntoken", [
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
  ]);

  return { yarnToken };
});
