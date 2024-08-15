<div class="bg-primary absolute top-0 left-0 p-5 w-full text-center text-black rounded-t-lg">
  <p>
    Greeter -
    <a href={explorerLink} target="_blank" class="underline underline-offset-4">
      Explore Contract
    </a>
  </p>
</div>

<div class="h-[60px]"></div>

<script lang="ts">
  const contract = "";
  const getExplorerLink = () => {
  const baseURL = "https://stellar.expert/explorer/testnet/contract/";

  if (!contract) return baseURL;
  // const contractAddress = contract.deploymentInfo.contractAddress
  // const hasAddress = Boolean(contractAddress);

  // if (!hasAddress) return baseURL;

  // return baseURL + contractAddress;
  }

  const explorerLink = getExplorerLink()
</script>