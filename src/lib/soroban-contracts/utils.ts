import type { ContractDeploymentInfo } from "@soroban-react/types"

/**
 * Returns the deployment information for the given contract ID and network passphrase.
 * @param deployments - The array of contract deployment information.
 * @param contractId - The ID of the contract.
 * @param networkPassphrase - The network passphrase.
 * @returns The deployment information for the contract.
 * @throws If the deployment is not found.
 */
export const getDeployment = (
  deployments: ContractDeploymentInfo[],
  contractId: string,
  networkPassphrase: string
) => {
  let deployment = deployments.find(deployment => {
    return (
      deployment.contractId.toLowerCase() === contractId.toLowerCase() &&
      deployment.networkPassphrase.toLowerCase() ===
        (networkPassphrase || '').toLowerCase()
    )
  })

  return deployment
}