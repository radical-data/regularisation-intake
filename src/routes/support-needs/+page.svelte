<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Support needs</p>
	<div class="card stack">
		<h1>What kind of help would be most useful?</h1>
		<p>What kind of help would be most useful?</p>
		<p class="hint">Choose all that apply.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<fieldset class="question-group">
				<legend>Choose all that apply</legend>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="another_language"
						checked={checked('another_language')}
					><span>Help in another language</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="in_person_help"
						checked={checked('in_person_help')}
					><span>In-person help</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="help_using_phone_or_computer"
						checked={checked('help_using_phone_or_computer')}
					><span>Help using a phone or computer</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="help_scanning_or_printing"
						checked={checked('help_scanning_or_printing')}
					><span>Help scanning or printing papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="help_gathering_papers"
						checked={checked('help_gathering_papers')}
					><span>Help understanding which papers to gather</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="specialist_advice"
						checked={checked('specialist_advice')}
					><span>Specialist advice</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="supportNeeds"
						value="not_sure"
						checked={checked('not_sure')}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/referral">Back</a>
			</div>
		</form>
	</div>
</section>
