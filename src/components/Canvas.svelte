<script>
  import Card from "./Card.svelte";
  export let school, personal, social, finance;
  export let randomColor, colorVariant, textColor;
</script>

<div
  class="flex flex-col w-full my-auto text-center md:flex-row gap-x-14"
  style="color: {textColor}"
>
  <Card sites={school} {colorVariant} {textColor}>Wake</Card>
  <Card sites={personal} {colorVariant} {textColor}>Personal</Card>
  <Card sites={social} {colorVariant} {textColor}>Social</Card>
  <Card sites={finance} {colorVariant} {textColor}>Finance</Card>
</div>

<!-- <div class="py-2 rounded-md grow">
    <div class="card-title" style="border-bottom: 2px solid {textColor}">
      Wake
    </div>
    <Card site={school} {colorVariant} />
  </div>
  <div class="py-2 rounded-md grow">
    <div class="card-title">Personal</div>
    <Card site={personal} {colorVariant} />
  </div>
  <div class="py-2 rounded-md grow">
    <div class="card-title">Social</div>
    <Card site={social} {colorVariant} />
  </div>
  <div class="py-2 rounded-md grow">
    <div class="card-title">Finance</div>
    <Card site={finance} {colorVariant} />
  </div>
</div> -->
<style>
</style>
