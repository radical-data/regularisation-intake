<script lang="ts">
import MailIcon from '@lucide/svelte/icons/mail'
import MapPinIcon from '@lucide/svelte/icons/map-pin'
import PhoneIcon from '@lucide/svelte/icons/phone'
import SearchIcon from '@lucide/svelte/icons/search'
import GlobeIcon from '@lucide/svelte/icons/globe'
import Building2Icon from '@lucide/svelte/icons/building-2'
import type { OrganisationRecord } from '$lib/organisations/types'
import { Badge } from '$lib/components/ui/badge'
import { Button } from '$lib/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
import { Input } from '$lib/components/ui/input'
import { Label } from '$lib/components/ui/label'

type DirectoryData = {
	filters: { q: string }
	organisations: OrganisationRecord[]
	summary: { total: number; withWebsite: number; withPhone: number; withEmail: number }
}

let { data }: { data: DirectoryData } = $props()

const resultLabel = $derived(
	data.summary.total === 1 ? '1 organisation found' : `${data.summary.total} organisations found`
)
</script>

<svelte:head>
	<title>Find organisations | Primer Paso</title>
	<meta
		name="description"
		content="Browse collaborating organisations by name, province, and contact details."
	/>
</svelte:head>

<section class="stack">
	<p class="eyebrow">Collaborating organisations</p>
	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">Find a collaborating organisation</h1>
			<p class="lead-text">
				Browse the public directory without completing the screener. Search by name,
				location, or contact details.
			</p>
		</div>

		<form class="directory-toolbar" method="GET" action="/organisations">
			<div class="form-field">
				<Label for="directory-search">Search</Label>
				<div class="relative">
					<Input
						id="directory-search"
						name="q"
						value={data.filters.q}
						placeholder="Search by name, place, phone, email, or website"
						class="w-full pl-10"
					/>
					<SearchIcon
						class="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2"
						aria-hidden="true"
					/>
				</div>
			</div>

			<div class="directory-toolbar-actions">
				<Button type="submit">Apply filters</Button>
				<Button href="/organisations" variant="outline">Clear</Button>
			</div>
		</form>

		<div class="directory-meta">
			<Badge variant="outline">{resultLabel}</Badge>
			<Badge variant="outline">{data.summary.withWebsite} with website</Badge>
			<Badge variant="outline">{data.summary.withPhone} with phone</Badge>
			<Badge variant="outline">{data.summary.withEmail} with email</Badge>
		</div>

		{#if data.organisations.length > 0}
			<div class="directory-grid">
				{#each data.organisations as organisation (organisation.id)}
					<Card class="directory-card" size="sm">
						<CardHeader>
							<div class="flex items-start gap-3">
								<div class="rounded-full bg-secondary p-2">
									<Building2Icon class="size-4" aria-hidden="true" />
								</div>
								<div class="grid gap-2">
									<CardTitle>{organisation.name}</CardTitle>
									<div class="directory-card-list">
										{#if organisation.location}
											<p class="supporting-text inline-flex items-start gap-2">
												<MapPinIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
												<span>{organisation.location}</span>
											</p>
										{/if}
										{#if organisation.phone}
											<p class="supporting-text inline-flex items-start gap-2">
												<PhoneIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
												<span>{organisation.phone}</span>
											</p>
										{/if}
										{#if organisation.email}
											<p class="supporting-text inline-flex items-start gap-2">
												<MailIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
												<span>{organisation.email}</span>
											</p>
										{/if}
										{#if organisation.openingHours}
											<p class="supporting-text">{organisation.openingHours}</p>
										{/if}
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div class="directory-meta">
								{#if organisation.website}
									<Badge variant="outline">website available</Badge>
								{/if}
								{#if organisation.phone}
									<Badge variant="outline">phone available</Badge>
								{/if}
								{#if organisation.email}
									<Badge variant="outline">email available</Badge>
								{/if}
							</div>
						</CardContent>
						<CardFooter class="gap-3">
							{#if organisation.website}
								<Button href={organisation.website} target="_blank" rel="noreferrer" variant="secondary">
									Visit website
									<GlobeIcon class="size-4" />
								</Button>
							{/if}
							{#if organisation.email}
								<Button href={`mailto:${organisation.email}`} variant="outline">Email</Button>
							{/if}
							{#if organisation.phone}
								<Button href={`tel:${organisation.phone}`} variant="outline">Call</Button>
							{/if}
						</CardFooter>
					</Card>
				{/each}
			</div>
		{:else}
			<div class="panel-subtle section-block">
				<h2 class="section-title">No organisations match these filters</h2>
				<p class="supporting-text">
					Try a broader search or browse the full directory.
				</p>
				<div class="actions">
					<Button href="/organisations" variant="outline">Browse all organisations</Button>
				</div>
			</div>
		{/if}

		<div class="panel-subtle section-block">
			<h2 class="section-title">Need personalised guidance first?</h2>
			<p class="supporting-text">
				If you are not sure where to start, use the screener and then come back to the directory.
			</p>
			<div class="actions">
				<Button href="/start">Start the screener</Button>
			</div>
		</div>
	</div>
</section>
