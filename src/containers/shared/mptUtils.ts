/**
 * MPT Metadata utilities for XLS-0089 standard validation and decoding
 * Based on xrpl.js implementation:
 * https://github.com/XRPLF/xrpl.js/blob/main/packages/xrpl/src/models/utils/mptokenMetadata.ts
 */

import { hexToString } from '@xrplf/isomorphic/utils'

const MAX_MPT_META_BYTE_LENGTH = 1024

const MPT_META_URI_FIELDS = [
  { long: 'uri', compact: 'u' },
  { long: 'category', compact: 'c' },
  { long: 'title', compact: 't' },
]

const isString = (value: unknown): value is string => typeof value === 'string'
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isHex = (value: unknown): boolean =>
  isString(value) && /^[0-9A-Fa-f]*$/u.test(value)

const MPT_META_ALL_FIELDS = [
  {
    long: 'ticker',
    compact: 't',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) || !/^[A-Z0-9]{1,6}$/u.test(value)) {
        return [
          `${this.long}/${this.compact}: should have uppercase letters (A-Z) and digits (0-9) only. Max 6 characters recommended.`,
        ]
      }

      return []
    },
  },
  {
    long: 'name',
    compact: 'n',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) || value.length === 0) {
        return [`${this.long}/${this.compact}: should be a non-empty string.`]
      }

      return []
    },
  },
  {
    long: 'icon',
    compact: 'i',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) || value.length === 0) {
        return [`${this.long}/${this.compact}: should be a non-empty string.`]
      }

      return []
    },
  },
  {
    long: 'asset_class',
    compact: 'ac',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      const MPT_META_ASSET_CLASSES = [
        'rwa',
        'memes',
        'wrapped',
        'gaming',
        'defi',
        'other',
      ]

      if (!isString(value) || !MPT_META_ASSET_CLASSES.includes(value)) {
        return [
          `${this.long}/${this.compact}: should be one of ${MPT_META_ASSET_CLASSES.join(', ')}.`,
        ]
      }
      return []
    },
  },
  {
    long: 'issuer_name',
    compact: 'in',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) || value.length === 0) {
        return [`${this.long}/${this.compact}: should be a non-empty string.`]
      }

      return []
    },
  },
  {
    long: 'desc',
    compact: 'd',
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      if (obj[this.long] === undefined && obj[this.compact] === undefined) {
        return []
      }
      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) || value.length === 0) {
        return [`${this.long}/${this.compact}: should be a non-empty string.`]
      }

      return []
    },
  },
  {
    long: 'asset_subclass',
    compact: 'as',
    required: false,
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      const value = obj[this.long] ?? obj[this.compact]
      if (
        (obj.asset_class === 'rwa' || obj.ac === 'rwa') &&
        value === undefined
      ) {
        return [
          `${this.long}/${this.compact}: required when asset_class is rwa.`,
        ]
      }

      if (obj[this.long] === undefined && obj[this.compact] === undefined) {
        return []
      }

      const MPT_META_ASSET_SUB_CLASSES = [
        'stablecoin',
        'commodity',
        'real_estate',
        'private_credit',
        'equity',
        'treasury',
        'other',
      ]
      if (!isString(value) || !MPT_META_ASSET_SUB_CLASSES.includes(value)) {
        return [
          `${this.long}/${this.compact}: should be one of ${MPT_META_ASSET_SUB_CLASSES.join(', ')}.`,
        ]
      }
      return []
    },
  },
  {
    long: 'uris',
    compact: 'us',
    required: false,
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      if (obj[this.long] === undefined && obj[this.compact] === undefined) {
        return []
      }
      const value = obj[this.long] ?? obj[this.compact]
      if (!Array.isArray(value) || value.length === 0) {
        return [`${this.long}/${this.compact}: should be a non-empty array.`]
      }

      const messages: string[] = []
      for (const uriObj of value) {
        if (
          !isRecord(uriObj) ||
          Object.keys(uriObj).length !== MPT_META_URI_FIELDS.length
        ) {
          messages.push(
            `${this.long}/${this.compact}: should be an array of objects each with uri/u, category/c, and title/t properties.`,
          )
          continue
        }

        // Check for both long and compact forms in the same URI object
        for (const uriField of MPT_META_URI_FIELDS) {
          if (
            uriObj[uriField.long] != null &&
            uriObj[uriField.compact] != null
          ) {
            messages.push(
              `${this.long}/${this.compact}: should not have both ${uriField.long} and ${uriField.compact} fields.`,
            )
            break
          }
        }

        const uri = uriObj.uri ?? uriObj.u
        const category = uriObj.category ?? uriObj.c
        const title = uriObj.title ?? uriObj.t
        if (!isString(uri) || !isString(category) || !isString(title)) {
          messages.push(
            `${this.long}/${this.compact}: should be an array of objects each with uri/u, category/c, and title/t properties.`,
          )
        }
      }
      return messages
    },
  },
  {
    long: 'additional_info',
    compact: 'ai',
    required: false,
    validate(obj: Record<string, unknown>): string[] {
      if (obj[this.long] != null && obj[this.compact] != null) {
        return [
          `${this.long}/${this.compact}: both long and compact forms present. expected only one.`,
        ]
      }

      if (obj[this.long] === undefined && obj[this.compact] === undefined) {
        return []
      }
      const value = obj[this.long] ?? obj[this.compact]
      if (!isString(value) && !isRecord(value)) {
        return [
          `${this.long}/${this.compact}: should be a string or JSON object.`,
        ]
      }

      return []
    },
  },
]

