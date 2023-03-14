<script>
  import NumberInput from "$lib/NumberInput.svelte";
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";
  import { twMerge } from "tailwind-merge";

  import { sleep, mapToRange, PAGE_PADDING } from "$lib/utils.js";

  const INIT_START = 1,
    INIT_END = 10,
    INIT_COUNT = 8;
  const MIN_GENERATE_COUNT = 10,
    MAX_GENERATE_COUNT = 30;

  let start = INIT_START;
  let end = INIT_END;
  let count = INIT_COUNT;

  let unique = false;

  let warnStartGtEnd = false;
  $: warnStartGtEnd = fieldsInvalid.every((f) => !f) && start > end;

  let warnAmountGtRange = false;
  $: if (unique) {
    const [min, max] = start > end ? [end, start] : [start, end];
    warnAmountGtRange = max - min + 1 < count;
  }
  const fieldsInvalid = [false, false, false];

  const numbers = [];

  let gridCols = ["grid-cols-4", "sm:grid-cols-4"];
  let textSize = ["text-3xl", "sm:text-5xl"];
  let boxPadding = ["p-2", "sm:p-4"];

  const randomize = async (index, finalValue) => {
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

    let assumedLength = maxLength;
    if (assumedLength >= 2) {
      textSize[1] = "sm:text-4xl";
    }
    if (assumedLength >= 3) {
      gridCols[0] = "grid-cols-3";
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
    // allow some number to overflow where
    // if (end > 99 * ALLOWED_NUMBER_OVERFLOW) gridCols[0] = "grid-cols-4";
    // else gridCols[0] = "grid-cols-4";

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
  randomizeAll();
</script>

<div class={twMerge("mb-8 grid w-full gap-2 sm:gap-3", ...gridCols, PAGE_PADDING)}>
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
    "sticky -bottom-16 bg-gray-50 pt-4 pb-20 dark:bg-gray-900 sm:bottom-0",
    PAGE_PADDING
  )}
>
  <div
    class="absolute top-0 left-0 right-0 z-10 h-8 -translate-y-full bg-gradient-to-t from-gray-50 dark:from-gray-900"
    aria-hidden="true"
  />
  <h1 class="mb-4 text-2xl font-bold sm:text-3xl">Random numbers</h1>
  <div class="mb-6 w-full sm:w-fit" on:keyup={(e) => e.key == "Enter" && randomizeAll()}>
    <div class="mb-3 flex w-full flex-wrap gap-4">
      <NumberInput
        label="From"
        maxDigits="8"
        bind:intValue={start}
        bind:isInvalid={fieldsInvalid[1]}
        warning={warnStartGtEnd}
        initial={INIT_START}
        class="w-36 grow"
      />
      <NumberInput
        label="To"
        maxDigits="8"
        bind:intValue={end}
        bind:isInvalid={fieldsInvalid[2]}
        warning={warnStartGtEnd}
        initial={INIT_END}
        class="w-36 grow"
      />
    </div>
    <NumberInput
      maxDigits="2"
      label="Amount"
      numberPattern={/^[0-9,]+$/}
      bind:intValue={count}
      bind:isInvalid={fieldsInvalid[0]}
      warning={warnAmountGtRange}
      initial={INIT_COUNT}
      class="mb-3 w-full"
    />
    <label class="flex w-fit items-center gap-1.5">
      <div class="relative h-5 w-5">
        <input
          type="checkbox"
          class={twMerge(
            "absolute inset-0 appearance-none rounded border bg-white shadow-sm checked:bg-primary-600",
            "dark:border-transparent dark:bg-gray-700 dark:checked:bg-primary-600",
            "outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50"
          )}
          bind:checked={unique}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class={twMerge("absolute inset-0 m-0.5 text-white", unique ? "visible" : "invisible")}
        >
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <p class="mt-1">Unique</p>
    </label>
  </div>
  <Button on:click={randomizeAll} disabled={fieldsInvalid.some((f) => f)} class="w-full sm:w-max">
    Generate
  </Button>
</div>
<div class={twMerge("mb-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">More generators</h1>
  <Tools exclude="numbers" />
</div>
