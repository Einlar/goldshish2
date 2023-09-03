<!--
    Adapted from https://saibotsivad.github.io/svelte-progress-bar/
-->

<script lang="ts">
	/**
	 * Progress value, between 0 and 1
	 */
	export let progress: number = 0;

	/**
	 * If true, the progress bar is visible
	 */
	export let running: boolean = false;

	/**
	 * Color for the progress bar
	 */
	export let color: string = 'red';

	$: barStyle = `--color: ${color};` + (progress ? `width: ${progress * 100}%;` : '');
</script>

<div class="progress-bar" class:progress-bar-hiding={!running} style={barStyle}>
	{#if running}
		<div class="progress-bar-leader" />
	{/if}
</div>

<style>
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		height: 2px;
		transition: width 0.21s ease-in-out;
		background-color: var(--color);
	}

	.progress-bar-hiding {
		transition: top 0.8s ease;
		top: -8px;
	}

	.progress-bar-leader {
		position: absolute;
		top: 0;
		right: 0;
		height: 3px;
		width: 100px;
		transform: rotate(2.5deg) translate(0px, -4px);
		box-shadow: 0 0 8px;
		z-index: 2;
	}
</style>
