<script>
	import Card from "./Card.svelte"
	export let school;
	export let personal;
	export let social;
	export let finance;
</script>

<style>

</style>

<div class="w-full flex flex-col md:flex-row my-auto text-center gap-x-14">
	<div class="grow py-2 rounded-md">
		<div
			class="card-title">
			Wake
		</div>
		<Card site = {school}/>
	</div>
	<div class="grow py-2 rounded-md">
		<div class="card-title">
			Personal
		</div>
		<Card site = {personal}	/>
	</div>
	<div class="grow py-2 rounded-md">
		<div class="card-title">
			Social
		</div>
		<Card site = {social}	/>
	</div>
	<div class="grow py-2 rounded-md">
		<div class="card-title">
			Finance
		</div>
		<Card site = {finance}	/>
	</div>
</div>
