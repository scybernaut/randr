<script>
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "$lib/useClickOutside.js";
  import { twMerge } from "tailwind-merge";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { ArrowDropDown } from "@steeze-ui/material-design-icons";

  const dispatch = createEventDispatcher();

  export let options;
  export let selectedIndex = undefined;

  export let label;
  export let transparent = false;
  export let alignStart = false;

  let moreClasses = "";
  export { moreClasses as class };

  export let buttonClasses = "";
  export let dialogClasses = "";

  let showDropdown = false;

  const closeDropdown = () => (showDropdown = false);
</script>

<div
  class={twMerge("relative w-fit", moreClasses)}
  use:clickOutside
  on:clickoutside={closeDropdown}
>
  <button
    class={twMerge(
      "flex w-full items-center justify-between rounded p-2 pr-1 transition-colors",
      "border border-transparent hover:border-gray-300 hover:bg-gray-100",
      "dark:hover:border-transparent dark:hover:bg-gray-800",
      transparent || "border-inherit bg-white shadow dark:border-transparent dark:bg-gray-800",
      showDropdown &&
        "!border-primary-300 !bg-primary-100 dark:!border-transparent dark:!bg-gray-700",
      buttonClasses
    )}
    on:click={() => (showDropdown = !showDropdown)}
    aria-labelledby="themeButtonLabel"
  >
    {#if selectedIndex === undefined || selectedIndex < 0}
      <span class="mx-1">Select…</span>
    {:else if options[selectedIndex].icon}
      <Icon src={options[selectedIndex].icon} class="inline h-5 w-5 fill-current" theme="round" />
    {:else}
      <span class="mx-1">{options[selectedIndex].text}</span>
    {/if}
    <Icon src={ArrowDropDown} class="inline h-4 w-4 fill-current" theme="round" />
  </button>
  <dialog
    class={twMerge(
      alignStart ? "end-auto start-0" : "end-0 start-auto",
      "invisible absolute top-full mt-1 flex w-max min-w-full flex-col rounded border border-gray-200 bg-white p-0 py-px text-inherit shadow-lg open:visible",
      "dark:border-gray-700 dark:bg-gray-900",
      "-translate-y-5 opacity-0 transition-all duration-200 ease-in-out open:translate-y-0 open:opacity-100",
      dialogClasses
    )}
    open={showDropdown}
    aria-hidden
  >
    <h2 class="px-3.5 pb-1.5 pt-2 font-bold" id="themeButtonLabel">{label}</h2>
    {#each options as option, i}
      <button
        class={twMerge(
          "my-px flex items-center gap-2 border-y border-transparent py-1.5 pl-3.5 pr-4 text-start",
          (selectedIndex === i &&
            "border-primary-700 bg-primary-600 text-white hover:border-primary-800 hover:bg-primary-700") ||
            "hover:border-primary-300 hover:bg-primary-100 dark:hover:border-primary-700 dark:hover:bg-primary-900"
        )}
        on:click={() => {
          selectedIndex = i;
          dispatch("pick", option.id);
          closeDropdown();
        }}
      >
        {#if option.icon}
          <Icon src={option.icon} class="inline h-5 w-5 fill-current" theme="round" />
        {/if}
        <span class:ml-1={!option.icon}>{option.text}</span>
      </button>
    {/each}
  </dialog>
</div>
