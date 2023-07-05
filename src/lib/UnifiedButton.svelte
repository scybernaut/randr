<script lang="ts">
  import { twMerge } from "tailwind-merge";

  let moreClasses = "";
  export { moreClasses as class };

  type Emphasis = "primary" | "secondary" | "tertiary";
  export let emphasis: Emphasis = "primary";

  export let isLink = false;

  export let isIconOnly = false;
  export let flat = false;
  export let href: string = undefined;
  export let disabled: boolean = undefined;

  export let label: string = null;

  let isPrimary = emphasis === "primary";
  let isSecondary = emphasis === "secondary";
  let isTertiary = emphasis === "tertiary";

  if (isIconOnly && !label)
    console.warn("<UnifiedButton> is icon only but does not have any text label");
</script>

<svelte:element
  this={isLink ? "a" : "button"}
  class={twMerge(
    "inline rounded",
    "border px-4 py-3 font-medium transition-all duration-100",
    "ring-secondary-500 ring-offset-1 ring-offset-white focus-visible:outline-none focus-visible:ring dark:ring-offset-gray-900",
    "disabled:select-none disabled:opacity-60",
    isIconOnly && "p-2.5",
    isPrimary && !isIconOnly && "px-6",
    isPrimary && "border-transparent bg-primary-600 text-white shadow-md shadow-primary-400",
    isPrimary && " dark:shadow-primary-800 dark:e:activated:shadow-primary-800/50",
    isPrimary && "e:activated:bg-primary-700 e:activated:shadow-primary-400/50",
    isSecondary && "border-gray-200 bg-white shadow-sm",
    isSecondary && "e:hover:border-primary-500 e:hover:bg-primary-50 e:hover:text-primary-800",
    isSecondary &&
      "e:activated:border-primary-500 e:activated:bg-primary-100 e:activated:text-primary-800",
    isSecondary && "dark:border-gray-700 dark:bg-gray-800",
    isSecondary &&
      "dark:e:hover:border-primary-500 dark:e:hover:bg-primary-900 dark:e:hover:text-primary-100",
    isSecondary &&
      "dark:e:activated:border-primary-500 dark:e:activated:bg-primary-800 dark:e:activated:text-primary-100",
    isTertiary && "border-transparent text-primary-600 dark:text-primary-400",
    isTertiary && "e:activated:text-primary-700 dark:e:activated:text-primary-300",
    flat &&
      "border-transparent bg-transparent shadow-none dark:border-transparent dark:bg-transparent dark:shadow-none",
    moreClasses
  )}
  {href}
  {disabled}
  aria-label={label}
  on:click
>
  <slot />
</svelte:element>
