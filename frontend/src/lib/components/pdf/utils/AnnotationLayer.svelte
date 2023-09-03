<script lang="ts">
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { Writable } from 'svelte/store';

	import type { Action } from 'svelte/action';
	import { getContext } from 'svelte';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;

	// const document = getContext<Writable<PDFDocumentProxy>>('pdfjs-doc');

	/**
	 * How to resolve links.
	 * 1. Look at annotation.dest
	 * 2. Search the destination with document.getDestination().then
	 * 3. Use the ref (first array item) in document.getPageIndex(ref)
	 * 4. Profit
	 */
</script>

{#await page.getAnnotations() then annotations}
	<div class="container" role="link" tabindex="-1">
		{#each annotations.filter((a) => a.annotationType === 2) as annotation}
			{@const rect = viewport.convertToViewportRectangle(annotation.rect)}
			{@const left = rect[0]}
			{@const top = rect[3]}
			{@const height = rect[1] - top}
			{@const width = rect[2] - left}
			<a href={annotation.url ? annotation.url : `#/${annotation.dest}`}>
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
