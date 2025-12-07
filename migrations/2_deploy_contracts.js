var RentalAgreement = artifacts.require("RentalAgreement.sol");
module.exports = function (deployer, accounts, address) {
  deployer.deploy(
    RentalAgreement,
    accounts[0],
    accounts[1],
    address,
    ethers.utils.parseEther("1.5"),
    ethers.utils.parseEther("3.0"),
    10,
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
  );
};
