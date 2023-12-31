import { get } from "svelte/store";

export const PAGE_PADDING = "px-6 sm:px-8";

export const sleep = (ms) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export const mapToRange = (value, startFrom, endFrom, startTo, endTo) => {
  if (endFrom - startFrom === 0) return endTo;
  else return startTo + ((value - startFrom) * (endTo - startTo)) / (endFrom - startFrom);
};

export const positiveMod = (a, b) => ((a % b) + b) % b;

export const capitalizeFirst = (text) => (text ? text[0].toUpperCase() + text.slice(1) : "");
