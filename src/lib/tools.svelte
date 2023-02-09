<script>
  let exclude = null;
  let className = "";

  export { exclude, className as class };

  const TOOLS = [
    { id: "number", name: "Number", href: "/number" },
    { id: "wheel", name: "List: Wheel", href: "/wheel" },
    { id: "list", name: "List: Minimal", href: "/list" },
    { id: "tarot", name: "Tarot", href: "/tarot" },
    { id: "number", name: "Number", href: "/number" },
    { id: "number", name: "Number", href: "/number" }
  ];

  const toolsToShow = TOOLS.filter((tool) => tool.id !== exclude);
</script>

<div class={["grid gap-x-3 gap-y-3 sm:grid-cols-3", className].join(" ")}>
  {#each toolsToShow as tool}
    <a
      class="flex items-center justify-between rounded border px-4 py-3 shadow-sm transition-colors duration-300 hover:border-blue-500 hover:bg-blue-50"
      href={tool.href}
    >
      <h1 class="font-medium">{tool.name}</h1>
      <img class="h-5" src="/arrow-right.svg" alt="" srcset="" />
    </a>
  {/each}
</div>
