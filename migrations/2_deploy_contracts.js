var RentalAgreement = artifacts.require("RentalAgreement.sol");
module.exports = function (deployer, address) {
  deployer.deploy(
    RentalAgreement,
    address,
    web3.utils.toWei("1.5", "ether"),
    web3.utils.toWei("3.0", "ether"),
    10,
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
  );
};
