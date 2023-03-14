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

  let warnStartGtEnd = false;
  $: warnStartGtEnd = fieldsInvalid.every((f) => !f) && start > end;

  const fieldsInvalid = [false, false, false];

  const numbers = [];

  let gridCols = ["grid-cols-4", "sm:grid-cols-4"];
  let textSize = ["text-3xl", "sm:text-5xl"];
  let boxPadding = ["p-2", "sm:p-4"];

  const randomize = async (index) => {
    const generateCount = mapToRange(index, 0, count - 1, MIN_GENERATE_COUNT, MAX_GENERATE_COUNT);

    const [min, max] = start > end ? [end, start] : [start, end];
    for (let i = 0; i < generateCount; i++) {
      numbers[index] = (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString("en-US");
      await sleep(20);
    }
  };

  const getAverageLength = (min, max) => {
    if (min < 0 && max > 0) {
      const absMin = Math.abs(min);
      return (
        (absMin * getAverageLength(0, absMin) + max * getAverageLength(0, max) - 1) / (absMin + max)
      );
    } else if (min < 0 && max < 0) {
      return getAverageLength(Math.abs(max), Math.abs(min));
    }
    // min > 0 && max < 0 is impossible since min and max is always in the correct order

    const minLength = Math.ceil(min).toString().length;
    const maxLength = Math.floor(max).toString().length;

    if (minLength == maxLength) return minLength;

    let sum = 0;

    // say 14 - 2500
    // 1: 0
    // 2: 1e2 - 14
    // 3: 1e3 - 1e2
    // 4: 2500 - 1e3 + 1

    sum += (10 ** minLength - min) * minLength; // 100 - 24 = 86 numbers with length 2 (including 24)
    for (let length = minLength + 1; length < maxLength; length++) {
      sum += (10 ** length - 10 ** (length - 1)) * length;
    }
    sum += (max - 10 ** (maxLength - 1) + 1) * maxLength; // 132 - 100 + 1 = 33 numbers with length 3

    return sum / (max - min + 1);
  };

  const adjustStyles = (avgLength) => {
    gridCols = ["grid-cols-4", "sm:grid-cols-4"];
    textSize = ["text-3xl", "sm:text-5xl"];
    boxPadding = ["p-5", "sm:p-10"];

    if (count > 8) {
      gridCols[1] = "sm:grid-cols-6";
      boxPadding[1] = "sm:p-8";
    }

    if (avgLength > 6) {
      gridCols = ["grid-cols-1", "sm:grid-cols-2"];
      textSize = ["text-2xl", "sm:text-3xl"];
      boxPadding[1] = "sm:p-4";
      boxPadding[0] = "p-3";
    } else if (avgLength >= 3) {
      gridCols = ["grid-cols-2", "sm:grid-cols-4"];
      textSize = ["text-2xl", "sm:text-3xl"];
      boxPadding[1] = "sm:p-8";
      boxPadding[0] = "p-3";
    } else if (avgLength >= 2) {
      gridCols[0] = "grid-cols-3";
    }
  };

  const randomizeAll = async () => {
    // allow some number to overflow where
    // if (end > 99 * ALLOWED_NUMBER_OVERFLOW) gridCols[0] = "grid-cols-4";
    // else gridCols[0] = "grid-cols-4";

    const [min, max] = start > end ? [end, start] : [start, end];

    const avgLength = getAverageLength(min, max);

    adjustStyles(avgLength);

    numbers.length = count;
    if (count < 0) return;
    for (let i = 0; i < count; i++) randomize(i);
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
        class="absolute bottom-0.5 right-1 select-none text-xs text-gray-300 dark:text-gray-600 sm:bottom-1 sm:right-2 sm:text-sm"
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
  <h1 class="mb-4 text-3xl font-bold">Random numbers</h1>
  <div class="mb-8 w-full sm:w-fit">
    <div class="mb-4 flex w-full flex-wrap gap-4">
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
      initial={INIT_COUNT}
      class="w-full"
    />
  </div>
  <Button on:click={randomizeAll} disabled={fieldsInvalid.some((f) => f)} class="w-full sm:w-max"
    >Generate</Button
  >
</div>
<div class={twMerge("mb-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">See also</h1>
  <Tools exclude="numbers" />
</div>
