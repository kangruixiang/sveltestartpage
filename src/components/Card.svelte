<script>
	export let site;
</script>

<style>

</style>

{#each site as site}
	<div class="flex flex-row">
		<a
			class="text-lg py-2 px-2 w-full mx-2 cursor-pointer text-stone-300 hover:bg-stone-900 hover:rounded-lg hover:text-stone-100"
			href='{site.url}'
			>
			{site.name}
		</a>
	</div>
{/each}
