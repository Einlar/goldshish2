<script lang="ts">
	import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import viewportAction from './useViewportAction';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import Page from '../Page.svelte';

	let currentDocument = getContext<Writable<PDFDocumentProxy>>('pdfjs-doc');

	export let viewport: PageViewport;
	export let pageNumber: number;
	export let id: string;

	let page: PDFPageProxy | undefined;

	const loadPage = async () => {
		page = await $currentDocument.getPage(pageNumber);
	};
</script>

<div
	use:viewportAction
	on:enterViewport={() => loadPage()}
	{id}
	data-page-number={pageNumber}
	aria-label="Page {pageNumber}"
	role="region"
>
	{#if page}
		<Page {page} />
	{:else}
		<canvas width={viewport.width} height={viewport.height} />
	{/if}
</div>

<style>
	div {
		border: 1px solid black;
	}
</style>
