import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/dist/types';

import { FuelChainState__factory } from '../../typechain';

const PAUSER_ADDRESS = '0xe7d56c84cEA9b58569fdfe8863085207F9a14881';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre;
  const [deployer] = await ethers.getSigners();

  const { address } = await deployments.get('FuelChainState');

  const fuelChainState = FuelChainState__factory.connect(address, deployer);
  const PAUSER_ROLE = await fuelChainState.PAUSER_ROLE();

  await fuelChainState
    .grantRole(PAUSER_ROLE, PAUSER_ADDRESS)
    .then((tx) => tx.wait());

  console.log('Granted role PAUSER_ROLE to', PAUSER_ADDRESS);

  return true;
};

func.tags = ['register_watchtower'];
func.id = 'register_watchtower';
export default func;