{#if Boolean(!address)}
  <div>
    <button class="btn btn-accent" on:click={handleConnect}>
      Connect Wallet
    </button>
    <p class="text-[0.6rem] text-center mt-1">Freighter only</p>
  </div>
{:else}
  <button class="bg-primary p-4 rounded-2xl text-black" on:click={handleDisconnect}>
    Account: <span class="font-bold">Some address</span>
  </button>
{/if}


<script lang="ts">
  const address = "";

  const handleConnect = () => {};
  const handleDisconnect = () => {};
</script>