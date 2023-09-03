<script lang="ts">
	import { getContext } from 'svelte';
	import Icon from '@iconify/svelte';
	import type { Writable } from 'svelte/store';

	const scrollBack = getContext<Writable<Element | null>>('scroll-back');

	const scroll = () => {
		if ($scrollBack) {
			$scrollBack.scrollIntoView();
			$scrollBack = null;
		}
	};
</script>

{#if $scrollBack}
	<button on:click={() => scroll()}
		><Icon class="icon" icon="mdi-light:arrow-up" style="font-size: 3em;" /></button
	>
{/if}

<style>
	button {
		cursor: pointer;
		position: fixed;
		bottom: 20px;
		right: 30px;
		padding: 1em;
		border: none;
		background-color: #7bed9f;
		box-shadow: 2px;
		transition: background-color 0.3s, transform 0.2s;
		border-radius: 100%;
	}

	button:hover {
		background-color: #63d89e;
	}

	button:active {
		background-color: #52c98e;
		transform: translateY(2px);
	}
</style>
