// deploy/00_deploy_your_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get Admins from .env
  const admins = process.env.CONTRACT_ADMINS.split(",");

  await deploy("BuidlBadges", {
    from: deployer,
    args: [admins],
    log: true,
  });
};

module.exports.tags = ["BuidlBadges"];
