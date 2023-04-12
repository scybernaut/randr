<script>
  import { twMerge } from "tailwind-merge";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { ArrowForward } from "@steeze-ui/material-design-icons";

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

<div class={["grid gap-x-3 gap-y-3 sm:grid-cols-3", className].join(" ")}>
  {#each toolsToShow as tool}
    <a
      class={twMerge(
        "flex items-center justify-between rounded border bg-white px-4 py-3 shadow-sm transition-colors duration-300",
        "outline-none ring-primary-500 ring-opacity-50 hover:border-primary-500 hover:bg-primary-50 focus-visible:border-primary-500 focus-visible:bg-primary-50 focus-visible:ring-2",
        "dark:border-gray-700 dark:bg-gray-900",
        "hover:dark:border-primary-500 hover:dark:bg-primary-900 focus-visible:dark:border-primary-500 focus-visible:dark:bg-primary-900"
      )}
      href={tool.href}
    >
      <h1 class="font-medium">{tool.name}</h1>
      <Icon src={ArrowForward} class="h-5 w-5 fill-current" theme="round" aria-hidden="true" />
    </a>
  {/each}
</div>
