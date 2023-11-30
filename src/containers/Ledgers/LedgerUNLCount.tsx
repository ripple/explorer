import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

export const LedgerUNLCount = memo(
  ({ unlCount, trustedCount }: { unlCount: number; trustedCount: number }) => {
    const { t } = useTranslation()
    const className = trustedCount < unlCount ? 'missed' : undefined
    // const missing =
    //   trustedCount && className === 'missed'
    //     ? this.getMissingValidators(hash)
    //     : null

    return trustedCount ? (
      <span tabIndex={0} role="button" className={className}>
        <div>{t('unl')}:</div>
        <b>
          {trustedCount}/{unlCount}
        </b>
      </span>
    ) : null
  },
)
