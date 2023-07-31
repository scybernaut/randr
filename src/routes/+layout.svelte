<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { twMerge } from "tailwind-merge";

  import { PAGE_PADDING, loadConfig } from "$lib/utils.js";

  import Dropdown from "$lib/Dropdown.svelte";

  import { Brightness4, LightMode, DarkMode } from "@steeze-ui/material-design-icons";

  const config = writable({
    theme: "auto" // "auto" | "light" | "dark"
  });

  const THEMES = [
    {
      icon: Brightness4,
      text: "Follow System",
      id: "auto"
    },
    {
      icon: LightMode,
      text: "Light",
      id: "light"
    },
    {
      icon: DarkMode,
      text: "Dark",
      id: "dark"
    }
  ];

  onMount(() => {
    if (typeof window === "undefined") return;

    let schemePrefsQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const setTheme = (theme) => {
      const prefersDark = schemePrefsQuery.matches;
      document.documentElement.classList.remove("light", "dark");

      if (theme === "auto") document.documentElement.classList.add(prefersDark ? "dark" : "light");
      else document.documentElement.classList.add(theme);
    };

    schemePrefsQuery.addEventListener("change", () => setTheme($config.theme));

    loadConfig(window.localStorage, "global", config);

    config.subscribe(({ theme }) => setTheme(theme));
  });

  let showThemeDropdown = false;

  const closeDropdown = () => {
    showThemeDropdown = false;
  };

  let scrollY = 0;
  let showHeaderBorder = false;
  $: {
    showHeaderBorder = scrollY > 25;
  }
</script>

<svelte:window bind:scrollY />
<div
  class="flex min-h-screen flex-col items-center"
  on:keydown={({ key }) => key === "Escape" && closeDropdown()}
>
  <header
    class={twMerge(
      "sticky left-0 right-0 top-0 z-40 h-14 w-full border-b border-gray-200 bg-white/90",
      "backdrop-blur-lg transition-all dark:border-transparent dark:bg-gray-900/90",
      showHeaderBorder && "dark:border-gray-700/75"
    )}
  >
    <div class="mx-auto flex h-full max-w-screen-md items-center justify-between p-4 px-6 sm:px-8">
      <a
        class="rounded-sm text-xl font-bold outline-none ring-secondary-500 ring-offset-2 ring-offset-white focus-visible:ring dark:ring-offset-gray-900"
        href="/"
      >
        randr<span class="text-accent-600 dark:text-accent-500">.</span>
      </a>
      <Dropdown
        options={THEMES}
        selectedIndex={THEMES.findIndex((theme) => theme.id === $config.theme)}
        label="Theme"
        on:pick={({ detail: id }) => ($config.theme = id)}
        flat
        bind:showDropdown={showThemeDropdown}
      />
    </div>
  </header>
  <main class="mx-auto w-full max-w-screen-md grow py-6">
    <slot />
  </main>
  <footer class={twMerge("mt-8 w-full bg-gray-200/50 dark:bg-gray-950/25")}>
    <div
      class={twMerge(
        "mx-auto flex h-full max-w-screen-md flex-wrap items-center gap-4 py-4",
        "text-xs text-gray-600/60 dark:text-gray-300/60",
        PAGE_PADDING
      )}
    >
      <div class=" font-semibold leading-tight">
        <p class="text-sm">
          randr<span class="text-accent-500 text-opacity-60">.</span>
        </p>
        <span class="text-xs font-medium">by</span>
        <a
          class="transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          href="https://scybernaut.me"
        >
          scybernaut<span class="text-scybergreen text-opacity-60">.</span>
        </a>
      </div>
      <div class="ml-auto text-end">
        <p class="">Made with SvelteKit</p>
        <a
          href="https://gitlab.com/scybernaut/randr"
          class="block font-semibold transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          target="_blank"
        >
          View source on GitLab
        </a>
      </div>
    </div>
  </footer>
</div>
