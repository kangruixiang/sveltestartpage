<script>
	export let site;
	export let color;
	console.log('test', color)
</script>

<style>

</style>

{#each site as site}
	<div class="flex flex-row">
		<a
			class="test text-lg py-2 px-2 w-full mx-2 cursor-pointer text-stone-800 dark:text-stone-300 hover:bg-stone-900 hover:rounded-lg hover:text-stone-100"
			href='{site.url}'
			>
			{site.name}
		</a>
	</div>
{/each}
