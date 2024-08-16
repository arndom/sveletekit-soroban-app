<script lang="ts">
  import { sorobanStore } from "$lib/store/soroban";
  import { afterUpdate } from "svelte";

  $: ({ activeChain, setActiveChain, chains } = $sorobanStore);

  $: supportedChains = chains;
  $: selected = activeChain?.name;

  afterUpdate(() => {
    const chain = supportedChains.find((chain) => chain.name === selected);

    if (chain && activeChain?.name !== chain.name) {
      setActiveChain && setActiveChain(chain);
      alert(`Active chain changed to ${chain.name}`);
    }
  });
</script>

<select class="select select-primary" bind:value={selected}>
	{#each supportedChains as chain (chain.name)}
    <option value={chain.name}>{chain.name}</option>
	{/each}
</select>
