// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  //! prod GTC address
  /* let GTC = { address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F" };

  // deploy mock token contract ~ if not on mainnet
  if (chainId !== "1") {
    // deploy mock GTC
    GTC = await deploy("GTC", {
      from: deployer,
      //front-end address vvvvvvvvvvvvvvv replace with args: [admins[0]], for deploy
      args: ["0xb010ca9Be09C382A9f31b79493bb232bCC319f01"], 
      log: true,
    });
  }

  const GTC2 = await ethers.getContract("GTC"); */

  NFT = await deploy("BuidlBadges", {
    from: deployer,
                      //replace 2nd arg with your address or front-end address
    args: [['0xa4ca1b15fe81f57cb2d3f686c7b13309906cd37b','0xb010ca9Be09C382A9f31b79493bb232bCC319f01','0x34aA3F359A9D614239015126635CE7732c18fDF3']],
    log: true,
    });

    const BuidlBagde_1 = await ethers.getContract("BuidlBadges");

  // deploy Staking Contract ~ any network
  /* if (chainId !== "1") {
  await deploy("NewFloorPools", {
    from: deployer,
    args: [NFT.address, '360'],
    log: true,
  });
} else {
  await deploy("NewFloorPools", {
    from: deployer,
    args: ['0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F'],
    log: true,
  });
}} */


  // make sure were not on the local chain...
  /* if (chainId !== "31337") {
    // verigy the staking contract
    await run("etherscan-verify", {
      address: BuidlBagde_1.address,
      contract: "contracts/BuidlBagde_1.sol:BuidlBagde_1",
      constructorArguments: ['https://forgottenbots.mypinata.cloud/ipfs/QmZKUPeCSZSiz6MNVA6qDGb5yo9LDG3dQMVojK8HLbynu1'],
    });
  }
};  */}
module.exports.tags = ["BuidlBadges"];
