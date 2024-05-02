import { sha512 } from '@xrplf/isomorphic/sha512'
import { hexToBytes, bytesToHex, stringToHex } from '@xrplf/isomorphic/utils'
import axios from 'axios'

import { localizeDate } from './utils'

const cachedAmendmentIDs: any = {}
let cachedRippledVersions: any = {}

const ACTIVE_AMENDMENT_REGEX = /^\s*REGISTER_F[A-Z]+\s*\((\S+),\s*.*$/
const RETIRED_AMENDMENT_REGEX = /^ .*retireFeature\("(\S+)"\)[,;].*$/
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

async function fetchAmendmentNames() {
  const response = await axios.get(
    'https://raw.githubusercontent.com/ripple/rippled/develop/src/ripple/protocol/impl/Feature.cpp',
  )
  const text = response.data

  const amendmentNames: string[] = []
  text.split('\n').forEach((line: string) => {
    const name = line.match(ACTIVE_AMENDMENT_REGEX)
    if (name) {
      amendmentNames.push(name[1])
    } else {
      const name2 = line.match(RETIRED_AMENDMENT_REGEX)
      name2 && amendmentNames.push(name2[1])
    }
  })
  return amendmentNames
}

function sha512Half(bytes: Uint8Array) {
  return bytesToHex(sha512(bytes)).slice(0, 64)
}

export async function nameOfAmendmentID(id: string) {
  if (cachedAmendmentIDs[id]) {
    return cachedAmendmentIDs[id]
  }
  // The Amendment ID is the hash of the Amendment name
  const amendmentNames = await fetchAmendmentNames()
  amendmentNames.forEach((name) => {
    cachedAmendmentIDs[sha512Half(hexToBytes(stringToHex(name)))] = name
  })

  return cachedAmendmentIDs[id]
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
