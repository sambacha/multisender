const UpgradebleStormSender = artifacts.require("UpgradebleStormSender");

module.exports = async function (deployer, network, accounts) {
    deployer.deploy(UpgradebleStormSender).then((instance) => {
        instance.initialize(accounts[0]);
    });
};
