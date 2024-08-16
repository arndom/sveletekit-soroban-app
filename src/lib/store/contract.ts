import { derived, writable } from "svelte/store";
import { sorobanStore } from "$lib/store/soroban";
import { getDeployment } from "$lib/soroban-contracts/utils";
import type { WrappedContract, WrappedContractInvokeArgs } from "$lib/soroban-contracts/types";
import { contractInvoke, type InvokeArgs } from "$lib/soroban-contracts/contract-invoke";

export const contractID = writable('');

export const registeredContract = derived([sorobanStore, contractID], ([$sorobanStore, $contractID]) => {
  if (!$contractID) return undefined;

  const { deployments, activeChain} = $sorobanStore
  const networkPassphrase = activeChain?.networkPassphrase || '';

  const deploymentInfo = getDeployment(
    deployments || [],
    $contractID,
    networkPassphrase
  );

  if (!deploymentInfo) return undefined;

  const wrappedInvokeFunction =  async (args: WrappedContractInvokeArgs) => {
    const contractInvokeArgs: InvokeArgs = {
      ...args,
      sorobanContext: $sorobanStore,
      contractAddress: deploymentInfo?.contractAddress,
    }

    return contractInvoke(contractInvokeArgs)
  }

  if (!deploymentInfo) return undefined;

  const newWrappedContract = {
    deploymentInfo,
    invoke: wrappedInvokeFunction
  }

  return newWrappedContract as WrappedContract;
})
