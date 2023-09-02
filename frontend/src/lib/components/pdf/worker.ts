import { browser } from '$app/environment';
import { PDFWorker } from 'pdfjs-dist';
import { onDestroy, setContext } from 'svelte';

/**
 * Adapted from https://github.com/gtm-nayan/svelte-pdfjs/blob/main/src/lib/utils/vite.ts
 */
export const setPdfJsContext = () => {
	if (browser) {
		const worker = new PDFWorker({
			port: new Worker(
				new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url)
			) as unknown as null
		});
		setContext('pdfjs-worker', worker);
		onDestroy(() => worker.destroy());
	}
};
