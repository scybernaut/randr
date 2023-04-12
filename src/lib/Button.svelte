<script>
  import { twMerge } from "tailwind-merge";
  let moreClasses = "";
  export let disabled = false;
  export let colored = true;
  export let label = undefined;

  export { moreClasses as class };
</script>

<button
  on:click
  class={twMerge(
    "rounded border border-transparent px-6 py-2.5 text-lg shadow-md",
    (colored && "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-600") ||
      "border-gray-200 bg-white hover:bg-gray-50 active:bg-white",
    "outline-none ring-primary-500 ring-opacity-50 transition-colors duration-100  focus-visible:border-primary-700 focus-visible:ring-2",
    (colored && "dark:bg-primary-600 dark:hover:bg-primary-700 dark:active:bg-primary-800") ||
      "dark:border-transparent dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-800",
    "dark:focus-visible:border-primary-500",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary-600",
    moreClasses
  )}
  {disabled}
  aria-label={label}
>
  <slot>Start</slot>
</button>
