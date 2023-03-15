<script>
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";

  import { sleep, PAGE_PADDING, loadConfig } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { quartOut } from "svelte/easing";
  import { twMerge } from "tailwind-merge";

  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  const placeholder = "Liam\nOlivia\nNoah\nEmma";

  const config = writable({
    inputText: placeholder
  });

  onMount(() => {
    if (typeof window === "undefined") return;

    loadConfig(window.localStorage, "list", config);

    generate();
  });

  let delim = "\n";
  let items = [];

  let waitTime = 125;

  let timesUpdated = 0;

  $: items = $config.inputText.split(delim).filter((s) => s && !s.match(/^\s+$/));
  $: isInvalid = items.length === 0;

  let picked = "Noah";

  const MIN_PRE_UPDATES = 10;
  const MAX_PRE_UPDATES = 20;

  let flashing = false;

  const generate = async () => {
    let pickedIndex = Math.floor(Math.random() * items.length);
    let preUpdateCount =
      Math.floor(Math.random() * (MAX_PRE_UPDATES - MIN_PRE_UPDATES + 1)) + MIN_PRE_UPDATES;

    let updateCount = preUpdateCount + (pickedIndex - (preUpdateCount % items.length) + 1);

    for (let i = 0; i < updateCount; i++) {
      picked = items[i % items.length];
      timesUpdated++;
      await sleep(waitTime);
    }

    await sleep(200); // wait *before* flashing

    flashing = true;
    await sleep(150);
    flashing = false;
  };
</script>

<div
  class={twMerge(
    "mx-auto my-1 flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row-reverse",
    PAGE_PADDING
  )}
>
  <div
    class={twMerge(
      "relative h-72 w-full items-center justify-center gap-2 rounded-xl border bg-white p-6 shadow-md sm:w-72",
      "dark:border-0 dark:bg-gray-800 dark:shadow-2xl"
    )}
  >
    {#key timesUpdated}
      <span
        class={twMerge(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "text-3xl font-medium transition-all duration-150 ease-out",
          flashing && "scale-125 text-primary-600 dark:text-primary-400"
        )}
        in:fly={{ y: -40, duration: waitTime, easing: quartOut }}
        out:fly={{ y: 40, duration: waitTime, easing: quartOut }}
      >
        {picked}
      </span>
    {/key}
  </div>
  <div class="flex-grow">
    <div class="mb-4">
      <h2 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Minimal
      </h2>
      <h1 class="text-3xl font-bold">Random picker</h1>
    </div>
    <label class="mb-2 block">
      <p class="mb-1 block font-medium">Items</p>
      <textarea
        cols="30"
        rows="8"
        {placeholder}
        class={twMerge(
          "w-full rounded border bg-white px-3 py-2 leading-relaxed shadow-sm",
          "outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50",
          "placeholder:text-gray-300 dark:placeholder:text-gray-500",
          "dark:border-transparent dark:bg-gray-800 dark:shadow focus-visible:dark:border-primary-500"
        )}
        bind:value={$config.inputText}
      />
    </label>
    <Button on:click={generate} class="w-full sm:w-max" disabled={isInvalid}>Generate</Button>
  </div>
</div>
<div class={twMerge("mt-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">More generators</h1>
  <Tools exclude="list" />
</div>
