<script>
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";
  import { sleep } from "$lib/utils";
  import NumberInput from "$lib/NumberInput.svelte";
  import clsx from "clsx";

  let start = 1;
  let end = 10;

  let random = "";
  let textSize = "text-8xl";

  let invalidStart = false;
  let invalidEnd = false;

  const generate = async () => {
    if (start > end) [start, end] = [end, start];

    if (end > 9999999) textSize = "text-4xl";
    else if (end > 9999) textSize = "text-6xl";
    else textSize = "text-8xl";

    for (let i = 0; i < 10; i++) {
      random = (Math.floor(Math.random() * (end - start + 1)) + start).toLocaleString("en-US");
      await sleep(20);
    }
  };
  generate();
</script>

<div class="mx-auto flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row-reverse">
  <div
    class={clsx(
      "flex h-72 w-full min-w-68 items-center justify-center rounded-xl border bg-white p-8 shadow-md sm:w-72",
      "dark:border-0 dark:bg-gray-800 dark:shadow-lg"
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
        placeholder={"0"}
      />
      <NumberInput
        class="w-36 grow sm:grow-0"
        label="To"
        bind:intValue={end}
        bind:isInvalid={invalidEnd}
        placeholder={"10"}
      />
    </div>
    <Button on:click={generate} class="w-full sm:w-max" disabled={invalidStart || invalidEnd}
      >Generate</Button
    >
  </div>
</div>
<div class="mt-8">
  <h1 class="mb-4 text-xl font-bold">See also</h1>
  <Tools exclude="number" />
</div>
