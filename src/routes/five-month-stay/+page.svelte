<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
</script>

<section class="stack">
	<p class="eyebrow">Core eligibility</p>
	<div class="card stack">
		<h1>Have you been living in Spain during the last 5 months?</h1>
		<p>Have you been in Spain during the last 5 months?</p>
		<p class="hint">Short trips away do not always matter.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				<label class="option"
					><input type="radio" name="fiveMonthStay" value="yes" checked={value === 'yes'}>
					<span>Yes</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="fiveMonthStay"
						value="mostly_yes"
						checked={value === 'mostly_yes'}
					><span>Mostly yes, with short absences</span></label
				>
				<label class="option"
					><input type="radio" name="fiveMonthStay" value="no" checked={value === 'no'}>
					<span>No</span></label
				>
				<label class="option"
					><input type="radio" name="fiveMonthStay" value="not_sure" checked={value === 'not_sure'}>
					<span>I'm not sure</span></label
				>
			</fieldset>
			<p class="hint">
				Official rule requires proving at least 5 months of uninterrupted stay at the time of
				application.
			</p>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/asylum-history">Back</a>
			</div>
		</form>
	</div>
</section>
