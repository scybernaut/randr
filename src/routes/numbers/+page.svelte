<script>
  import NumberInput from "$lib/NumberInput.svelte";
  import Button from "$lib/UnifiedButton.svelte";
  import Tools from "$lib/Tools.svelte";
  import { twMerge } from "tailwind-merge";

  import { sleep, mapToRange, PAGE_PADDING } from "$lib/utils.js";
  import { persisted } from "svelte-local-storage-store";
  import { onMount } from "svelte";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { Check } from "@steeze-ui/material-design-icons";
  import RandomizerHeader from "$lib/RandomizerHeader.svelte";

  const INIT_START = 1,
    INIT_END = 10,
    INIT_COUNT = 8,
    INIT_UNIQUE = false;
  const MIN_GENERATE_COUNT = 10,
    MAX_GENERATE_COUNT = 30;

  let config = persisted("numbers", {
    start: INIT_START,
    end: INIT_END,
    count: INIT_COUNT,
    unique: INIT_UNIQUE
  });

  onMount(() => {
    if (typeof window === undefined) return;

    randomizeAll();
  });

  let warnStartGtEnd = false;
  $: warnStartGtEnd = fieldsInvalid.every((f) => !f) && $config.start > $config.end;

  let warnAmountGtRange = false;
  $: if ($config.unique) {
    const start = $config.start;
    const end = $config.end;

    const [min, max] = start > end ? [end, start] : [start, end];
    warnAmountGtRange = max - min + 1 < $config.count;
  }
  const fieldsInvalid = [false, false, false];

  const numbers = [];

  let gridCols = ["grid-cols-4", "sm:grid-cols-4"];
  let textSize = ["text-3xl", "sm:text-5xl"];
  let boxPadding = ["p-2", "sm:p-4"];

  const randomize = async (index, finalValue) => {
    const { start, end, count } = $config;

    const generateCount = mapToRange(index, 0, count - 1, MIN_GENERATE_COUNT, MAX_GENERATE_COUNT);

    const [min, max] = start > end ? [end, start] : [start, end];
    for (let i = 0; i < generateCount; i++) {
      numbers[index] = (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString("en-US");
      await sleep(20);
    }

    if (finalValue) numbers[index] = finalValue.toLocaleString("en-US");
  };

  const getMaxLength = (min, max) => {
    const minLength = Math.ceil(min).toString().length;
    const maxLength = Math.floor(max).toString().length;

    return Math.max(minLength, maxLength);
  };

  const adjustStyles = (maxLength, count) => {
    gridCols = ["grid-cols-4", "sm:grid-cols-4"];
    textSize = ["text-3xl", "sm:text-5xl"];
    boxPadding = ["p-5", "sm:p-10"];

    if (count > 8) {
      gridCols[1] = "sm:grid-cols-6";
      boxPadding[1] = "sm:p-8";
    }

    if (count <= 3) {
      boxPadding[0] = "p-8";
      textSize[0] = "text-4xl";

      gridCols[0] = "grid-cols-2";
      if (count == 3) gridCols[0] = "grid-cols-3";
    }

    let assumedLength = maxLength;
    if (assumedLength >= 3) {
      gridCols[0] = "grid-cols-3";
      textSize[1] = "sm:text-4xl";
      if (count > 8) gridCols[1] = "sm:grid-cols-4";
    }
    if (assumedLength >= 4) {
      gridCols = ["grid-cols-2", "sm:grid-cols-3"];
      textSize = ["text-2xl", "sm:text-3xl"];
      boxPadding = ["p-3", "sm:p-6"];
    }
    if (assumedLength >= 6) {
      gridCols[0] = "grid-cols-1";
    }
    if (assumedLength >= 7) {
      textSize[1] = "sm:text-2xl";
      gridCols[1] = "sm:grid-cols-2";
      boxPadding[1] = "sm:p-3";
    }
  };

  const randomizeAll = async () => {
    const { start, end, count, unique } = $config;

    const [min, max] = start > end ? [end, start] : [start, end];

    const maxLength = getMaxLength(min, max - 1);

    adjustStyles(maxLength, count);

    const randomizeCount = unique ? Math.min(count, max - min + 1) : count;

    const uniqueResults = new Set();
    if (unique) {
      while (uniqueResults.size < randomizeCount)
        uniqueResults.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    const uniqueIter = uniqueResults.values();

    if (randomizeCount < 0) return;
    for (let i = 0; i < randomizeCount; i++) {
      if (unique) randomize(i, uniqueIter.next().value);
      else randomize(i);
    }

    numbers.length = randomizeCount;
  };
</script>

<div class={twMerge("mb-4 sm:mb-6", PAGE_PADDING)}>
  <RandomizerHeader decorText="Numbers" headerText="Random numbers" />
</div>
<div class={twMerge("mb-4 grid w-full gap-2 sm:gap-3", ...gridCols, PAGE_PADDING)}>
  {#each numbers as number, i}
    <div
      class={twMerge(
        "relative flex items-center justify-center rounded-lg border bg-white shadow-md sm:rounded-xl",
        "dark:border-0 dark:bg-gray-800 dark:shadow-lg",
        boxPadding
      )}
    >
      <span
        class="absolute bottom-0.5 right-1 select-none text-xs text-gray-300 dark:text-gray-600 sm:bottom-1.5 sm:right-2.5 sm:text-sm"
      >
        {i + 1}
      </span>
      <span class={twMerge("text-center font-medium tabular-nums", ...textSize)}>
        {number}
      </span>
    </div>
  {/each}
</div>
<div
  class={twMerge(
    "sticky bottom-0 mb-4 bg-gray-50 py-8 pt-4 dark:bg-gray-900 sm:bottom-0 sm:mb-16 sm:pt-6",
    PAGE_PADDING
  )}
>
  <div
    class="absolute left-0 right-0 top-0 z-10 h-4 -translate-y-full bg-gradient-to-t from-gray-50 dark:from-gray-900"
    aria-hidden="true"
  />
  <div
    class="w-full sm:w-fit"
    on:keyup={(e) => e.key == "Enter" && fieldsInvalid.every((f) => !f) && randomizeAll()}
  >
    <div class="mb-4 flex w-full flex-wrap gap-4">
      <NumberInput
        label="From"
        maxDigits="8"
        bind:intValue={$config.start}
        bind:isInvalid={fieldsInvalid[1]}
        warning={warnStartGtEnd}
        initial={$config.start}
        class="w-36 grow"
      />
      <NumberInput
        label="To"
        maxDigits="8"
        bind:intValue={$config.end}
        bind:isInvalid={fieldsInvalid[2]}
        warning={warnStartGtEnd}
        initial={$config.end}
        class="w-36 grow"
      />
      <div class="flex items-end gap-3">
        <NumberInput
          maxDigits="2"
          label="Amount"
          numberPattern={/^[0-9,]+$/}
          bind:intValue={$config.count}
          bind:isInvalid={fieldsInvalid[0]}
          warning={warnAmountGtRange}
          initial={$config.count}
          class="w-36 grow"
        />
        <label class="mb-2 flex w-fit items-center gap-1.5">
          <div class="relative h-5 w-5">
            <input
              type="checkbox"
              class={twMerge(
                "absolute inset-0 appearance-none rounded border bg-white shadow-sm checked:border-primary-400 checked:bg-primary-600",
                "transition-all duration-100",
                "dark:border-transparent dark:bg-gray-700 dark:checked:bg-primary-600",
                "outline-none ring-offset-1 focus-visible:ring-2 focus-visible:ring-secondary-500"
              )}
              bind:checked={$config.unique}
            />
            <Icon
              src={Check}
              size="16px"
              class={twMerge(
                "absolute inset-0 m-0.5 fill-current text-white transition-opacity",
                !$config.unique && "opacity-0"
              )}
              theme="round"
            />
          </div>
          <p class="mt-1">Unique</p>
        </label>
      </div>
    </div>
    <Button on:click={randomizeAll} disabled={fieldsInvalid.some((f) => f)} class="w-full sm:w-fit">
      Generate
    </Button>
  </div>
</div>
<div class={twMerge("mb-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">More generators</h1>
  <Tools exclude="numbers" />
</div>
