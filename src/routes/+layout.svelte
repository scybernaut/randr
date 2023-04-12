<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import { loadConfig } from "$lib/utils.js";
  import { clickOutside } from "$lib/useClickOutside.js";

  import { fly } from "svelte/transition";

  import { twMerge } from "tailwind-merge";

  import { Icon } from "@steeze-ui/svelte-icon";
  import {
    Brightness4,
    LightMode,
    DarkMode,
    ArrowDropDown
  } from "@steeze-ui/material-design-icons";

  const config = writable({
    theme: "auto" // "auto" | "light" | "dark"
  });

  const THEME_INFO = {
    auto: {
      icon: Brightness4,
      text: "Follow System"
    },
    light: {
      icon: LightMode,
      text: "Light"
    },
    dark: {
      icon: DarkMode,
      text: "Dark"
    }
  };

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
      <div class="relative" use:clickOutside on:clickoutside={closeDropdown}>
        <button
          class={twMerge(
            "flex items-center rounded p-2 pr-1 transition-colors",
            "border border-transparent hover:border-gray-300 hover:bg-gray-100",
            "dark:hover:border-transparent dark:hover:bg-gray-800",
            showThemeDropdown &&
              "!border-primary-300 !bg-primary-100 dark:!border-transparent dark:!bg-gray-700"
          )}
          on:click={() => (showThemeDropdown = !showThemeDropdown)}
          aria-labelledby="themeButtonLabel"
        >
          <Icon
            src={THEME_INFO[$config.theme].icon}
            class="inline h-5 w-5 fill-current"
            theme="round"
          />
          <Icon src={ArrowDropDown} class="inline h-4 w-4 fill-current" theme="round" />
        </button>
        <dialog
          class={twMerge(
            "invisible absolute end-0 start-auto top-full mt-1 flex w-max flex-col rounded border border-gray-200 bg-white p-0 py-px text-inherit shadow-lg open:visible",
            "dark:border-gray-700 dark:bg-gray-900",
            "-translate-y-5 opacity-0 transition-all duration-200 ease-in-out open:translate-y-0 open:opacity-100"
          )}
          transition:fly={{ y: -20, duration: 300 }}
          open={showThemeDropdown}
          aria-hidden
        >
          <h2 class="mx-4 my-1.5 font-bold" id="themeButtonLabel">Theme</h2>
          {#each ["auto", "light", "dark"] as theme}
            <button
              class={twMerge(
                "my-px flex items-center gap-2 border-y border-transparent px-4 py-1.5 pl-4 text-start",
                (theme === $config.theme &&
                  "border-primary-700 bg-primary-600 text-white hover:border-primary-800 hover:bg-primary-700") ||
                  "hover:border-primary-300 hover:bg-primary-100 dark:hover:border-primary-700 dark:hover:bg-primary-900"
              )}
              on:click={() => {
                $config.theme = theme;
                closeDropdown();
              }}
            >
              <Icon
                src={THEME_INFO[theme].icon}
                class="inline h-5 w-5 fill-current"
                theme="round"
              />
              {THEME_INFO[theme].text}
            </button>
          {/each}
        </dialog>
      </div>
    </div>
  </header>
  <main class="mx-auto mt-16 max-w-screen-md py-6">
    <slot />
  </main>
</div>
