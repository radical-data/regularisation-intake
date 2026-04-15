<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
</script>

<section class="stack">
	<p class="eyebrow">Route split</p>
	<div class="card stack">
		<h1>Did you apply for asylum or international protection in Spain before 1 January 2026?</h1>
		<p>Did you apply for asylum or international protection in Spain before 1 January 2026?</p>
		<p class="hint">Choose one option.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				<label class="option"
					><input type="radio" name="asylumBeforeCutoff" value="yes" checked={value === 'yes'}>
					<span>Yes</span></label
				>
				<label class="option"
					><input type="radio" name="asylumBeforeCutoff" value="no" checked={value === 'no'}>
					<span>No</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="asylumBeforeCutoff"
						value="not_sure"
						checked={value === 'not_sure'}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/residence-start">Back</a>
			</div>
		</form>
	</div>
</section>
