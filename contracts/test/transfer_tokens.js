const UpgradebleStormSender = artifacts.require("UpgradebleStormSender");

const toWei = (i) => web3.utils.toWei(new web3.utils.BN(i), 'ether');
const fromWei = (i) => web3.utils.fromWei(new web3.utils.BN(i), 'ether');

contract("UpgradebleStormSender", accounts => {
    it("should send ether to multiple accounts", async () => {
        let instance = await UpgradebleStormSender.deployed();
        await instance.initialize(accounts[0]);

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
        ]
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
        ]
        const INITIAL_BALANCE = toWei('100');
        const send_value = toWei('80');
        console.log('Sending ether to multiple recipients...');
        const transaction = await instance.multisendEther(recipients, balances, {value: send_value, from: accounts[0]});

        // const balance = await web3.eth.getBalance(accounts[0]);
        // assert.equal(balance, INITIAL_BALANCE - send_value);

        for (let i = 0; i < recipients.length; i++) {
            console.log(`Checking ${i} account...`);
            const balance = await web3.eth.getBalance(recipients[i]);
            assert.equal(balance, INITIAL_BALANCE.add(balances[i]));
        }
    });
});
