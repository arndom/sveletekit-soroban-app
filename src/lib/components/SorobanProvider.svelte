<script lang="ts">
  import { fromURLToHorizonServer, fromURLToServer, networkToActiveChain } from "$lib/soroban-core/utils";
  import * as StellarSdk from '@stellar/stellar-sdk'
  import type { Connector, WalletChain } from "@soroban-react/types";
  import { sorobanStore } from "$lib/store/soroban";
  import {  afterUpdate, onDestroy, onMount } from "svelte";

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

              // $sorobanStore.activeChain = activeChain
              // $sorobanStore.address = address
              // $sorobanStore.server = newServer
              // $sorobanStore.serverHorizon = newServerHorizion

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

              // $sorobanStore.address = address

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

  console.log(
    'SorobanProvider: Active connector is ',
    activeConnector?.name
  );

  // type shoud be NodeJS.Timeout but its suprisignly unavailable
  let addressChangeIntervalID: any = null;
  let networkChangeIntervalID: any = null;

  /**
   * Checks for address change in soroban store on every update change
  */
  afterUpdate(() => {
    // If it turns out that requesting an update from Freighter is too taxing,
    // then this could be increased. Humans perceive 100ms response times as instantaneous
    // (source: https://www.pubnub.com/blog/how-fast-is-realtime-human-perception-and-technology/)
    // but you also have to consider the re-render time of components.
    const freighterCheckIntervalMs = 200

    async function checkForAddressChanges() {
      // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
      if (
        !$sorobanStore.activeConnector ||
        !$sorobanStore.activeConnector.isConnected() ||
        !isConnectedRef ||
        !$sorobanStore.activeChain
      )
        return
      // For now we can only do this with freighter. xBull doesn't handle the repeated call well.
      else if ($sorobanStore.activeConnector.id !== 'freighter') {
        return
      } else {
        let hasNoticedWalletUpdate = false

        try {
          // NOTICE: If the user logs out from or uninstalls the Freighter extension while they are connected
          // on this site, then a dialog will appear asking them to sign in again. We need a way to ask Freighter
          // if there is _any_ connected user, without actually asking them to sign in. Unfortunately, that is not
          // supported at this time; but it would be easy to submit a PR to the extension to add support for it.
          let address = await $sorobanStore.activeConnector?.getPublicKey()

          // TODO: If you want to know when the user has disconnected, then you can set a timeout for getPublicKey.
          // If it doesn't return in X milliseconds, you can be pretty confident that they aren't connected anymore.

          if ($sorobanStore.address !== address) {
            console.log(
              'SorobanProvider: address changed from:',
              $sorobanStore.address,
              ' to: ',
              address
            )
            hasNoticedWalletUpdate = true

            console.log('SorobanProvider: reconnecting')

            sorobanStore.update((prev) => ({
              ...prev,
              address,
            }));
          }
        } catch (error) {
          // I would recommend keeping the try/catch so that any exceptions in this async function
          // will get handled. Otherwise React could complain. I believe that eventually it may cause huge
          // problems, but that might be a NodeJS specific approach to exceptions not handled in promises.

          console.error('SorobanProvider: error: ', error)
        } finally {
          if (!hasNoticedWalletUpdate)
            addressChangeIntervalID = setTimeout(
              checkForAddressChanges,
              freighterCheckIntervalMs
            )
        }
      }
    }

    checkForAddressChanges();
  });

  /**
   * Checks for network change in soroban store on every update change
  */
  afterUpdate(() => {
    const freighterCheckIntervalMs = 200

    async function checkForNetworkChanges() {
      // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
      if (
        !$sorobanStore.activeConnector ||
        !$sorobanStore.activeConnector.isConnected() ||
        !isConnectedRef ||
        !$sorobanStore.activeChain
      )
        return
      // For now we can only do this with freighter. xBull doesn't have the getNetworkDetails method exposed.
      else if ($sorobanStore.activeConnector.id !== 'freighter') {
        return
      } else {
        let hasNoticedWalletUpdate = false

        try {
          let networkDetails =
            await $sorobanStore.activeConnector.getNetworkDetails()

          //TODO: TEMP FIX while waiting for freighter to fix soroban public rpc https://github.com/stellar/freighter/issues/1335
          if (networkDetails.sorobanRpcUrl === "http://soroban-rpc-pubnet-prd.soroban-rpc-pubnet-prd.svc.cluster.local:8000") {
            networkDetails.sorobanRpcUrl = "https://mainnet.stellar.validationcloud.io/v1/XFb5Lma6smizBnnRPEgYMbuNm0K3FWzJ7854GNSQ2EY"
          }
          let newActiveChain = networkToActiveChain(networkDetails, chains)

          // We check that we have a valid network details and not a blank one like the one xbull connector would return
          if (
            networkDetails.network &&
            (newActiveChain.networkPassphrase !==
              $sorobanStore.activeChain.networkPassphrase ||
              newActiveChain?.sorobanRpcUrl !==
              $sorobanStore?.activeChain?.sorobanRpcUrl)
          ) {
            console.log(
              'SorobanProvider: network changed from:',
              $sorobanStore.activeChain.networkPassphrase,
              ' to: ',
              newActiveChain.networkPassphrase
            )
            hasNoticedWalletUpdate = true

            $sorobanStore.setActiveChain &&
              $sorobanStore.setActiveChain(newActiveChain)
          }
        } catch (error) {
          console.error('SorobanProvider: error: ', error)
        } finally {
          if (!hasNoticedWalletUpdate)
            networkChangeIntervalID = setTimeout(
              checkForNetworkChanges,
              freighterCheckIntervalMs
            )
        }
      }
    }

    checkForNetworkChanges();
  });

  onDestroy(() => {
    if (addressChangeIntervalID != null) clearTimeout(addressChangeIntervalID)
    if (networkChangeIntervalID != null) clearTimeout(addressChangeIntervalID)
  })
</script>

<slot />
