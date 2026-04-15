<script lang="ts">
interface Props {
	eyebrow?: string
	title: string
	body?: string
	hint?: string
	error?: string
	returnTo?: string
	backHref: string
	children?: import('svelte').Snippet
}

let { eyebrow, title, body, hint, error, returnTo, backHref, children }: Props = $props()
</script>

<section class="stack">
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}

	<div class="card stack">
		<h1>{title}</h1>

		{#if body}
			<p>{body}</p>
		{/if}

		{#if hint}
			<p class="hint">{hint}</p>
		{/if}

		{#if error}
			<div class="error-summary" aria-live="assertive">
				<h2>There is a problem</h2>
				<p class="error-text">{error}</p>
			</div>
		{/if}

		<form method="POST" class="stack">
			{#if returnTo}
				<input type="hidden" name="returnTo" value={returnTo}>
			{/if}

			{@render children?.()}

			<div class="actions">
				<button class="button" type="submit">Continue</button>
				<a class="button secondary" href={backHref}>Back</a>
			</div>
		</form>
	</div>
</section>