/**
 * Expands compact field names to their long form equivalents.
 * Reverse operation of shortenKeys in xrpl.js.
 *
 * @param input - Object with potentially compact field names.
 * @param mappings - Array of field mappings with long and compact names.
 * @returns Object with expanded long field names.
 */
function expandKeys(
  input: Record<string, unknown>,
  mappings: Array<{ long: string; compact: string }>,
): Record<string, unknown> {
  const output: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    const mapping = mappings.find(
      ({ long, compact }) => long === key || compact === key,
    )
    // Extra keys stays there
    if (mapping === undefined) {
      output[key] = value
      // eslint-disable-next-line no-continue
      continue
    }

    // Both long and compact forms are present
    if (
      input[mapping.long] !== undefined &&
      input[mapping.compact] !== undefined
    ) {
      output[key] = value
      // eslint-disable-next-line no-continue
      continue
    }

    output[mapping.long] = value
  }

  return output
}

/**
 * Decodes and parses hex-encoded MPTokenMetadata into an object.
 * Converts compact field names to their corresponding long-form equivalents.
 *
 * @param input - Hex encoded MPTokenMetadata.
 * @returns Parsed MPTokenMetadata object with long field names, or undefined if invalid.
 */
export function parseMPTokenMetadata(
  input: string | undefined,
): Record<string, unknown> | undefined {
  if (!input) {
    return undefined
  }

  if (!isHex(input)) {
    return undefined
  }

  let jsonMetaData: unknown
  try {
    jsonMetaData = JSON.parse(hexToString(input) || '')
  } catch {
    return undefined
  }

  if (!isRecord(jsonMetaData)) {
    return undefined
  }

  let output = jsonMetaData

  output = expandKeys(output, MPT_META_ALL_FIELDS)

  if (Array.isArray(output.uris)) {
    output.uris = output.uris.map(
      (uri: Record<string, unknown>): Record<string, unknown> => {
        if (isRecord(uri)) {
          return expandKeys(uri, MPT_META_URI_FIELDS)
        }
        return uri
      },
    )
  }

  if (Array.isArray(output.us)) {
    output.us = output.us.map(
      (uri: Record<string, unknown>): Record<string, unknown> => {
        if (isRecord(uri)) {
          return expandKeys(uri, MPT_META_URI_FIELDS)
        }
        return uri
      },
    )
  }

  return output
}

/**
 * Validates MPTokenMetadata adheres to XLS-89 standard.
 * Takes a hex-encoded metadata string as input, returns true if compliant.
 *
 * @param input - Hex encoded MPTokenMetadata.
 * @returns true if MPTokenMetadata adheres to XLS-89 standard, false otherwise.
 */
export function isMPTokenMetadataCompliant(input: string | undefined): boolean {
  // Validate input exists
  if (!input) {
    return false
  }

  // Validate hex format
  if (!isHex(input)) {
    return false
  }

  // Validate byte length
  if (input.length / 2 > MAX_MPT_META_BYTE_LENGTH) {
    return false
  }

  // Parse JSON
  let jsonMetaData: unknown
  try {
    jsonMetaData = JSON.parse(hexToString(input) || '')
  } catch {
    return false
  }

  // Validate JSON structure
  if (!isRecord(jsonMetaData)) {
    return false
  }

  if (Object.keys(jsonMetaData).length > MPT_META_ALL_FIELDS.length) {
    return false
  }

  const obj = jsonMetaData

  for (const property of MPT_META_ALL_FIELDS) {
    if (property.validate(obj).length > 0) {
      return false
    }
  }

  return true
}
