<script lang="ts">
import { Label } from '$lib/components/ui/label'

interface Props {
	label?: string
	hint?: string
	error?: string
	forId?: string
	children?: import('svelte').Snippet
}

let { label, hint, error, forId, children }: Props = $props()
</script>

<div class="form-field">
	{#if label}
		<Label for={forId}>{label}</Label>
	{/if}

	{#if hint}
		<p class="hint">{hint}</p>
	{/if}

	{@render children?.()}

	{#if error}
		<p class="error-text">{error}</p>
	{/if}
</div>
