<script>
	import Card from "./Card.svelte"
	export let school;
	export let personal;
	export let social;
	export let finance;
</script>

<style>

</style>

<div class="flex w-full my-auto">
	<div class="w-1/4 py-2 rounded-md mx-6">
		<div
			class="card-title">
			Wake
		</div>
		<Card site = {school}/>
	</div>
	<div class="w-1/4 py-2 rounded-md mx-6">
		<div class="card-title">
			Personal
		</div>
		<Card site = {personal}	/>
	</div>
	<div class="w-1/4 py-2 rounded-md mx-6">
		<div class="card-title">
			Social
		</div>
		<Card site = {social}	/>
	</div>
	<div class="w-1/4 py-2 rounded-md mx-6">
		<div class="card-title">
			Finance
		</div>
		<Card site = {finance}	/>
	</div>
</div>
