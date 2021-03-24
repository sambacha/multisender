const inchTestsToken = artifacts.require("inchTestsToken");

module.exports = function (deployer) {
    deployer.deploy(inchTestsToken);
};
