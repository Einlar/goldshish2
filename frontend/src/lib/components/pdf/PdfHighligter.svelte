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
	import DownloadProgress from './utils/DownloadProgress.svelte';
	import Spinner from './utils/Spinner.svelte';
	import { page } from '$app/stores';
	import ScrollBack from './utils/ScrollBack.svelte';

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
	 * Backscrolling
	 */
	let scrollBack = writable<Element | null>(null);
	setContext('scroll-back', scrollBack);

	/**
	 * Start loading the PDF
	 */
	let loadingTask: PDFDocumentLoadingTask = getDocument({ url: src, worker });
	loadingTask.promise.then((doc) => {
		currentDocument.set(doc);
		if ($page.url.hash) scrollTo($page.url.hash.substring(1));
	});

	let progress: number = 0;
	interface Progress {
		loaded: number;
		total: number;
	}
	loadingTask.onProgress = (p: Progress) => {
		progress = p.loaded / p.total;
	};

	/**
	 * Cleanup
	 */
	onDestroy(() => {
		$currentDocument?.destroy();
		$currentDocument?.cleanup(false);
	});

	const scrollTo = async (dest: string) => {
		if (!dest) return;
		const destination = await $currentDocument!.getDestination(dest);

		if (!destination?.[0]) return;

		interface Ref {
			num: number;
			gen: number;
		}

		const ref: Ref = destination[0];

		const toPage = await $currentDocument!.getPageIndex(ref);

		document.querySelector(`#page-${toPage + 1}`)?.scrollIntoView({
			block: 'start',
			inline: 'nearest'
		});

		const page = await $currentDocument!.getPage(toPage);
		const viewport = page.getViewport({ scale });

		// See: https://github.com/mozilla/pdf.js/blob/1e7c907fbfa92b98ec8aa2546368095b97b8f56b/web/pdf_viewer.js#L1532
		const [x, y] = viewport.convertToViewportPoint(destination[2], destination[3]);

		window.scrollBy(0, y);
	};
	setContext('scroll-to', scrollTo);
</script>

{#if browser}
	{#await loadingTask.promise}
		<DownloadProgress running={true} bind:progress />
		<Spinner />
	{:then document}
		{#await document.getPage(1) then firstPage}
			{@const viewport = firstPage.getViewport({ scale })}
			{#each Array.from({ length: document.numPages }, (_, i) => i + 1) as pageNumber}
				<PageLoader id="page-{pageNumber}" {viewport} {pageNumber} />
			{/each}
			<ScrollBack />
		{/await}
	{:catch error}
		<p>{JSON.stringify(error)}</p>
	{/await}
{:else}
	<p>Can't load on server</p>
{/if}
