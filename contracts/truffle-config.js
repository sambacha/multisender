require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    ganui: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: 3,       // eslint-disable-line camelcase
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets )
      networkCheckTimeout: 100000, // to fix timeout errors
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`),
      gas: 5000000,
      gasPrice: 5e9,

      network_id: 1,       // eslint-disable-line camelcase
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets )
      // networkCheckTimeout: 100000, // to fix timeout errors
    },
  },

  compilers: {
    solc: {
      version: '0.4.23'
    }
  }
};
