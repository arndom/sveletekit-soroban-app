<script lang="ts">
  import { fromURLToHorizonServer, fromURLToServer, networkToActiveChain } from "$lib/soroban-core/utils";
  import * as StellarSdk from '@stellar/stellar-sdk'
  import type { Connector, WalletChain } from "@soroban-react/types";
  import { sorobanStore } from "$lib/store/soroban";
  import {  onMount } from "svelte";

  let isConnectedRef = false;

  $: ({ chains, server, serverHorizon, activeConnector } = $sorobanStore);

  onMount(() => {
    sorobanStore.update((prev) => ({
        ...prev,

        connect: async () => {
          // console.log('ENTERING CONNECT with context: ', mySorobanContext)

          if (activeConnector) {
            // Now we will check if the wallet is freighter so that we keep the old way of choosing the network from the wallet for backward compatibility
            if (activeConnector.id === 'freighter') {
              let networkDetails =
                await activeConnector.getNetworkDetails()

              //TODO: TEMP FIX while waiting for freighter to fix soroban public rpc https://github.com/stellar/freighter/issues/1335
              if (networkDetails.sorobanRpcUrl === "http://soroban-rpc-pubnet-prd.soroban-rpc-pubnet-prd.svc.cluster.local:8000") {
                networkDetails.sorobanRpcUrl = "https://mainnet.stellar.validationcloud.io/v1/XFb5Lma6smizBnnRPEgYMbuNm0K3FWzJ7854GNSQ2EY"
              }

              let activeChain = networkToActiveChain(networkDetails, chains)

              if (
                !chains.find(
                  (c: any) =>
                    c.networkPassphrase === networkDetails?.networkPassphrase
                )
              ) {
                const error = new Error(
                  'Your Wallet network is not supported in this app'
                )
                throw error
              }

              if (!networkDetails?.sorobanRpcUrl) {
                const error = new Error(
                  'Soroban RPC URL is not set, please check your freighter wallet network configuration'
                )
                throw error
              }

              let newServer = server;
              let newServerHorizion = serverHorizon;

              if (networkDetails) {
                newServer = new StellarSdk.SorobanRpc.Server(networkDetails.sorobanRpcUrl, {
                  allowHttp: networkDetails.sorobanRpcUrl.startsWith('http://'),
                })

                newServerHorizion = new StellarSdk.Horizon.Server(networkDetails.networkUrl, {
                  allowHttp: networkDetails.networkUrl.startsWith('http://'),
                })
              }

              console.log(
                'SorobanProvider: Connecting with FREIGHTER : ',
                activeConnector.name
              )

              let address = await activeConnector.getPublicKey()

              // Now we can track that the wallet is finally connected
              isConnectedRef = true

              // mySorobanContext.value.activeChain = activeChain
              // mySorobanContext.value.address = address
              // mySorobanContext.value.server = newServer
              // mySorobanContext.value.serverHorizon = newServerHorizion

              sorobanStore.update((prev) => ({
                ...prev,
                activeChain,
                address,
                server: newServer,
                serverHorizon: newServerHorizion
              }));
            }
            // If connector is any other wallet that does not have getNetworkDetails we will need to set the active chain and server from somewehere else in the front end
            else {
              console.log(
                'SorobanProvider: Connecting with ',
                activeConnector.name
              )

              let address = await activeConnector.getPublicKey()

              // Now we can track that the wallet is finally connected
              isConnectedRef = true

              // mySorobanContext.value.address = address

              sorobanStore.update((prev) => ({
                ...prev,
                address,
              }));
            }
          } else {
            console.log('SorobanProvider: No active Connector')
          }
        },

        disconnect: async () => {
          isConnectedRef = false

          // TODO: Maybe reset address to undefined
          // TODO: Handle other things here, such as perhaps resetting address to undefined.
          let address = undefined

          sorobanStore.update((prev) => ({
            ...prev,
            address,
          }));

          console.log("Disconnected")
        },

        setActiveChain: (chain: WalletChain) => {
          console.log('Chainging activeChain to : ', chain)

          // When the user in frontend changes the activeChain to read the blockchain without wallet
          let server: StellarSdk.SorobanRpc.Server | undefined = undefined,
            serverHorizon: StellarSdk.Horizon.Server | undefined = undefined
          const _activeChain = chain

          if (_activeChain.sorobanRpcUrl) {
            server = fromURLToServer(_activeChain.sorobanRpcUrl)
          }

          if (_activeChain.networkUrl) {
            serverHorizon = fromURLToHorizonServer(_activeChain.networkUrl)
          }

          console.log({
            server,
            serverHorizon,
            activeChain: _activeChain

          })

          sorobanStore.update((prev) => ({
            ...prev,
            server,
            serverHorizon,
            activeChain: _activeChain
          }));
        },

        setActiveConnectorAndConnect: async (connector: Connector) => {
          console.log('Changing connector to ', connector.name)
          let _activeConnector = connector

          console.log('SorobanProvider: Changing connector')

          // We better connect here otherwise in the frontend the context is not updated fast enough, and the user connects to the old connector first.
          let address = await _activeConnector.getPublicKey()

          isConnectedRef = true

          sorobanStore.update((prev) => ({
            ...prev,
            activeConnector: _activeConnector,
            address,
          }));
        }
    }))
  });

</script>

<slot />
