<script>
	export let site;
	export let color;
	export let randomColor
	console.log('test', color)
</script>

<style>

</style>

{#each site as site}
	<div class="flex flex-row">
		<a
			class="w-full px-2 py-2 mx-2 text-lg cursor-pointer test text-stone-800 dark:text-stone-300 hover:rounded-lg hover:text-stone-100 hover:bg-blend-darken"
			href='{site.url}'
			style="background-color: {randomColor}"
			>
			{site.name}
		</a>
	</div>
{/each}
