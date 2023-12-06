import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '../shared/components/Tooltip'

export const LedgerUNLCount = memo(
  ({
    unlCount,
    trustedCount,
    missing,
  }: {
    unlCount: number
    trustedCount: number
    missing: string[]
  }) => {
    const { t } = useTranslation()
    const className = trustedCount < unlCount ? 'missed' : undefined
    const [tooltip, setTooltip] = useState<any | null>(null)

    const showTooltip = (event) => {
      setTooltip({
        mode: 'missing',
        missing,
        x: event.currentTarget.offsetLeft,
        y: event.currentTarget.offsetTop,
      })
    }

    const hideTooltip = () => setTooltip(null)

    return trustedCount ? (
      <>
        <span
          tabIndex={0}
          role="button"
          className={className}
          onMouseMove={(e) => missing.length > 0 && showTooltip(e)}
          onFocus={(_e) => {}}
          onKeyUp={(_e) => {}}
          onMouseLeave={hideTooltip}
        >
          <div>{t('unl')}:</div>
          <b>
            {trustedCount}/{unlCount}
          </b>
        </span>
        <Tooltip data={tooltip} />
      </>
    ) : null
  },
)
