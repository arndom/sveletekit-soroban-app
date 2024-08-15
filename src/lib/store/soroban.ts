import { defaultSorobanContext } from "$lib/soroban-core/defaults";
import type {
  SorobanContextType,
  SorobanProviderProps,
} from "$lib/soroban-core/types";
import {
  fromURLToHorizonServer,
  fromURLToServer,
} from "$lib/soroban-core/utils";
import { writable } from "svelte/store";

const getDefaults = () => {
  const props: SorobanProviderProps = {
    autoconnect: false,
    deployments: [],
    ...defaultSorobanContext,
  };

  const { appName, autoconnect, chains, activeChain, connectors, deployments } =
    props;
  let { server, serverHorizon } = props;

  const activeConnector =
    connectors.length && connectors.length > 1 ? connectors[1] : connectors[0];

  if (activeChain?.sorobanRpcUrl) {
    server = fromURLToServer(activeChain.sorobanRpcUrl);
  }

  if (activeChain?.networkUrl) {
    serverHorizon = fromURLToHorizonServer(activeChain.networkUrl);
  }

  const values = {
    ...defaultSorobanContext,
    deployments,
    appName,
    autoconnect,
    chains,
    connectors,
    activeConnector,
    activeChain,
    server,
    serverHorizon,
  };

  return values;
}


export const sorobanStore = writable<SorobanContextType>(getDefaults())
