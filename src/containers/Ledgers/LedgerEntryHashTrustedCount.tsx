import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useTooltip } from '../shared/components/Tooltip'
import { useVHSValidators } from '../shared/components/VHSValidators/VHSValidatorsContext'
import { LedgerValidation } from '../shared/components/Streams/types'

export const LedgerEntryHashTrustedCount = ({
  validations,
}: {
  validations: LedgerValidation[]
}) => {
  const { t } = useTranslation()
  const { hideTooltip, showTooltip } = useTooltip()
  const { unl, validators } = useVHSValidators()

  const status = useMemo(() => {
    const missing = [...(unl || [])]
    validations.forEach((v) => {
      if (!validators?.[v.validation_public_key]) {
        return
      }

      const missingIndex = missing.findIndex(
        (assumedMissing) => assumedMissing === v.validation_public_key,
      )
      if (missingIndex !== -1) {
        missing.splice(missingIndex, 1)
      }
    })

    return {
      missing: missing.map((v) => validators?.[v]),
      trustedCount: (unl?.length || 0) - missing.length,
    }
  }, [unl, validations, validators])

  return status.trustedCount ? (
    <span
      tabIndex={0}
      role="button"
      className={status.trustedCount < status.missing.length ? 'missed' : ''}
      onMouseMove={(e) => {
        const { missing } = status

        missing.length && showTooltip('missing', e, { missing })
      }}
      onFocus={() => {}}
      onKeyUp={() => {}}
      onMouseLeave={() => hideTooltip()}
    >
      <div>{t('unl')}:</div>
      <b>
        {status.trustedCount}/{unl?.length}
      </b>
    </span>
  ) : null
}
