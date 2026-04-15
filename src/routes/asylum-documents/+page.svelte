<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
</script>

<section class="stack">
	<p class="eyebrow">Route-specific: asylum</p>
	<div class="card stack">
		<h1>Do you have any documents about your asylum or protection case?</h1>
		<p>Do you have any documents about your asylum or protection case?</p>
		<p class="hint">For example, a filing receipt, case document, letter or notification.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				<label class="option"
					><input type="radio" name="asylumCaseDocuments" value="yes" checked={value === 'yes'}>
					<span>Yes</span></label
				>
				<label class="option"
					><input type="radio" name="asylumCaseDocuments" value="no" checked={value === 'no'}>
					<span>No</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="asylumCaseDocuments"
						value="not_sure"
						checked={value === 'not_sure'}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/five-month-stay">Back</a>
			</div>
		</form>
	</div>
</section>
