<div class="chat-image avatar">
  <div class="w-10 rounded-full">
    <img alt="Tailwind CSS chat bubble component" width="200px" height="200px"
      src={`https://robohash.org/${Boolean(username) ? username : defaultName}`} class="bg-neutral" />
  </div>
</div>

<script lang="ts">
  export let username = "";
  const defaultName = "anon";
</script>