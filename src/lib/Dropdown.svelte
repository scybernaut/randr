<script>
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "$lib/useClickOutside.js";
  import { twMerge } from "tailwind-merge";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { ArrowDropDown, Check } from "@steeze-ui/material-design-icons";
  import Button from "$lib/UnifiedButton.svelte";

  const dispatch = createEventDispatcher();

  export let options;
  export let selectedIndex = undefined;

  export let label;
  export let flat = false;
  export let alignStart = false;

  let moreClasses = "";
  export { moreClasses as class };

  export let dialogClasses = "";

  export let showDropdown = false;

  const closeDropdown = () => (showDropdown = false);
</script>

<div
  class={twMerge("relative w-fit", moreClasses)}
  use:clickOutside
  on:clickoutside={closeDropdown}
>
  <Button
    emphasis="secondary"
    {flat}
    isIconOnly
    class={twMerge("flex items-center p-2 pr-1", showDropdown && "activated")}
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
  </Button>
  <dialog
    class={twMerge(
      alignStart ? "end-auto start-0" : "end-0 start-auto",
      "invisible absolute top-full mt-1 flex w-max min-w-full flex-col rounded border border-gray-200 bg-white p-0 py-px text-inherit shadow-lg open:visible",
      "dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900",
      "-translate-y-5 opacity-0 transition-all duration-200 ease-in-out open:translate-y-0 open:opacity-100",
      dialogClasses
    )}
    open={showDropdown}
    aria-hidden
  >
    <h2 class="px-3.5 pb-1.5 pt-2 font-bold" id="themeButtonLabel">{label}</h2>
    {#each options as option, i}
      <Button
        emphasis="secondary"
        flat
        class={twMerge(
          "flex items-center gap-2 py-2",
          selectedIndex === i && "font-semibold text-primary-700 dark:text-primary-300"
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
        <Icon
          src={Check}
          class={twMerge(
            "ml-auto box-content inline h-5 w-5 fill-current pl-2",
            selectedIndex !== i && "invisible"
          )}
          theme="round"
        />
      </Button>
    {/each}
  </dialog>
</div>
