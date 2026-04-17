export interface OrganisationRecord {
	id: string
	name: string
	website: string | null
	location: string | null
	phone: string | null
	email: string | null
	openingHours: string | null
}

export interface OrganisationDirectoryFilters {
	q: string
}
