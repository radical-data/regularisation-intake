<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Specialist flag</p>
	<div class="card stack">
		<h1>Is there anything that might mean you need specialist advice before applying?</h1>
		<p>Is there anything that might mean you need specialist advice before applying?</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose all that apply</legend>
				<label class="option"
					><input
						type="checkbox"
						name="specialistFlags"
						value="criminal_record_worry"
						checked={checked('criminal_record_worry')}
					><span>I'm worried about a criminal record or criminal case</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="specialistFlags"
						value="identity_missing_or_mismatch"
						checked={checked('identity_missing_or_mismatch')}
					><span>My identity papers are missing or do not match</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="specialistFlags"
						value="asylum_case_not_clear"
						checked={checked('asylum_case_not_clear')}
					><span>I'm not sure what happened with my asylum case</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="specialistFlags"
						value="want_specialist"
						checked={checked('want_specialist')}
					><span>I'd rather talk this through with a specialist</span></label
				>
				<label class="option"
					><input type="checkbox" name="specialistFlags" value="none" checked={checked('none')}>
					<span>None of these</span></label
				>
			</fieldset>
			<p class="hint">This should lead to support, not automatic rejection.</p>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/evidence-recent-months">Back</a>
			</div>
		</form>
	</div>
</section>
