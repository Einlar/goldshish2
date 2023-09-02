<script lang="ts" generics="T">
	export let promise: Promise<T>;
</script>

{#await promise}
	<p>Waiting</p>
{:then value}
	<slot {value} />
{:catch error}
	<p>Error</p>
{/await}
