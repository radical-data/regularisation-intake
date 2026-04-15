<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
const options = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'ar', label: 'العربية' },
	{ value: 'fr', label: 'Français' }
]
</script>

<section class="stack">
	<p class="eyebrow">Session setup</p>
	<div class="card stack">
		<h1>Choose a language</h1>
		<p>Which language would you like to use?</p>
		<p class="hint">You can change language at any time without losing your answers.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				{#each options as option}
					<label class="option"
						><input
							type="radio"
							name="language"
							value={option.value}
							checked={value === option.value}
						><span>{option.label}</span></label
					>
				{/each}
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/start">Back</a>
			</div>
		</form>
	</div>
</section>
