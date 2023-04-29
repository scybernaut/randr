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
    "outline-none ring-primary-500 ring-opacity-50 transition-colors duration-100  focus-visible:border-primary-700 focus-visible:ring-2",
    // basic state
    (colored && "bg-primary-600 text-white") || "border-gray-200 bg-white",
    (colored && "dark:bg-primary-600 dark:text-white") ||
      "dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/50",
    // hovered
    (colored && "enabled:hover:bg-primary-700") ||
      "enabled:hover:border-primary-300 enabled:hover:bg-primary-50",
    (colored && "dark:enabled:hover:bg-primary-700") ||
      "dark:enabled:hover:border-primary-700 dark:enabled:hover:bg-primary-900/50 dark:enabled:hover:shadow-primary-700/50",
    // active
    (colored && "enabled:active:bg-primary-800") || "enabled:active:bg-primary-100",
    (colored && "dark:enabled:active:bg-primary-800") || "dark:enabled:active:bg-primary-900",
    "dark:focus-visible:border-primary-500",
    "disabled:cursor-not-allowed disabled:opacity-40",
    moreClasses
  )}
  {disabled}
  aria-label={label}
>
  <slot>Start</slot>
</button>
