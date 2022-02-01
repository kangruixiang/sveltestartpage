<script>
	import Card from "./Card.svelte"
	export let school;
	export let personal;
	export let social;
	export let finance;
	export let colorHighlight;
	export let randomColor
</script>

<style>

</style>

<div class="flex flex-col w-full my-auto text-center md:flex-row gap-x-14">
	<div class="py-2 rounded-md grow">
		<div
			class="card-title">
			Wake
		</div>
		<Card site = {school} randomColor = {randomColor}/>
	</div>
	<div class="py-2 rounded-md grow">
		<div class="card-title">
			Personal
		</div>
		<Card site = {personal}	/>
	</div>
	<div class="py-2 rounded-md grow">
		<div class="card-title">
			Social
		</div>
		<Card site = {social}	/>
	</div>
	<div class="py-2 rounded-md grow">
		<div class="card-title">
			Finance
		</div>
		<Card site = {finance}	/>
	</div>
</div>
