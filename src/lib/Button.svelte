<script>
  import { twMerge } from "tailwind-merge";
  let moreClasses = "";
  export let disabled = false;

  export { moreClasses as class };
</script>

<button
  on:click
  class={twMerge(
    "rounded border border-transparent bg-primary-600 px-6 py-2.5 text-lg text-white shadow-md",
    "outline-none ring-primary-500 ring-opacity-50 transition-colors duration-100 hover:bg-primary-700 focus-visible:border-primary-700 focus-visible:ring-2 active:bg-primary-600",
    "dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus-visible:border-primary-500 dark:active:bg-primary-800",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary-600",
    moreClasses
  )}
  {disabled}
>
  <slot>Start</slot>
</button>
