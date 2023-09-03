<script lang="ts">
	import type { PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import { Util } from 'pdfjs-dist';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;

	const isText = (item: TextItem | any): item is TextItem => {
		return typeof item === 'object' && item.str !== undefined;
	};

	const getTransform = (item: TextItem): string => {
		const tx = Util.transform(
			Util.transform(viewport.transform, item.transform),
			[1, 0, 0, -1, 0, 0]
		);
		return `${tx.join(', ')}`;
	};
</script>

{#await page.getTextContent() then textContent}
	<svg width={viewport.width} height={viewport.height}>
		{#each textContent.items as textItem}
			{#if isText(textItem)}
				<text
					style="transform: matrix({getTransform(textItem)}); font-family: {textContent.styles[
						textItem.fontName
					].fontFamily}">{textItem.str}</text
				>
			{/if}
		{/each}
	</svg>
{/await}

<style>
	svg {
		font-size: 1px;
		position: absolute;
		inset: 0;
		overflow: clip;
		line-height: 1;
		opacity: 0.8;
	}
</style>
