<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
const options = [
	{ value: 'self', label: 'Myself' },
	{ value: 'someone_else', label: 'Someone else, with their permission' },
	{ value: 'support_worker', label: "I'm a support worker or volunteer" }
]
</script>

<section class="stack">
	<p class="eyebrow">Session setup</p>
	<div class="card stack">
		<h1>Who are you filling this in for?</h1>
		<p>Who are you filling this in for?</p>
		<p class="hint">Choose the option that best matches this session.</p>
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
							name="completionMode"
							value={option.value}
							checked={value === option.value}
						><span>{option.label}</span></label
					>
				{/each}
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/language">Back</a>
			</div>
		</form>
	</div>
</section>
