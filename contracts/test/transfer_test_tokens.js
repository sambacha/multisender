const UpgradebleStormSender = artifacts.require("UpgradebleStormSender");
const inchTestsToken = artifacts.require("inchTestsToken");

const toWei = (i) => web3.utils.toWei(new web3.utils.BN(i), 'ether');
const fromWei = (i) => web3.utils.fromWei(new web3.utils.BN(i), 'ether');

contract("UpgradebleStormSender", accounts => {
    it('should send test 1INCH tokens to multiple accounts', async () => {
        const contract = await UpgradebleStormSender.deployed();
        const token = await inchTestsToken.deployed();
        const balances = {
            '0xf2D8337F7D1E8Fa9b913068B52B72Cd31D84733A': 12,
            '0xcA57AD1bf8DC6e936d43a19B6b3A3D66C3F7f643': 12,
            '0x00c4a45642FDaaB18c462E70aD329A204e8bD0D8': 12,
            '0x103041Af1784a9d2c2a84137067244D2f1743438': 12,
            '0x8CFAb48f1B6328eEAF6abaFa5Ba780550bC5109D': 12,
            '0xBB27a235D1B2aF91BB5235396E2487A42C1357B0': 12,
            '0xc309151865A7493dD51F611b27D7D5B0323B240E': 12,
        }
        const SENDER = accounts[0];
        const SENDED_VALUE = 1000000;

        // approve spending sender's tokens for contract
        await token.approve(contract.address, SENDED_VALUE, {from: SENDER});

        await contract.multisendToken(token.address, Object.keys(balances), Object.values(balances), {from: SENDER});

        // check recipient balances
        for (const [recipient, balance] of Object.entries(balances)) {
            const realBalance = await token.balanceOf(recipient)
            assert.equal(balance, realBalance);
        }
    });
});
