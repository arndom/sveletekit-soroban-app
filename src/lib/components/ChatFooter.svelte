<script lang="ts">
  import { registeredContract } from "$lib/store/contract";
  import { sorobanStore } from "$lib/store/soroban";
  import { nativeToScVal } from "@stellar/stellar-sdk";
  import ChatAvatar from "./ChatAvatar.svelte";
  import { lastMessage } from "$lib/store/message";
  import { getShortAddress } from "$lib/utils";

  $: ({ address } = $sorobanStore);

  let isSending = false;
  let message = "";
  $: shortAddress = getShortAddress(address)

  const handleSend = async () => {
    isSending = true;

    try {
      const result = await $registeredContract?.invoke({
        method: "set_title",
        args: [nativeToScVal(message, { type: "string" })],
        signAndSend: true,
      });

      console.log("🚀 « result:", result);
      alert("New message published");

      lastMessage.set(message)
      message = "";
    } catch (e) {
      console.error(e);
      alert("Error while sending tx. Try again…");
    } finally {
      isSending = false;
    }
  }
</script>

<div class="bg-black absolute bottom-0 left-0 px-4 w-full rounded-b-lg">
  <div class="flex items-center gap-1 my-4">
    <div class="h-[40px]">
      <ChatAvatar username={shortAddress} />
    </div>

    <input type="text" placeholder="Type message here..." class="input w-full rounded-3xl" bind:value={message} />

    <button class="btn btn-primary rounded-3xl" disabled={!address || isSending} on:click={handleSend}>
      { !isSending ? "Send" : "Sending..."  }
    </button>
  </div>
</div>
