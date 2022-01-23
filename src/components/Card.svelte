<script>
	export let site;
</script>

<style>

</style>

{#each site as site}
	<div class="flex flex-row">
		<div
			class="text-lg py-2 px-2 w-full mx-2 cursor-pointer text-stone-300 hover:bg-stone-900 hover:rounded-lg hover:text-stone-100"
			onclick="location.href='{site.url}'
			">
			{site.name}
		</div>
	</div>
{/each}
