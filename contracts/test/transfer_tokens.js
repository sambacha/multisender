const UpgradebleStormSender = artifacts.require("UpgradebleStormSender");

const toWei = (i) => web3.utils.toWei(new web3.utils.BN(i), 'ether');
const fromWei = (i) => web3.utils.fromWei(new web3.utils.BN(i), 'ether');

contract("UpgradebleStormSender", accounts => {
    before(async () => {
        // initialize contract
        const contract = await UpgradebleStormSender.deployed();
        const CONTRACT_OWNER = accounts[0];
        await contract.initialize(CONTRACT_OWNER);
    });

    it("should send ether to multiple accounts", async () => {
        const contract = await UpgradebleStormSender.deployed();

        const recipients = [
            accounts[1],
            accounts[2],
            accounts[3],
            accounts[4],
            accounts[5],
            accounts[6],
            accounts[7],
            accounts[8],
            accounts[9],
        ];
        const balances = [
            toWei('1'),
            toWei('2'),
            toWei('3'),
            toWei('4'),
            toWei('5'),
            toWei('6'),
            toWei('7'),
            toWei('8'),
            toWei('9'),
        ];

        const SENDER = accounts[0];
        const INITIAL_BALANCE = toWei('100');
        const SEND_VALUE = toWei('80');
        const transaction = await contract.multisendEther(recipients, balances, { value: SEND_VALUE, from: SENDER });

        // const balance = await web3.eth.getBalance(SENDER);
        // assert.equal(balance, INITIAL_BALANCE - SEND_VALUE);

        // check recipient balances
        for (let i = 0; i < recipients.length; i++) {
            const balance = await web3.eth.getBalance(recipients[i]);
            assert.equal(balance, INITIAL_BALANCE.add(balances[i]));
        }
    });

    it('should send 1INCH tokens to multiple accounts', async () => {
        // For running this test you need to unlock token owner's account in ganache-cli, using --unlock parameter

        const contract = await UpgradebleStormSender.deployed();
        const tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302";
        const tokenABI = [{ "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
        const token = await new web3.eth.Contract(tokenABI, tokenAddress);

        const SENDER = accounts[0];
        const SENDED_VALUE = 100000000;

        // const owner = await token.methods.owner().call()
        const owner = '0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1'

        // mint tokens for transaction
        await token.methods.mint(SENDER, SENDED_VALUE).send({from: owner});

        // check token balance on sender account
        assert.equal(await token.methods.balanceOf(SENDER).call(), SENDED_VALUE)

        // approve spending sender's tokens for contract
        token.methods.approve(contract.address, SENDED_VALUE).send({ from: SENDER });

        // test transfer
        let recipients = [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];
        let balances = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        await contract.multisendToken(tokenAddress, recipients, balances, {from: SENDER});

        // check recipient balances
        for (let i = 0; i < recipients.length; i++) {
            const balance = await token.methods.balanceOf(recipients[i]).call()
            assert.equal(balance, balances[i]);
        }
    });
});
