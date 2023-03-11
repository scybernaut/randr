<script>
  import clsx from "clsx";
  let moreClasses = "";
  export let disabled = false;

  export { moreClasses as class };
</script>

<button
  on:click
  class={clsx(
    moreClasses,
    "rounded bg-primary-600 px-6 py-2.5 text-lg text-white shadow-md",
    "outline-none ring-primary-500 ring-opacity-50 transition-colors duration-100 hover:bg-primary-700 focus-visible:ring-2 active:bg-primary-600",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-600"
  )}
  {disabled}
>
  <slot>Start</slot>
</button>
