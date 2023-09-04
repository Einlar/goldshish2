<script lang="ts">
	let visible = false;

	let width = 0,
		height = 0;
	let position = { top: 0, left: 0 };

	//TODO Improve
	const showTooltip = () => {
		const selection = document.getSelection();
		console.log({ selection });
		const selectedText = selection?.toString().trim();

		visible = selectedText?.length !== 0;

		console.log(selection?.getRangeAt(0));

		const anchor = selection?.anchorNode?.parentElement;
		const focus = selection?.focusNode?.parentElement;

		if (anchor && focus) {
			// Avoid the tooltip jumping when dragging the mouse to some white space, which causes the focus to be the container div, moving the tooltip to the top of the current PDF page
			const elements = [anchor, focus].filter((el) => el.nodeName === 'SPAN');
			const bboxes = elements.map((el) => el.getBoundingClientRect());

			const top = Math.min(...bboxes.map((bbox) => bbox.top));
			const left = Math.min(...bboxes.map((bbox) => bbox.left));

			position = {
				top: top + window.scrollY,
				left: left + window.scrollX - width - 20
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
	bind:clientHeight={height}
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
