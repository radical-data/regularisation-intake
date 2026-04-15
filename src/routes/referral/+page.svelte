<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
</script>

<section class="stack">
	<p class="eyebrow">Optional referral</p>
	<div class="card stack">
		<h1>Do you want help with the next step?</h1>
		<p>
			Based on your result, you might want help gathering papers, speaking to a specialist, or
			making your application.
		</p>
		<p class="hint">
			The next step could be gathering papers, speaking to a specialist, or applying.
		</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				<label class="option"
					><input
						type="radio"
						name="referralChoice"
						value="contact_me"
						checked={value === 'contact_me'}
					><span>Yes, I'd like someone to contact me</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="referralChoice"
						value="show_options"
						checked={value === 'show_options'}
					><span>Yes, show me support options near me</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="referralChoice"
						value="no_thanks"
						checked={value === 'no_thanks'}
					><span>No, I'll keep this for now</span></label
				>
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/result">Back</a>
			</div>
		</form>
	</div>
</section>
