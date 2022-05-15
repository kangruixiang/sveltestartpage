<script>
  export let sites;
  export let colorVariant, textColor;
</script>

<div class="py-2 rounded-md grow" style="color: {textColor}">
  <div
    class="px-2 py-2 mx-2 my-2 text-2xl font-bold"
    style="border-bottom: 2px solid {textColor}"
  >
    <slot />
  </div>
  {#each sites as site}
    <div class="flex flex-row">
      <a
        class="w-full px-2 py-2 mx-2 text-lg cursor-pointer line hover:rounded-lg hover:bg-stone-900"
        style="--theme-color: {colorVariant}"
        href={site.url}
      >
        {site.name}
      </a>
    </div>
  {/each}
</div>

<!-- {#each sites as site}
  <div class="flex flex-row">
    <slot />
    <a
      class="w-full px-2 py-2 mx-2 text-lg cursor-pointer hover:rounded-lg hover:bg-stone-900"
      style="background-color: {colorVariant}"
      href={site.url}
    >
      {site.name}
    </a>
  </div>
{/each} -->
<style>
  .line:hover {
    background-color: var(--theme-color);
  }
</style>
