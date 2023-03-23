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
  let pickedIndex = 2;

  const MIN_PRE_UPDATES = 10;
  const MAX_PRE_UPDATES = 20;

  let flashing = false;

  const minimizeDelta = (delta, length) => {
    const alternates = [delta - length, delta, delta + length];
    const distances = alternates.map(Math.abs);

    const minDist = Math.min(...distances);
    console.log("minimizeDelta", alternates, distances, minDist);
    return alternates[distances.lastIndexOf(minDist)];
  };

  let isGenerating = false;
  const generate = async () => {
    if (isGenerating) return;
    isGenerating = true;

    let index = Math.floor(Math.random() * items.length);
    let presentationUpdateCount =
      Math.floor(Math.random() * (MAX_PRE_UPDATES - MIN_PRE_UPDATES + 1)) + MIN_PRE_UPDATES;
    let presentationEndIndex = (pickedIndex + presentationUpdateCount) % items.length;
    let delta = index - presentationEndIndex;

    let updateCount = presentationUpdateCount + minimizeDelta(delta, items.length);

    for (let i = 1; i <= updateCount; i++) {
      picked = items[(pickedIndex + i) % items.length];
      timesUpdated++;
      await sleep(waitTime);
    }
    pickedIndex = index;

    await sleep(200); // wait *before* flashing
    isGenerating = false;

    flashing = true;
    await sleep(150);
    flashing = false;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const shuffle = () => {
    shuffleArray(items);
    $config.inputText = items.join("\n");

    pickedIndex = items.indexOf(picked);

    console.log(pickedIndex, items);
  };
</script>

<div class={twMerge("mb-4", PAGE_PADDING)}>
  <h2 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
    Minimal
  </h2>
  <h1 class="text-3xl font-bold">Random picker</h1>
</div>
<div
  class={twMerge(
    "mx-auto my-1 flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row",
    PAGE_PADDING
  )}
>
  <div class="mt-1">
    <div
      class={twMerge(
        "relative h-52 w-full items-center justify-center gap-2 rounded-xl border bg-white p-6 shadow sm:h-72 sm:w-72",
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
    <Button on:click={generate} class="mt-4 w-full" disabled={isInvalid || isGenerating}>
      Generate
    </Button>
  </div>
  <div class="flex-grow">
    <label class="mb-2 block">
      <p class="mb-1 block font-medium">Items</p>
      <div class="relative">
        <textarea
          cols="30"
          rows="8"
          {placeholder}
          class={twMerge(
            "block w-full rounded border bg-white px-3 py-2 leading-relaxed shadow-sm",
            "outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50",
            "placeholder:text-gray-300 dark:placeholder:text-gray-500",
            "dark:border-transparent dark:bg-gray-800 dark:shadow focus-visible:dark:border-primary-500"
          )}
          bind:value={$config.inputText}
        />
        <Button
          on:click={shuffle}
          colored={false}
          class="absolute bottom-3 right-3 p-2 shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:active:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </label>
  </div>
</div>
<div class={twMerge("mt-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">More generators</h1>
  <Tools exclude="list" />
</div>
