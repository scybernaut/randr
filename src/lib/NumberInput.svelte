<script>
  import { twMerge } from "tailwind-merge";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { Warning, Error } from "@steeze-ui/material-design-icons";

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
        <Icon
          src={Error}
          class="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 fill-current text-red-500 dark:text-red-400"
          theme="round"
        />
      {:else if warning}
        <Icon
          src={Warning}
          class="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 fill-current text-gray-300 dark:text-gray-600"
          theme="round"
        />
      {/if}
    </div>
  </label>
</div>
