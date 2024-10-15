import axios from 'axios'

import { localizeDate } from './utils'

let cachedRippledVersions: any = {}

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
    'https://raw.githubusercontent.com/XRPLF/xrpl-dev-portal/master/resources/known-amendments.md',
  )
  const text = response.data
  const mapping: any = {}

  text.split('\n').forEach((line) => {
    const found = line.match(
      /\| \[([a-zA-Z0-9_]+)\][^\n]+\| (v[0-9]*.[0-9]*.[0-9]*|TBD) *\|/,
    )
    if (found) {
      // eslint-disable-next-line prefer-destructuring
      mapping[found[1]] = found[2]
    }
  })

  return mapping
}

export async function getRippledVersion(name: string) {
  if (cachedRippledVersions[name]) {
    return cachedRippledVersions[name]
  }
  cachedRippledVersions = await fetchMinRippledVersions()
  return cachedRippledVersions[name]
}
