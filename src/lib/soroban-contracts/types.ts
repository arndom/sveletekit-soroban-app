import type { ContractDeploymentInfo } from '@soroban-react/types'
import * as StellarSdk from '@stellar/stellar-sdk'
import { SorobanRpc } from '@stellar/stellar-sdk'

import type {
  Memo,
  MemoType,
  Operation,
  Transaction as StellarSdkTransaction,
} from '@stellar/stellar-sdk'

export type Transaction = StellarSdk.Transaction | StellarSdk.FeeBumpTransaction
export type Tx = StellarSdkTransaction<Memo<MemoType>, Operation[]>
export type TxResponse = SorobanRpc.Api.GetTransactionResponse & {
  txHash: string
}

export type Simulation = SorobanRpc.Api.SimulateTransactionResponse

/**
 * Represents the arguments for invoking methods on a wrapped contract. It needs less argument than invoking a contract that is not wrapped.
 */
export type WrappedContractInvokeArgs = {
  method: string
  args?: StellarSdk.xdr.ScVal[] | undefined
  signAndSend?: boolean
  fee?: number
  skipAddingFootprint?: boolean
  secretKey?: string
  reconnectAfterTx?: boolean
}

/**
 * Represents a wrapped contract object with deployment information and an custom invoke function.
 */
export type WrappedContract = {
  deploymentInfo: ContractDeploymentInfo
  invoke: (
    args: WrappedContractInvokeArgs
  ) => Promise<TxResponse | StellarSdk.xdr.ScVal>
}