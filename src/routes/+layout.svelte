<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import { loadConfig } from "$lib/utils.js";

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
</script>

<div class="" on:keydown={({ key }) => key === "Escape" && closeDropdown()}>
  <header
    class={"fixed left-0 right-0 top-0 z-40 h-16 border-b border-gray-200 bg-white dark:border-0 dark:bg-gray-900"}
  >
    <div class="mx-auto flex h-full max-w-screen-md items-center justify-between p-4 px-6 sm:px-8">
      <a class="text-xl font-bold" href="/">
        randr<span class="text-secondary-600 dark:text-secondary-500">.</span>
      </a>
      <Dropdown
        options={THEMES}
        selectedIndex={THEMES.findIndex((theme) => theme.id === $config.theme)}
        label="Theme"
        on:pick={({ detail: id }) => ($config.theme = id)}
        transparent
      />
    </div>
  </header>
  <main class="mx-auto mt-16 max-w-screen-md py-6">
    <slot />
  </main>
</div>
