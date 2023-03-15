<script>
  import { twMerge } from "tailwind-merge";
  export let maxDigits = 10;
  export let isInvalid = false;
  export let warning = false;
  export let label = "";
  export let initial = undefined;

  const placeholder = initial.toString();

  export let numberPattern = /^-?[0-9,]+$/;

  export let intValue;
  $: intValue = parseInt(initial.toString().replaceAll(",", ""));

  let classes = "";
  export { classes as class };
</script>

<div class={classes}>
  <label>
    <p class="mb-0.5 block font-medium">{label}</p>
    <div class="relative w-full">
      <input
        type="text"
        inputmode="numeric"
        class={twMerge(
          "w-full rounded border px-3 py-2 shadow-sm",
          isInvalid && "ring-2 ring-red-500 ring-opacity-80 dark:ring-red-400", // "border-red-500 dark:border-red-400"
          "outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50",
          "placeholder:text-gray-300 dark:placeholder:text-gray-500",
          "dark:border-transparent dark:bg-gray-800 dark:shadow focus-visible:dark:border-primary-500"
        )}
        maxlength={maxDigits}
        {placeholder}
        value={initial?.toString() ?? ""}
        on:input={(ev) => {
          const newValue = ev.target.value;
          const parsed = parseInt(newValue.replaceAll(",", ""));
          isInvalid = !newValue.match(numberPattern) || isNaN(parsed);
          if (!isInvalid) intValue = parsed;
        }}
      />
      {#if isInvalid}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500 dark:text-red-400"
          aria-label="exclamation icon indicating invalid input"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      {:else if warning}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 dark:text-gray-600"
        >
          <path
            fill-rule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    </div>
  </label>
</div>
