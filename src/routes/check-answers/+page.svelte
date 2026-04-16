<script lang="ts">
import { Button } from '$lib/components/ui/button'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'

let {
	data
}: {
	data: {
		locale?: Locale
		backHref: string
		answers: Array<{ label: string; value: string; changeHref: string }>
	}
} = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.check_answers.eyebrow')}</p>

	<div class="app-card stack">
		<h1>{tt('pages.check_answers.title')}</h1>
		<p class="hint">{tt('pages.check_answers.hint')}</p>

		<div class="check-list">
			{#each data.answers as answer}
				<section class="check-row" aria-label={answer.label}>
					<div class="stack">
						<h2>{answer.label}</h2>
						<p>{answer.value}</p>
					</div>
					<Button href={answer.changeHref} variant="outline"
						>{tt('pages.check_answers.change')}</Button
					>
				</section>
			{/each}
		</div>

		<div class="actions">
			<Button href="/result">{tt('pages.check_answers.see_result')}</Button>
			<Button href={data.backHref} variant="outline">{tt('pages.check_answers.back')}</Button>
		</div>
	</div>
</section>
