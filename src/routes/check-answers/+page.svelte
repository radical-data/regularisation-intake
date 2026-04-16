<script lang="ts">
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

	<div class="card stack">
		<h1>{tt('pages.check_answers.title')}</h1>
		<p class="hint">{tt('pages.check_answers.hint')}</p>

		<div class="check-list">
			{#each data.answers as answer}
				<section class="check-row" aria-label={answer.label}>
					<div class="stack">
						<h2>{answer.label}</h2>
						<p>{answer.value}</p>
					</div>
					<a class="button secondary" href={answer.changeHref}
						>{tt('pages.check_answers.change')}</a
					>
				</section>
			{/each}
		</div>

		<div class="actions">
			<a class="button" href="/result">{tt('pages.check_answers.see_result')}</a>
			<a class="button secondary" href={data.backHref}>{tt('pages.check_answers.back')}</a>
		</div>
	</div>
</section>
