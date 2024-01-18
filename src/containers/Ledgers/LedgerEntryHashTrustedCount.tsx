import { useTranslation } from 'react-i18next'
import { useTooltip } from '../shared/components/Tooltip'
import { Hash, ValidatorResponse } from './types'

export const LedgerEntryHashTrustedCount = ({
  hash,
  unlCount,
  validators,
}: {
  hash: Hash
  unlCount?: number
  validators: { [pubkey: string]: ValidatorResponse }
}) => {
  const { t } = useTranslation()
  const { hideTooltip, showTooltip } = useTooltip()
  const className = hash.trusted_count < (unlCount || 0) ? 'missed' : ''

  const getMissingValidators = () => {
    const unl = {}

    Object.keys(validators).forEach((pubkey) => {
      if (validators[pubkey].unl) {
        unl[pubkey] = false
      }
    })

    hash.validations.forEach((v) => {
      if (unl[v.pubkey] !== undefined) {
        delete unl[v.pubkey]
      }
    })

    return Object.keys(unl).map((pubkey) => validators[pubkey])
  }

  const missing =
    hash.trusted_count && className === 'missed' ? getMissingValidators() : null

  return hash.trusted_count ? (
    <span
      tabIndex={0}
      role="button"
      className={className}
      onMouseMove={(e) =>
        missing && missing.length && showTooltip('missing', e, { missing })
      }
      onFocus={() => {}}
      onKeyUp={() => {}}
      onMouseLeave={() => hideTooltip()}
    >
      <div>{t('unl')}:</div>
      <b>
        {hash.trusted_count}/{unlCount}
      </b>
    </span>
  ) : null
}
