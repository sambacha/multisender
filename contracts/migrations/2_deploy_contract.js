const UpgradebleStormSender = artifacts.require("UpgradebleStormSender");

module.exports = function (deployer) {
    deployer.deploy(UpgradebleStormSender);
};