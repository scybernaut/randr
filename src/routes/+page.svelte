<script>
  import Tools from "$lib/Tools.svelte";
  import { twMerge } from "tailwind-merge";
  import { PAGE_PADDING } from "$lib/utils.js";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { Search } from "@steeze-ui/material-design-icons";

  let query = "";
</script>

<div class={PAGE_PADDING}>
  <div class="mb-6 mt-4 bg-green-200/0">
    <h1 class="mb-1.5 text-3xl font-bold">Random generators</h1>
    <h2 class="text italic">Chaos is within your reach</h2>
  </div>
  <div class="relative mb-4 w-full items-center">
    <Icon
      src={Search}
      class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 select-none fill-current text-gray-400"
      aria-hidden="true"
    />
    <input
      class={twMerge(
        "w-full rounded border bg-white px-3 py-2 pl-10 shadow-sm placeholder:text-gray-400",
        "dark:border-transparent dark:bg-gray-800",
        "outline-none ring-primary-500 ring-opacity-50 focus-visible:border-primary-500 focus-visible:ring-2"
      )}
      type="text"
      name="search"
      id="search"
      placeholder="Search"
      bind:value={query}
      aria-label="Search"
    />
  </div>
  <Tools class="text-lg" {query} />
</div>
