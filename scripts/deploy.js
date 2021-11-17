const hre = require("hardhat");

async function main() {

  const Certification = await hre.ethers.getContractFactory("Certification");
  const certification = await Certification.deploy();

  await certification.deployed();

  console.log("Certification deployed to:", certification.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
