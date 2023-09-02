<script lang="ts">
	import { setPdfJsContext } from '$lib/components/pdf/worker';

	setPdfJsContext();
</script>

<slot />
