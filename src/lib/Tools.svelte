<script>
  import { Icon } from "@steeze-ui/svelte-icon";
  import { ArrowForward } from "@steeze-ui/material-design-icons";

  import Button from "$lib/UnifiedButton.svelte";

  let exclude = null;
  let query = "";
  let className = "";

  export { exclude, query, className as class };

  const TOOLS = [
    { id: "number", name: "Number", href: "/number" },
    { id: "numbers", name: "Numbers", href: "/numbers" },
    { id: "wheel", name: "List: Wheel", href: "/wheel", disabled: true },
    { id: "list", name: "List: Minimal", href: "/list" },
    { id: "tarot", name: "Tarot", href: "/tarot", disabled: true },
    { id: "moonblocks", name: "Moon Blocks (Jiaobei)", href: "/moonblocks", disabled: true }
  ];

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  let toolsToShow;
  $: toolsToShow = TOOLS.filter((tool) => {
    const q = escapeRegExp(query.toLowerCase());
    const matchesQuery = [tool.id, tool.name].some((s) => s.toLowerCase().match(q));

    return !tool.disabled && tool.id !== exclude && matchesQuery;
  });
</script>

{#if query && toolsToShow.length === 0}
  <p class="my-6 text-center text-gray-500">No match found.</p>
{:else}
  <div class={["grid gap-x-3 gap-y-3 sm:grid-cols-3", className].join(" ")}>
    {#each toolsToShow as tool}
      <Button
        isLink={true}
        class="flex items-center justify-between"
        emphasis="secondary"
        href={tool.href}
      >
        <h1 class="font-medium">{tool.name}</h1>
        <Icon src={ArrowForward} class="h-5 w-5 fill-current" theme="round" aria-hidden="true" />
      </Button>
    {/each}
  </div>
{/if}
