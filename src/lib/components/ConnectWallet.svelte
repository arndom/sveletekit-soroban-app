<script lang="ts">
  import { sorobanStore } from "$lib/store/soroban";
  import { getShortAddress } from "$lib/utils";

  $: ({ address, setActiveConnectorAndConnect, connectors: browserWallets, disconnect  } = $sorobanStore);

  const handleConnect = () => {
    if (!setActiveConnectorAndConnect) return;
    setActiveConnectorAndConnect(browserWallets[0]);
  }

  const handleDisconnect = async () => {
    console.log("Disconnecting");
    await disconnect();
  }

  $: shortAddress = getShortAddress(address)
</script>

{#if Boolean(!address)}
  <div>
    <button class="btn btn-accent" on:click={handleConnect}>
      Connect Wallet
    </button>
    <p class="text-[0.6rem] text-center mt-1">Freighter only</p>
  </div>
{:else}
  <button class="bg-primary p-4 rounded-2xl text-black" on:click={handleDisconnect}>
    Account: <span class="font-bold">{shortAddress}</span>
  </button>
{/if}
