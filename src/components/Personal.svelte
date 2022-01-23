<script>
	const site = [
		{
			name: "Medhub",
			url: "https://wfbmc.medhub.com",
		},
		{
			name: "Citrix",
			url: "https://portal2.wakehealth.edu",
		},
		{
			name: "Intranet",
			url: "https://intranet.wakehealth.edu/index.htm",
		},
		{
			name: "Outlook",
			url: "https://annals-org.go.libproxy.wakehealth.edu/aim",
		},
		{
			name: "MKSAP",
			url: "https://mksap18.acponline.org/",
		},
	];
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
