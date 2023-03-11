<script>
  import Tools from "$lib/tools.svelte";
</script>

<div class="mb-6 bg-green-200/0">
  <h2 class="">A collection of random tools.</h2>
</div>
<div
  class="mb-4 flex w-full items-center gap-2 rounded border px-3 py-2 shadow-sm ring-blue-500 ring-opacity-100 focus-within:ring-2"
>
  <img
    src="/magnifying-glass.svg"
    alt="search icon"
    class="h-5 -translate-y-[0.0625rem] select-none opacity-60"
    aria-disabled="true"
  />
  <input class="w-full outline-none" type="text" name="search" id="search" placeholder="Search" />
</div>
<Tools class="text-lg" />
