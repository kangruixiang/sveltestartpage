<script>
	export let site;
	console.log(site)
</script>

<style>

</style>

{#each site as site}
	<div class="flex flex-row">
		<div
			class="text-lg py-2 px-2 w-full mx-2 cursor-pointer text-stone-200 hover:bg-stone-900 hover:rounded-lg"
			onclick="location.href='{site.url}'
			">
			{site.name}
		</div>
	</div>
{/each}
