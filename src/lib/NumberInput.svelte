<script>
  import clsx from "clsx";
  export let maxDigits = 10;
  export let isInvalid = false;
  export let label = "";
  export let placeholder = "";

  let numberPattern = /^-?[0-9,]+$/;

  let rawValue = placeholder;
  export let intValue;

  $: intValue = parseInt(rawValue.replaceAll(",", ""));

  let classes = "";
  export { classes as class };
</script>

<div class={classes}>
  <label>
    <p class="mb-1 block font-medium">{label}</p>
    <div class="relative w-full">
      <input
        type="text"
        inputmode="numeric"
        class={clsx(
          "w-full rounded border px-3 py-2 shadow-sm",
          "outline-none ring-primary-500 ring-opacity-50 focus-visible:border-primary-500 focus-visible:ring-2",
          "dark:border-gray-600 dark:bg-transparent dark:ring-opacity-40 focus-visible:dark:border-primary-600",
          isInvalid && "border-red-500 dark:border-red-400"
        )}
        maxlength={maxDigits}
        {placeholder}
        bind:value={rawValue}
        on:input={(_) => (isInvalid = !rawValue.match(numberPattern) || isNaN(intValue))}
      />
      {#if isInvalid}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="absolute right-2 top-0 h-5 w-5 translate-y-1/2 text-red-500 dark:text-red-400"
          aria-label="exclamation icon indicating invalid input"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    </div>
  </label>
</div>
