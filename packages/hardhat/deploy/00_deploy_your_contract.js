// deploy/00_deploy_your_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // admin addresses
  // Replace with your address.
  const admins = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ];

  await deploy("BuidlBadges", {
    from: deployer,
    args: [admins],
    log: true,
  });
};

module.exports.tags = ["BuidlBadges"];
