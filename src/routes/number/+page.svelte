<script>
  let start = 0;
  let end = 10;

  let random = "";
  let textSize = "text-8xl";

  const sleep = (ms) =>
    new Promise((res) => {
      setTimeout(res, ms);
    });

  const generate = async () => {
    textSize = end < 9999 ? "text-8xl" : "text-6xl";
    for (let i = 0; i < 10; i++) {
      random = (Math.floor(Math.random() * (end - start + 1)) + start).toLocaleString();
      await sleep(20);
    }
  };
  generate();
</script>

<div class="my-16 mx-auto flex items-start justify-center gap-6">
  <div class="flex h-72 min-w-72 items-center justify-center rounded-xl border p-8 shadow-md">
    <span class="text-center tabular-nums {textSize}">
      {random}
    </span>
  </div>
  <div>
    <h1 class="mb-6 text-2xl font-bold">Random number generator</h1>
    <div class="flex gap-6">
      <div>
        <label class="mb-1 block" for="start">From</label>
        <input
          type="number"
          class="rounded border px-3 py-2 shadow-sm"
          name="start"
          id="start"
          placeholder="0"
          bind:value={start}
        />
      </div>
      <div>
        <label class="mb-1 block" for="end">To</label>
        <input
          type="number"
          class="rounded border px-3 py-2 shadow-sm"
          name="end"
          id="end"
          placeholder="10"
          bind:value={end}
        />
      </div>
    </div>
    <button
      on:click={generate}
      class="mt-6 w-full rounded bg-blue-600 px-4 py-3 text-lg text-white shadow-md transition-colors duration-100 hover:bg-blue-700 active:bg-blue-600"
    >
      Generate
    </button>
  </div>
</div>
