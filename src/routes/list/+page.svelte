<script>
  import Button from "$lib/Button.svelte";
  import Tools from "$lib/Tools.svelte";

  import { sleep, PAGE_PADDING, loadConfig, positiveMod } from "$lib/utils";
  import { twMerge } from "tailwind-merge";

  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  import { Icon } from "@steeze-ui/svelte-icon";
  import { Shuffle } from "@steeze-ui/material-design-icons";

  import anime from "animejs";

  const placeholder = "Liam\nOlivia\nNoah\nEmma";
  let pickedIndex = 2;

  const config = writable({
    inputText: placeholder,
    pickedIndex: pickedIndex
  });

  onMount(() => {
    if (typeof window === "undefined") return;

    loadConfig(window.localStorage, "list", config);

    pickedIndex = $config.pickedIndex;
    resetStyles();
  });

  let delim = "\n";
  let items = [];

  $: items = $config.inputText.split(delim).filter((s) => s && !s.match(/^\s+$/));
  $: isInvalid = items.length === 0;

  const MIN_ANIM_COUNT = 30;
  const MAX_ANIM_COUNT = 50;
  const TOTAL_ANIM_TIME = 9000;

  let flashing = false;

  const minimizeDelta = (delta, length) => {
    const alternates = [delta - length, delta, delta + length];
    const distances = alternates.map(Math.abs);

    const minDist = Math.min(...distances);
    return alternates[distances.lastIndexOf(minDist)];
  };

  let isGenerating = false;
  const generate = async () => {
    if (isGenerating) return;
    isGenerating = true;

    let index = Math.floor(Math.random() * items.length);
    let randomAnimCount =
      Math.floor(Math.random() * (MAX_ANIM_COUNT - MIN_ANIM_COUNT + 1)) + MIN_ANIM_COUNT;
    let randomAnimFinalIndex = positiveMod(pickedIndex + randomAnimCount, items.length);
    let delta = index - randomAnimFinalIndex;

    let animCount = randomAnimCount + minimizeDelta(delta, items.length);
    console.debug("Animation count:", animCount);

    let overshoot = Math.random();
    console.debug("Overshoot:", overshoot);
    if (overshoot > 0.5) animCount--;

    const getOpacity = (index) =>
      ANIMATION_OPACITIES[positiveMod(index, ANIMATION_OPACITIES.length)];
    const ease = (x) => easeInExpo(x / (animCount + overshoot));
    for (let i = 1; i <= animCount; i++) {
      const animationDuration = TOTAL_ANIM_TIME * (ease(i) - ease(i - 1));

      const animations = [
        anime({
          targets: animationSelctor,
          translateY: "-100%",
          duration: animationDuration,
          easing: "linear"
        }).finished,
        anime({
          targets: animationSelctor,
          opacity: (_, i) => getOpacity(i - 1),
          duration: animationDuration * 0.8,
          delay: animationDuration * 0.1,
          easing: "easeInOutExpo"
        }).finished
      ];
      await Promise.all(animations);
      pickedIndex++;
      resetStyles();
    }

    const overshootDuration = TOTAL_ANIM_TIME * (ease(animCount + overshoot) - ease(animCount));
    console.debug("Overshoot Duration", overshootDuration);
    await anime({
      targets: animationSelctor,
      translateY: `-${overshoot * 100}%`,
      opacity: (_, i) => (getOpacity(i - 1) - getOpacity(i)) * overshoot + getOpacity(i),
      duration: overshootDuration,
      easing: "linear"
    }).finished;

    // await sleep(150);
    await anime({
      targets: animationSelctor,
      translateY: overshoot > 0.5 ? "-100%" : "0%",
      opacity: (_, i) => (overshoot > 0.5 ? getOpacity(i - 1) : getOpacity(i)),
      duration: 300,
      easing: "easeOutElastic"
    }).finished;

    if (overshoot > 0.5) pickedIndex++;
    resetStyles();

    console.debug("Randomized result:", items[index]);
    $config.pickedIndex = index;

    await sleep(200); // wait *before* flashing
    isGenerating = false;

    flashing = true;
    anime({
      targets: "#roller > span:nth-of-type(4)",
      scale: 1.5,
      direction: "alternate",
      duration: 150,
      easing: "easeInQuad"
    });
    await sleep(200);
    flashing = false;
  };

  const easeInExpo = (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const shuffle = () => {
    const originalItem = items[positiveMod(pickedIndex, items.length)];
    shuffleArray(items);
    $config.inputText = items.join("\n");

    pickedIndex = Math.max(items.indexOf(originalItem), 0);
    $config.pickedIndex = pickedIndex;
  };

  const animationSelctor = "#roller > span";
  const ANIMATION_OPACITIES = [0, 0.15, 0.25, 1, 0.25, 0.15, 0];
  const resetStyles = () =>
    anime.set(animationSelctor, {
      translateY: 0,
      opacity: (_, i) => ANIMATION_OPACITIES[i]
    });
</script>

<div class={twMerge("mb-4", PAGE_PADDING)}>
  <h2 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
    // List: Minimal
  </h2>
  <h1 class="text-2xl font-bold sm:text-3xl">Random picker</h1>
</div>
<div
  class={twMerge(
    "mx-auto my-1 flex w-full flex-col justify-center gap-8 sm:my-4 sm:flex-row sm:items-start",
    PAGE_PADDING
  )}
>
  <div class="mt-1">
    <div
      class={twMerge(
        "relative flex flex-col items-center justify-center",
        "h-52 w-full overflow-hidden rounded-xl border bg-white p-6 shadow sm:h-72 sm:w-80",
        "dark:border-0 dark:bg-gray-800 dark:shadow-2xl"
      )}
      id="roller"
    >
      <div
        class="absolute top-1/2 h-12 w-full -translate-y-1/2 border-y bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 md:h-16"
      />
      {#each [-3, -2, -1, 0, 1, 2, 3] as offset}
        <span
          class={twMerge(
            "max-w-[80%] shrink-0 truncate py-2 text-2xl font-medium md:py-3 md:text-3xl",
            "transition-colors duration-100 ease-out",
            offset === 0 && flashing && "text-primary-600 dark:text-primary-400"
          )}
          aria-hidden={offset !== 0}
        >
          {items[positiveMod(pickedIndex + offset, items.length)] ?? ""}
        </span>
      {/each}
    </div>
    <Button on:click={generate} class="mt-4 w-full sm:mb-8" disabled={isInvalid || isGenerating}>
      Generate
    </Button>
  </div>
  <div class="relative flex-grow">
    <label class="block">
      <span class="mb-1 block font-medium">Items</span>
      <textarea
        cols="30"
        rows="8"
        {placeholder}
        class={twMerge(
          "block w-full rounded border bg-white px-3 py-2 leading-relaxed shadow-sm",
          "outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50",
          "placeholder:text-gray-300 dark:placeholder:text-gray-500",
          "dark:border-transparent dark:bg-gray-800 dark:shadow focus-visible:dark:border-primary-500"
        )}
        bind:value={$config.inputText}
      />
    </label>
    <Button
      on:click={shuffle}
      colored={false}
      class="absolute bottom-3 right-3 p-2 shadow dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:active:bg-gray-700"
      label="Shuffle items"
    >
      <Icon src={Shuffle} class="h-5 w-5 fill-current" theme="round" />
    </Button>
  </div>
</div>
<div class={twMerge("mt-8", PAGE_PADDING)}>
  <h1 class="mb-4 text-xl font-bold">More generators</h1>
  <Tools exclude="list" />
</div>
