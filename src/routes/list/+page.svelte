<script>
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";

  import { sleep } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { quartOut } from "svelte/easing";
  import clsx from "clsx";

  const placeholder = "Liam\nOlivia\nNoah\nEmma";

  let inputText = placeholder;

  let delim = "\n";
  let items = [];

  let waitTime = 125;

  let timesUpdated = 0;

  $: items = inputText.split(delim).filter((s) => s && !s.match(/^\s+$/));
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
    // console.log(
    //   preUpdateCount,
    //   updateCount,
    //   pickedIndex,
    //   items[(updateCount - 1) % items.length],
    //   items[pickedIndex]
    // );

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

<div class="mx-auto my-1 flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row-reverse">
  <div
    class={clsx(
      "relative h-72 w-full items-center justify-center gap-2 rounded-xl border bg-white p-6 shadow-md sm:w-72",
      "dark:border-0 dark:bg-gray-800 dark:shadow-lg"
    )}
  >
    {#key timesUpdated}
      <span
        class={clsx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "text-3xl font-medium transition-all duration-100 ease-in-out",
          flashing && "scale-105 text-primary-600 dark:text-primary-400"
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
        class={clsx(
          "w-full rounded border bg-white py-2 px-3 leading-relaxed shadow-sm dark:border-gray-700 dark:bg-transparent",
          "outline-none ring-primary-500 ring-opacity-50 focus-visible:border-primary-500 focus-visible:ring-2"
        )}
        bind:value={inputText}
      />
    </label>
    <Button on:click={generate} class="w-full sm:w-max" disabled={isInvalid}>Generate</Button>
    <!-- <button
      class="mt-4 w-full rounded bg-primary-600 px-4 py-3 text-lg text-white shadow-md outline-none transition-colors duration-100 hover:bg-primary-700 focus:ring-2 active:bg-primary-600"
      on:click={generate}
    >
      Generate
    </button> -->
  </div>
</div>
<div class="mt-8">
  <h1 class="mb-4 text-xl font-bold">See also</h1>
  <Tools exclude="list" />
</div>
