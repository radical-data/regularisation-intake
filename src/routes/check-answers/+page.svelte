<script lang="ts">
let { data } = $props()
</script>

<section class="stack">
	<p class="eyebrow">Review</p>

	<div class="card stack">
		<h1>Check your answers</h1>
		<p class="hint">Check these answers before you continue. You can change any answer.</p>

		<div class="check-list">
			{#each data.answers as answer}
				<section class="check-row" aria-label={answer.label}>
					<div class="stack">
						<h2>{answer.label}</h2>
						<p>{answer.value}</p>
					</div>
					<a class="button secondary" href={answer.changeHref}>Change</a>
				</section>
			{/each}
		</div>

		<div class="actions">
			<a class="button" href="/result">See result</a>
			<a class="button secondary" href="/province">Back</a>
		</div>
	</div>
</section>
