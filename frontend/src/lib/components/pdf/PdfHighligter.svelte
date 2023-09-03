<script lang="ts">
	import { browser } from '$app/environment';
	import type {
		PDFWorker,
		PDFDocumentProxy,
		PDFDocumentLoadingTask
	} from 'pdfjs-dist/types/src/display/api';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { getDocument } from 'pdfjs-dist';
	import PageLoader from './utils/PageLoader.svelte';

	/**
	 * URL of the PDF to display
	 */
	export let src: string | URL | undefined = undefined;

	/**
	 * Zoom scale for the PDF
	 */
	export let scale: number = 1.5;

	/**
	 * PDF.js worker
	 */
	const worker = getContext<PDFWorker | undefined>('pdfjs-worker');

	/**
	 * Writable store for the PDF document, added to the context
	 */
	let currentDocument = writable<PDFDocumentProxy | null>();
	setContext('pdfjs-doc', currentDocument);

	/**
	 * Start loading the PDF
	 */
	let loadingTask: PDFDocumentLoadingTask = getDocument({ url: src, worker });
	loadingTask.promise.then((doc) => currentDocument.set(doc));

	/**
	 * Cleanup
	 */
	onDestroy(() => {
		$currentDocument?.destroy();
		$currentDocument?.cleanup(false);
	});
</script>

{#if browser}
	{#await loadingTask.promise}
		<p>Downloading</p>
	{:then document}
		{#await document.getPage(1) then firstPage}
			{@const viewport = firstPage.getViewport({ scale })}
			{#each Array.from({ length: document.numPages }, (_, i) => i + 1) as pageNumber}
				<PageLoader {viewport} {pageNumber} />
			{/each}
		{/await}
	{:catch error}
		<p>{JSON.stringify(error)}</p>
	{/await}
{:else}
	<p>Can't load on server</p>
{/if}
