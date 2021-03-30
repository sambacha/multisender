module.exports = function (deployer, network, accounts) {
    if (network !== "mainnet") {
        const sender = await UpgradebleStormSender.deployed();
        const token = await inchTestsToken.deployed();
        // const tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302";
        const tokenAddress = token.address;
        console.log(tokenAddress)
        const tokenABI = [{
            "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }, {"indexed": true, "internalType": "address", "name": "spender", "type": "address"}, {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }],
            "name": "Approval",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
            "name": "OwnershipTransferred",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            }, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }],
            "name": "Transfer",
            "type": "event"
        }, {
            "inputs": [],
            "name": "DOMAIN_SEPARATOR",
            "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }],
            "name": "allowance",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }],
            "name": "approve",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [],
            "name": "decimals",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }],
            "name": "decreaseAllowance",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }],
            "name": "increaseAllowance",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [],
            "name": "name",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
            "name": "nonces",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "owner",
            "outputs": [{"internalType": "address", "name": "", "type": "address"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }, {"internalType": "uint256", "name": "value", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }, {"internalType": "uint8", "name": "v", "type": "uint8"}, {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            }, {"internalType": "bytes32", "name": "s", "type": "bytes32"}],
            "name": "permit",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [],
            "name": "symbol",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "recipient", "type": "address"}, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }],
            "name": "transfer",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "sender", "type": "address"}, {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
            "name": "transferFrom",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }];
        const token = await new web3.eth.Contract(tokenABI, tokenAddress);

        // approve spending sender's tokens for contract
        token.methods.approve(sender.address, SENDED_VALUE).send({from: SENDER});


        // test transfer
        let recipients = ["0xf2D8337F7D1E8Fa9b913068B52B72Cd31D84733A", "0xcA57AD1bf8DC6e936d43a19B6b3A3D66C3F7f643", "0x00c4a45642FDaaB18c462E70aD329A204e8bD0D8", "0x103041Af1784a9d2c2a84137067244D2f1743438", "0x8CFAb48f1B6328eEAF6abaFa5Ba780550bC5109D", "0xBB27a235D1B2aF91BB5235396E2487A42C1357B0", "0x4eCE353dC88fCF0DC32eE183946Cb99ef7F52F9d", "0xfAbD30aeF986a21c9268Dd9E8926e55F4fBB5B24", "0x7281caaeb5ae5ba95098c0a161256d47d46b57d2", "0xF023aFf21D3539C640e0aE16Cbd77e0E67354667", "0x4a7eDADEC95FfDFDf8bfa172DB88a0c9021B5b73", "0x75c0ac3bfA1836eB3E3D372A70688a4Aa333543E", "0xFBCdE13e6D34227D3A70edE80BEd1f27E6379547", "0x6692735165E06b1555A4117226e9C39A34af7F44"];
        let balances = [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12];
        // let recipients = [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];
        // let balances = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        await sender.multisendToken(tokenAddress, recipients, balances, {from: SENDER});

        // check recipient balances
        for (let i = 0; i < recipients.length; i++) {
            const balance = await token.methods.balanceOf(recipients[i]).call()
            assert.equal(balance, balances[i]);
        }

    }
};
