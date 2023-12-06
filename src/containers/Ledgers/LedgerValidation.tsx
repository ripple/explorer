import { memo, useState } from 'react'
import { ValidationStream } from '../shared/useStreams'
import Tooltip from '../shared/components/Tooltip'

export const LedgerValidation = memo(
  ({
    validation,
    vhsData,
    isTrusted,
    time,
  }: {
    validation: ValidationStream
    vhsData: any
    isTrusted: boolean
    time: number
  }) => {
    const pubkey = validation.validation_public_key
    const trusted = isTrusted ? 'trusted ' : ''
    const partial = validation.full ? '' : 'partial '
    const className = `validation ${trusted}${partial}${pubkey}`
    const text = validation.full ? null : <div className="partial" />
    const [tooltip, setTooltip] = useState<any | null>(null)

    const showTooltip = (event) => {
      setTooltip({
        mode: 'validator',
        validation: { ...validation, ...vhsData },
        time,
        x: event.currentTarget.offsetLeft,
        y: event.currentTarget.offsetTop,
      })
    }

    const hideTooltip = () => setTooltip(null)

    return (
      <>
        <div
          key={`${pubkey}-${validation.cookie}`}
          role="button"
          tabIndex={0}
          className={className}
          onMouseOver={(e) => showTooltip(e)}
          onFocus={(_e) => {}}
          onKeyUp={(_e) => {}}
          onMouseLeave={hideTooltip}
          // onClick={() => setSelected(v.pubkey)}
        >
          {text}
        </div>
        <Tooltip data={tooltip} />
      </>
    )
  },
)
