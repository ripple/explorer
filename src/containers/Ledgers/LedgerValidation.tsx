import { memo } from 'react'
import { ValidationStream } from '../shared/useStreams'

export const LedgerValidation = memo(
  ({
    validation,
    isTrusted,
  }: {
    validation: ValidationStream
    isTrusted: boolean
  }) => {
    const pubkey = validation.validation_public_key
    const trusted = isTrusted ? 'trusted ' : ''
    const partial = validation.full ? '' : 'partial '
    const className = `validation ${trusted}${partial}${pubkey}`
    return (
      <div
        key={`${pubkey}-${validation.cookie}`}
        role="button"
        className={className}
      />
    )
  },
)
