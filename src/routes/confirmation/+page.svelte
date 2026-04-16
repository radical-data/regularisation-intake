<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { getTranslator } from '$lib/content'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
const submittedAt = $derived(
	new Date(data.submittedAt).toLocaleString(data.locale ?? 'es', {
		timeZone: 'Europe/Madrid'
	})
)
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.confirmation.eyebrow')}</p>
	<div class="app-card stack">
		<h1>{tt('pages.confirmation.title')}</h1>
		<p>{tt('pages.confirmation.body')}</p>
		<div class="stack">
			<p><strong>{tt('pages.confirmation.reference_number')}:</strong> {data.sessionId}</p>
			<p>
				<strong>{tt('pages.confirmation.updated')}:</strong>
				{submittedAt}
			</p>
		</div>
		<p class="hint">{tt('pages.confirmation.hint')}</p>
		<div class="actions">
			<Button href="/check-answers">{tt('pages.confirmation.action.view_answers')}</Button>
			<Button href="/result" variant="outline"
				>{tt('pages.confirmation.action.back_to_result')}</Button
			>
			<Button href="/start?new=1" variant="outline"
				>{tt('pages.confirmation.action.start_again')}</Button
			>
		</div>
	</div>
</section>
