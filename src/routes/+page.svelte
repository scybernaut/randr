<script>
  import Tools from "$lib/Tools.svelte";
  import clsx from "clsx";
</script>

<div class="mb-6 mt-4 bg-green-200/0">
  <h1 class="mb-1 text-3xl font-bold">Random generators</h1>
  <h2 class="text italic">Chaos is within your reach</h2>
</div>
<div
  class={clsx(
    "mb-4 flex w-full items-center gap-2 rounded border bg-white px-3 py-2 shadow-sm",
    "ring-primary-500 ring-opacity-100 focus-within:ring-2",
    "dark:border-0 dark:bg-gray-800"
  )}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    class="h-5 w-5 -translate-y-[0.0625rem] select-none opacity-60"
    alt="search icon"
    aria-disabled="true"
  >
    <path
      fill-rule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clip-rule="evenodd"
    />
  </svg>
  <input
    class="w-full bg-transparent outline-none"
    type="text"
    name="search"
    id="search"
    placeholder="Search"
  />
</div>
<Tools class="text-lg" />
