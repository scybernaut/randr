<script>
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";
  import { sleep, PAGE_PADDING } from "$lib/utils";
  import NumberInput from "$lib/NumberInput.svelte";
  import { twMerge } from "tailwind-merge";

  let start = 1;
  let end = 10;

  let warnStartGtEnd = false;
  $: warnStartGtEnd = start > end;

  let GENERATE_COUNT = 10;

  let random = "";
  let textSize = "text-8xl";

  let invalidStart = false;
  let invalidEnd = false;

  const generate = async () => {
    const [min, max] = start > end ? [end, start] : [start, end];

    if (max > 9999999) textSize = "text-4xl";
    else if (max > 9999) textSize = "text-6xl";
    else textSize = "text-8xl";

    for (let i = 0; i < GENERATE_COUNT; i++) {
      random = (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString("en-US");
      await sleep(20);
    }
  };
  generate();
</script>

<div
  class={twMerge(
    "mx-auto flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row-reverse",
    PAGE_PADDING
  )}
>
  <div
    class={twMerge(
      "flex h-72 w-full min-w-68 items-center justify-center rounded-xl border bg-white p-8 shadow-md sm:w-72",
      "dark:border-0 dark:bg-gray-800 dark:shadow-2xl"
    )}
  >
    <span class="text-center font-medium tabular-nums {textSize}">
      {random}
    </span>
  </div>
  <div class="flex-grow">
    <h1 class="mb-6 text-3xl font-bold">Random number</h1>
    <div class="mb-4 flex w-full flex-wrap justify-start gap-4">
      <NumberInput
        class="w-36 grow sm:grow-0"
        label="From"
        bind:intValue={start}
        bind:isInvalid={invalidStart}
        warning={warnStartGtEnd}
        initial="0"
      />
      <NumberInput
        class="w-36 grow sm:grow-0"
        label="To"
        bind:intValue={end}
        bind:isInvalid={invalidEnd}
        warning={warnStartGtEnd}
        initial="10"
      />
    </div>
    <Button on:click={generate} class="w-full sm:w-max" disabled={invalidStart || invalidEnd}
      >Generate</Button
    >
  </div>
</div>
<div class={twMerge("mt-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">See also</h1>
  <Tools exclude="number" />
</div>
