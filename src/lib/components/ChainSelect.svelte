<select class="select select-primary" bind:value={selected}>
	{#each supportedChains as chain (chain.name)}
    <option value={chain.name}>{chain.name}</option>
	{/each}
</select>

<script lang="ts">
  let selected = "Testnet";
  const supportedChains = [{
    name: "Tesnet"
  }];
</script>