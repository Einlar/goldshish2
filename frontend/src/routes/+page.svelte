<script>
	import { NhostClient } from '@nhost/nhost-js';
	import PdfHighligter from '$lib/components/pdf/PdfHighligter.svelte';

	export const nhost = new NhostClient({
		subdomain: 'local'
	});

	//TODO Remove hardcoded file UUID
	const url = nhost.storage.getPublicUrl({ fileId: '3eb37762-6fb1-4f77-accf-0fead38ffaf9' });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="grid">
	<div class="list" />
	<div>
		<PdfHighligter src={url} />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 3fr;
		justify-content: center;
	}

	.list {
		background-color: yellow;
	}
</style>
