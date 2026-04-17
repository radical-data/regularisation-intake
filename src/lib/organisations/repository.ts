import organisationsData from './data/organisations.json'
import type { OrganisationDirectoryFilters, OrganisationRecord } from './types'

const clean = (value: string | null | undefined) => {
	if (!value) return undefined
	const trimmed = value.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim()
	return trimmed.length > 0 ? trimmed : undefined
}

const normaliseOrganisation = (entry: OrganisationRecord): OrganisationRecord => ({
	id: entry.id,
	name: entry.name.trim(),
	website: clean(entry.website) ?? null,
	location: clean(entry.location) ?? null,
	phone: clean(entry.phone) ?? null,
	email: clean(entry.email) ?? null,
	openingHours: clean(entry.openingHours) ?? null
})

const records = (organisationsData as OrganisationRecord[]).map(normaliseOrganisation)

const searchableText = (entry: OrganisationRecord) =>
	[entry.name, entry.location ?? '', entry.email ?? '', entry.phone ?? '', entry.website ?? '']
		.join(' ')
		.toLowerCase()

export const getAllOrganisations = () => records

export const filterOrganisations = (filters: OrganisationDirectoryFilters) => {
	const q = filters.q.trim().toLowerCase()
	return records.filter((entry) => {
		if (q && !searchableText(entry).includes(q)) {
			return false
		}
		return true
	})
}

export const getDirectorySummary = (items: OrganisationRecord[]) => {
	const withWebsite = items.filter((entry) => entry.website).length
	const withPhone = items.filter((entry) => entry.phone).length
	const withEmail = items.filter((entry) => entry.email).length
	return {
		total: items.length,
		withWebsite,
		withPhone,
		withEmail
	}
}
