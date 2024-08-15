import * as StellarSdk from '@stellar/stellar-sdk'
import { SorobanRpc } from '@stellar/stellar-sdk'

/**
 * Default Soroban context object.
 */
export const defaultSorobanContext = {
  appName: undefined,
  chains: [],
  connectors: [],
  server: new SorobanRpc.Server('https://soroban-testnet.stellar.org/'),
  serverHorizon: new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org'),
  async connect() {},
  async disconnect() {},
}
