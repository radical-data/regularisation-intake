<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Route-specific: non-asylum</p>
	<div class="card stack">
		<h1>Which of these sounds like you?</h1>
		<p>Which of these sounds like you?</p>
		<p class="hint">Choose all that apply.</p>
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
						name="nonAsylumGrounds"
						value="worked_in_spain"
						checked={checked('worked_in_spain')}
					><span>I've worked in Spain</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="nonAsylumGrounds"
						value="close_family_relevant"
						checked={checked('close_family_relevant')}
					><span>I have close family here who may be relevant to this process</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="nonAsylumGrounds"
						value="vulnerable_situation"
						checked={checked('vulnerable_situation')}
					><span>I may need support because of a difficult or vulnerable situation</span></label
				>
				<label class="option"
					><input type="checkbox" name="nonAsylumGrounds" value="none" checked={checked('none')}>
					<span>None of these</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="nonAsylumGrounds"
						value="not_sure"
						checked={checked('not_sure')}
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
