<script lang="ts">
  import ChatAvatar from "./ChatAvatar.svelte";

  export let username;
  export let lastMessage

</script>

<ChatAvatar {username}  />
<div class="chat-bubble">{lastMessage}</div>

