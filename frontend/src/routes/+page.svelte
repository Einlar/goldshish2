<script>
	import { NhostClient } from '@nhost/nhost-js';
	import PdfHighligter from '$lib/components/pdf/PdfHighligter.svelte';

	export const nhost = new NhostClient({
		subdomain: 'local'
	});

	//TODO Remove hardcoded file UUID
	// const url = nhost.storage.getPublicUrl({ fileId: '3eb37762-6fb1-4f77-accf-0fead38ffaf9' });
	const url = 'https://arxiv.org/pdf/1706.03762.pdf';
</script>

<svelte:head>
	<title>PDF Viewer</title>
</svelte:head>

<div class="grid">
	<div class="list" />
	<div class="pages">
		<PdfHighligter src={url} />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 3fr;
		height: 100%;
	}

	.list {
		background-color: lightgreen;
	}

	.pages {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
