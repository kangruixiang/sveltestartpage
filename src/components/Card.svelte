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
			class="w-full px-2 py-2 mx-2 text-lg cursor-pointer text-stone-200 hover:rounded-lg hover:text-stone-100 hover:bg-stone-900"
			href='{site.url}'
			>
			{site.name}
		</a>
	</div>
{/each}
