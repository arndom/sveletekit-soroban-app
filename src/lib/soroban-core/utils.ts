import * as StellarSdk from '@stellar/stellar-sdk'

/**
 * Converts network details to an active chain object.
 * @param {any} networkDetails - Details of the network.
 * @param {any[]} chains - Array of supported chains.
 * @returns {WalletChain | undefined} - Active chain object or undefined if not found.
 */
export function networkToActiveChain(networkDetails: any, chains: any) {
  const supported =
    networkDetails &&
    chains.find(
      (c: any) => c.networkPassphrase === networkDetails?.networkPassphrase
    )
  const activeChain = networkDetails && {
    id: supported?.id ?? networkDetails.networkPassphrase,
    name: supported?.name ?? networkDetails.network,
    networkPassphrase: networkDetails.networkPassphrase,
    iconBackground: supported?.iconBackground,
    iconUrl: supported?.iconUrl,
    unsupported: !supported,
    networkUrl: networkDetails.networkUrl,
    sorobanRpcUrl: networkDetails.sorobanRpcUrl,
  }
  return activeChain
}

/**
 * Converts a Soroban RPC URL to a Soroban RPC server object.
 * @param {string} sorobanRpcUrl - Soroban RPC URL.
 * @returns {StellarSdk.SorobanRpc.Server} - Soroban RPC server object.
 */
export function fromURLToServer(
  sorobanRpcUrl: string
): StellarSdk.SorobanRpc.Server {
  return new StellarSdk.SorobanRpc.Server(sorobanRpcUrl, {
    allowHttp: sorobanRpcUrl.startsWith('http://'),
  })
}

/**
 * Converts a horizon network URL to a Horizon server object.
 * @param {string} networkUrl - Network URL.
 * @returns {StellarSdk.Horizon.Server} - Horizon server object.
 */
export function fromURLToHorizonServer(
  networkUrl: string
): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(networkUrl, {
    allowHttp: networkUrl.startsWith('http://'),
  })
}
