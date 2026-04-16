<script lang="ts">
import '../app.css'
import { browser } from '$app/environment'
import { invalidateAll } from '$app/navigation'
import { getTranslator } from '$lib/content'

let { children, data } = $props()

const locale = $derived(data.locale ?? 'es')
const textDirection = $derived(data.textDirection ?? 'ltr')
const tt = $derived(getTranslator(locale))
const currentPath = $derived(data.currentPath ?? '/start')

$effect(() => {
	if (!browser) return
	document.documentElement.lang = locale
	document.documentElement.dir = textDirection
})

const languages = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'ar', label: 'العربية' },
	{ value: 'fr', label: 'Français' }
]

const getLanguageHref = (languageValue: string) =>
	`/language?set=${languageValue}&returnTo=${encodeURIComponent(currentPath)}`

const switchLanguage = async (event: MouseEvent, languageValue: string) => {
	if (!browser) return
	if (languageValue === locale) return
	event.preventDefault()
	const href = getLanguageHref(languageValue)
	try {
		const response = await fetch(href, { method: 'GET', credentials: 'same-origin' })
		if (!response.ok) throw new Error(`Language switch failed: ${response.status}`)
		await invalidateAll()
	} catch {
		window.location.href = href
	}
}
</script>

<svelte:head>
	<title>{tt('chrome.app_title')}</title>
	<meta name="description" content={tt('chrome.meta_description')}>
</svelte:head>

<div class="app-shell">
	<header class="site-header">
		<div class="site-width flex flex-wrap items-center justify-between gap-4">
			<a class="brand" href="/start">{tt('chrome.brand')}</a>
			<nav aria-label={tt('chrome.language_switcher_label')}>
				<ul class="language-list">
					{#each languages as language}
						<li>
							<a
								href={getLanguageHref(language.value)}
								aria-current={language.value === locale ? 'true' : undefined}
								onclick={(event) => switchLanguage(event, language.value)}
								>{language.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>
	<main class="site-width py-8 pb-16">{@render children()}</main>
</div>
