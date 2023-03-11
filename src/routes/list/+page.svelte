<script>
  import { sleep } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { quartOut } from "svelte/easing";

  let inputText = "Vijay\nCassidy\nRosaria";
  // let items = [];

  // $: items = inputText.split("\n").map((name) => ({
  //   name: name,
  //   id: Math.random()
  // }));

  let delim = "\n";
  let items = [];

  let waitTime = 125;

  let timesUpdated = 0;

  let hasRun = false; // whether the generator has been run at least once

  $: items = inputText.split(delim).filter((s) => !!s);

  let picked = "Vijay";

  const MIN_PRE_UPDATES = 10;
  const MAX_PRE_UPDATES = 20;

  let flashing = false;

  const generate = async () => {
    let pickedIndex = Math.floor(Math.random() * items.length);
    let preUpdateCount =
      Math.floor(Math.random() * (MAX_PRE_UPDATES - MIN_PRE_UPDATES + 1)) + MIN_PRE_UPDATES;

    let updateCount = preUpdateCount + (pickedIndex - (preUpdateCount % items.length) + 1);
    console.log(
      preUpdateCount,
      updateCount,
      pickedIndex,
      items[(updateCount - 1) % items.length],
      items[pickedIndex]
    );

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
  class="mx-auto my-1 grid w-fit items-start justify-center gap-8 sm:my-4 md:grid-cols-2-autoFirst"
>
  <div class="relative h-44 w-72 items-center justify-center gap-2 rounded-xl border p-6 shadow-md">
    {#key timesUpdated}
      <span
        class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-medium transition-all duration-75 ease-in-out  ${
          flashing ? "scale-105 text-blue-600" : ""
        }`}
        in:fly={{ y: -40, duration: waitTime, easing: quartOut }}
        out:fly={{ y: 40, duration: waitTime, easing: quartOut }}
      >
        {picked}
      </span>
    {/key}
  </div>
  <div class="w-max">
    <h1 class="mb-4 text-2xl font-bold">Minimal random picker</h1>
    <div>
      <label class="mb-1 block font-medium" for="list">Items</label>
      <textarea
        name="list"
        id="list"
        cols="30"
        rows="6"
        class="rounded border py-2 px-3 leading-relaxed"
        bind:value={inputText}
      />
    </div>
    <button
      class="mt-4 w-full rounded bg-blue-600 px-4 py-3 text-lg text-white shadow-md outline-none transition-colors duration-100 hover:bg-blue-700 focus:ring-2 active:bg-blue-600"
      on:click={generate}
    >
      Generate
    </button>
  </div>
</div>
