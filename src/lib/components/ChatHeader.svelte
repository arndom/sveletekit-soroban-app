<script lang="ts">
  import { registeredContract } from "$lib/store/contract";
  import { lastMessage } from "$lib/store/message";
  import { fetchLastMessage } from "$lib/utils";

  $: getExplorerLink = () => {
    const baseURL = "https://stellar.expert/explorer/testnet/contract/";

    if (!$registeredContract) return baseURL;
    const contractAddress = $registeredContract?.deploymentInfo.contractAddress
    const hasAddress = Boolean(contractAddress);

    if (!hasAddress) return baseURL;

    return baseURL + contractAddress;
  }

  $: explorerLink = getExplorerLink();

  $: if ($registeredContract) {
    const getLastmessage = async () => await fetchLastMessage($registeredContract).then(res => lastMessage.set(res));

    getLastmessage();
  }
</script>

<div class="bg-primary absolute top-0 left-0 p-5 w-full text-center text-black rounded-t-lg">
  <p>
    Greeter -
    <a href={explorerLink} target="_blank" class="underline underline-offset-4">
      Explore link
    </a>
  </p>
</div>

<div class="h-[60px]"></div>