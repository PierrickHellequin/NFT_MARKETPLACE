require("@nomiclabs/hardhat-waffle");
/* require("hardhat-gas-reporter"); */

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  settings: {
    optimizer: {
      enabled: false
    }
  }
};
