
<script lang="ts">
  import ChainSelect from "$lib/components/ChainSelect.svelte";
  import ChatBlock from "$lib/components/ChatBlock.svelte";
  import ChatFooter from "$lib/components/ChatFooter.svelte";
  import ChatHeader from "$lib/components/ChatHeader.svelte";
  import ConnectWallet from "$lib/components/ConnectWallet.svelte";
  import { testnet } from '@soroban-react/chains';
  import { freighter } from '@soroban-react/freighter';
  import type { ChainMetadata, Connector } from "@soroban-react/types";
  import deployments from "$lib/contract-deployments.json";
  import { sorobanStore } from "$lib/store/soroban";
  import {onMount } from "svelte"
  import SorobanProvider from "$lib/components/SorobanProvider.svelte";

  const chains: ChainMetadata[] = [testnet];
  const connectors: Connector[] = [freighter()];
  const appName = "Soroban Demo - Nuxt";

  const lastMsgUsername = "Anon";
  const lastMessage = "part 2";

  onMount(() => {
    sorobanStore.update((prev) => {
      return {
        ...prev,
        chains,
        appName,
        activeChain: testnet,
        connectors,
        deployments
      }
    })
  });
</script>

<svelte:head>
	<title>Soroban Demo - SvelteKit</title>
	<meta name="description" content="Soroban Demo - SvelteKit" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet"
  >
</svelte:head>

<main class="min-h-[100vh] flex flex-col items-center gap-4 justify-center">
  <SorobanProvider>
    <div class="flex gap-2 justify-center">
      <ChainSelect />
      <ConnectWallet />
    </div>

    <div class="relative w-80 md:w-1/2 max-w-lg">
      <ChatHeader />

      <div class="bg-black px-4 pb-4 max-h-[400px] min-h-[200px] overflow-y-auto chat-container rounded-b-lg">
        <div class="chat-block">
          <div class="chat chat-end">
            <div class="chat-header mb-1">Last msg sent via contract</div>
            <ChatBlock username={lastMsgUsername} {lastMessage} />
          </div>
        </div>

        <ChatFooter />
      </div>
    </div>
  </SorobanProvider>
</main>
