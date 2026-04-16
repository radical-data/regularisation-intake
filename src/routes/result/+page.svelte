<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { getTranslator } from '$lib/content'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
const provinceLabel = $derived(tt(`steps.province.options.${data.province}`))
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.result.eyebrow')}</p>

	<div class="app-card stack">
		<span class="result-pill">{tt(`result.title.${data.result.resultState}`)}</span>
		<h1>{tt(`result.lead.${data.result.resultState}`)}</h1>
		<p>{tt(data.result.explanationKey)}</p>

		{#if data.result.reasonKey}
			<div class="stack">
				<h2>{tt('pages.result.why_title')}</h2>
				<p>{tt(data.result.reasonKey)}</p>
			</div>
		{/if}

		<div class="stack">
			<h2>{tt('pages.result.meaning_title')}</h2>
			<ul>
				{#each data.result.nextStepKeys as stepKey}
					<li>{tt(stepKey)}</li>
				{/each}
			</ul>
		</div>

		{#if data.result.showDocumentCta}
			<div class="stack">
				<h2>{tt('pages.result.gather_title')}</h2>
				<ul>
					<li>{tt('pages.result.gather.before_cutoff')}</li>
					<li>{tt('pages.result.gather.recent')}</li>
					<li>{tt('pages.result.gather.identity')}</li>
				</ul>
			</div>
		{/if}

		{#if data.result.showHowToApply}
			<div class="stack">
				<h2>{tt('pages.result.how_to_apply_title')}</h2>
				<p>{tt('pages.result.how_to_apply.body')}</p>
				<p class="hint">{tt('pages.result.how_to_apply.hint')}</p>
			</div>
		{/if}

		{#if data.result.showSupportCta}
			<div class="stack">
				<h2>{tt('pages.result.support_title')}</h2>
				<p>{tt('pages.result.support.body', { province: provinceLabel })}</p>
			</div>
		{/if}

		{#if data.result.flags.length > 0}
			<div class="stack">
				<h2>{tt('pages.result.flags_title')}</h2>
				<ul>
					{#each data.result.flags as flagKey}
						<li>{tt(flagKey)}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="stack">
			<h2>{tt('pages.result.reference_title')}</h2>
			<p>{tt('pages.result.reference_body', { sessionId: data.sessionId })}</p>
			<p class="hint">{tt('pages.result.reference_hint')}</p>
		</div>

		<div class="actions">
			<Button href="/referral">{tt('pages.result.action.help')}</Button>
			<Button href="/check-answers" variant="outline"
				>{tt('pages.result.action.back_to_answers')}</Button
			>
			<Button href="/start?new=1" variant="outline">{tt('pages.result.action.start_again')}</Button>
		</div>
	</div>
</section>
