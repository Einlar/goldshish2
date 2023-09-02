<script lang="ts">
	import { browser } from '$app/environment';
	import type {
		PDFWorker,
		PDFDocumentProxy,
		PDFDocumentLoadingTask
	} from 'pdfjs-dist/types/src/display/api';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Page from './Page.svelte';
	import Loader from './Loader.svelte';
	/**
	 * URL of the PDF to display
	 */
	export let src: string | URL | undefined = undefined;

	const worker = getContext<PDFWorker | undefined>('pdfjs-worker');

	let currentDocument = writable<PDFDocumentProxy | null>();
	let loadingTask: PDFDocumentLoadingTask;
	let loading = false;

	setContext('pdfjs-doc', currentDocument);

	onDestroy(() => {
		$currentDocument?.destroy();
		$currentDocument?.cleanup(false);
	});

	const loadDocument = async () => {
		const previousDocument = $currentDocument;

		const { getDocument } = await import('pdfjs-dist');
		loading = true;

		loadingTask = getDocument({ url: src, worker }); //TODO add options

		loadingTask.promise
			.then(
				(doc) => {
					previousDocument?.destroy();
					previousDocument?.cleanup();
					loading = false;
					return doc;
				},
				(err) => {
					return previousDocument;
				}
			)
			.then(currentDocument.set);
	};

	$: if (browser) {
		src, loadDocument();
	}
</script>

{#if browser}
	{#if $currentDocument}
		<p>Number of pages: {$currentDocument.numPages}</p>
		<Loader promise={$currentDocument.getPage(1)} let:value>
			<Page page={value} />
		</Loader>
	{/if}
{:else}
	<p>Server</p>
{/if}
