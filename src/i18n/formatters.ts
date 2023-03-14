import type i18n from 'i18next'

/**
 *
 * @param value text to truncate
 * @param _lng
 * @param truncateOptions.length how many characters to show
 *
 * @example
 * Value property in translations.json: `Hello {{value, truncate(length: 3)}}`
 */
const truncate = (
  value: string,
  _lng: string | undefined,
  truncateOptions: { length: number },
) =>
  value.substring(0, truncateOptions.length) +
  (value.length > truncateOptions.length ? '&hellip;' : '')

export const configureFormatters = (instance: typeof i18n) => {
  instance.services.formatter?.add('truncate', truncate)
}
