const inchTestsToken = artifacts.require("inchTestsToken");

// module.exports = async function (deployer, network, accounts) {
module.exports = function (deployer, network, accounts) {
    if (network === "development") {
        deployer.deploy(inchTestsToken);
    }
};
