import React, { memo } from 'react'
import { ValidationStream } from '../shared/useStreams'

export const LedgerValidation = memo(
  ({ validation }: { validation: ValidationStream }) => {
    const pubkey = validation.validation_public_key
    const className = `validation ${pubkey}`
    return (
      <div
        key={`${pubkey}-${validation.cookie}`}
        role="button"
        className={className}
      />
    )
  },
)
