<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { Writable } from 'svelte/store';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;

	const scrollBack = getContext<Writable<Element | null>>('scroll-back');
	const scrollTo = getContext<(dest: string) => Promise<void>>('scroll-to');

	const handleLink = (e: MouseEvent, dest: string) => {
		if (e.target instanceof Element) {
			scrollBack.set(e.target);
		}
		scrollTo(dest);
	};
</script>

{#await page.getAnnotations() then annotations}
	<div class="container" role="link" tabindex="-1">
		{#each annotations.filter((a) => a.annotationType === 2) as annotation}
			{@const rect = viewport.convertToViewportRectangle(annotation.rect)}
			{@const left = rect[0]}
			{@const top = rect[3]}
			{@const height = rect[1] - top}
			{@const width = rect[2] - left}
			<a
				href={annotation.url ? annotation.url : `#${annotation.dest}`}
				on:click={(e) => handleLink(e, annotation.dest)}
			>
				<div
					class="annotation"
					style="left: {left}px; top: {top}px; width: {width}px; height: {height}px;"
				/>
			</a>
		{/each}
	</div>
{/await}

<style>
	.annotation {
		position: absolute;
		background-color: green;
		opacity: 0.1;
	}

	.annotation:hover {
		background-color: red;
		opacity: 0.1;
	}
</style>
