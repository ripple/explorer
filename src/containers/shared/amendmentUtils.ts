import axios from 'axios'

import { localizeDate } from './utils'

let cachedRippledVersions = new Map<string, string>()

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

export function getExpectedDate(date: string, language: string) {
  const txDate = new Date(date)

  return localizeDate(
    txDate.setDate(txDate.getDate() + 14),
    language,
    DATE_OPTIONS,
  )
}

async function fetchMinRippledVersions() {
  const response = await axios.get(
    `${process.env.VITE_DATA_URL}/amendments/info`,
  )
  const { amendments } = response.data
  const mapping = new Map<string, string>()

  amendments.forEach((amendment) => {
    if (amendment.name && amendment.rippled_version) {
      mapping.set(amendment.name, amendment.rippled_version)
    }
  })

  return mapping
}

export async function getRippledVersion(name: string) {
  if (cachedRippledVersions.get(name)) {
    return cachedRippledVersions.get(name)
  }
  cachedRippledVersions = await fetchMinRippledVersions()
  return cachedRippledVersions.get(name)
}
