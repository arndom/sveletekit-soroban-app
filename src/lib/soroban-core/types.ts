import type { Connector, WalletChain, ContractDeploymentInfo } from '@soroban-react/types'

import * as StellarSdk from '@stellar/stellar-sdk'
import { SorobanRpc } from '@stellar/stellar-sdk'

/**
 * Interface for the Soroban context.
 */
export interface SorobanContextType {
  // Indicates whether autoconnect is enabled
  autoconnect?: boolean
  // Name of the Soroban application
  appName?: string
  // List of chains
  chains: WalletChain[]
  // List of connectors
  connectors: Connector[]
  // Active chain
  activeChain?: WalletChain
  // Connected wallet address
  address?: string
  // Active connector
  activeConnector?: Connector
  // Soroban RPC server
  server?: SorobanRpc.Server
  // Stellar Horizon server
  serverHorizon?: StellarSdk.Horizon.Server
  // Function to connect to a wallet
  connect: () => Promise<void>
  // Function to disconnect from a wallet
  disconnect: () => Promise<void>
  // Function to set the active chain
  setActiveChain?: (chain: WalletChain) => void
  // Function to set the active connector and connect
  setActiveConnectorAndConnect?: (connector: Connector) => void
  // List of contract deployments
  deployments?: ContractDeploymentInfo[]
}

/**
 * Props for the SorobanReactProvider component.
 */
export interface SorobanProviderProps {
  appName?: string
  autoconnect?: boolean
  chains: WalletChain[]
  activeChain?: WalletChain // To set on frontend to define the default chain for read-only. Example: standalone
  connectors: Connector[]
  server?: StellarSdk.SorobanRpc.Server // To set on frontend to define the default server url for read-only. Example 'new Server('http://localhost:8000/soroban/rpc',{allowHttp:true})'
  serverHorizon?: StellarSdk.Horizon.Server
  deployments?: ContractDeploymentInfo[]
}
