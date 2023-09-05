<script lang="ts">
	let visible = false;

	let width = 0;
	let position = { top: 0, left: 0 };

	const showTooltip = () => {
		const selection = document.getSelection();
		const selectedText = selection?.toString().trim();
		visible = selectedText?.length !== 0;

		const range = selection?.getRangeAt(0);

		if (range) {
			// Make use of all the rects that make up the selection, not just the focus and the anchor
			const rects = Array.from(range.getClientRects());

			// Apparently, the very small rects are the ones that make the tooltip jump to the top of the page, so we exclude them (not sure why they are there in the first place though)
			const top = Math.min(...rects.filter((rect) => rect.width > 1).map((rect) => rect.top));
			const left = Math.min(...rects.filter((rect) => rect.width > 1).map((rect) => rect.left));

			position = {
				top: Math.floor(top + window.scrollY),
				left: Math.floor(left + window.scrollX - width - 20)
			};
		}
	};
</script>

<svelte:document on:selectionchange={showTooltip} />

<div
	class="tooltip"
	style="left: {position.left}px; top: {position.top}px;"
	class:hidden={!visible}
	bind:clientWidth={width}
>
	Highlight
</div>

<style>
	.tooltip {
		position: absolute;
		background-color: #333;
		color: white;
		padding: 5px;
		border-radius: 3px;
		z-index: 100;
		font-size: 15px;
	}

	.hidden {
		display: none;
	}
</style>
