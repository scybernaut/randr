<script>
  import { twMerge } from "tailwind-merge";

  let exclude = null;
  let className = "";

  export { exclude, className as class };

  const TOOLS = [
    { id: "number", name: "Number", href: "/number" },
    { id: "numbers", name: "Numbers", href: "/numbers" },
    { id: "wheel", name: "List: Wheel", href: "/wheel", disabled: true },
    { id: "list", name: "List: Minimal", href: "/list" },
    { id: "tarot", name: "Tarot", href: "/tarot", disabled: true },
    { id: "moonblocks", name: "Moon Blocks (Jiaobei)", href: "/moonblocks", disabled: true }
  ];

  const toolsToShow = TOOLS.filter((tool) => !tool.disabled && tool.id !== exclude);
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5"
      >
        <path
          fill-rule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  {/each}
</div>
