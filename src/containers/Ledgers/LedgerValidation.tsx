import { Dispatch, SetStateAction, memo, useState } from 'react'
import { ValidationStream } from '../shared/useStreams'
import Tooltip from '../shared/components/Tooltip'

function areEqual(prevProps: any, nextProps: any) {
  return prevProps.selected === nextProps.selected
}

export const LedgerValidation = memo(
  ({
    validation,
    vhsData,
    isTrusted,
    time,
    selected,
    setSelected,
  }: {
    validation: ValidationStream
    vhsData: any
    isTrusted: boolean
    time: number
    selected: string
    setSelected: Dispatch<SetStateAction<string>>
  }) => {
    const pubkey = validation.validation_public_key
    const trusted = isTrusted ? 'trusted ' : ''
    const partial = validation.full ? '' : 'partial '
    const selectedPart =
      selected === validation.validation_public_key ? 'selected ' : ''
    const unselectedPart =
      selected && selected !== validation.validation_public_key
        ? 'unselected '
        : ''
    const className = `validation ${selectedPart}${unselectedPart}${trusted}${partial}${pubkey}`
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
          onClick={() => {
            if (selected === '') {
              setSelected(validation.validation_public_key)
            } else {
              setSelected('')
            }
          }}
        >
          {text}
        </div>
        <Tooltip data={tooltip} />
      </>
    )
  },
  areEqual,
)
