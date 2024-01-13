import { useSelectedValidator } from './useSelectedValidator'
import { useTooltip } from './useTooltip'

export const LedgerEntryValidator = ({
  validator,
  index,
}: {
  validator: any
  index: number
}) => {
  const { setTooltip } = useTooltip()
  const { selectedValidator, setSelectedValidator } = useSelectedValidator()

  const trusted = validator.unl ? 'trusted' : ''
  const unselected = selectedValidator ? 'unselected' : ''
  const selected = selectedValidator === validator.pubkey ? 'selected' : ''
  const className = `validation ${trusted} ${unselected} ${selected} ${validator.pubkey}`
  const partial = validator.partial ? <div className="partial" /> : null

  const showTooltip = (mode, event, data) => {
    setTooltip({
      ...data,
      mode,
      v: mode === 'validator' && data,
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  return (
    <div
      key={`${validator.pubkey}_${validator.cookie}`}
      role="button"
      tabIndex={index}
      className={className}
      onMouseOver={(e) => showTooltip('validator', e, validator)}
      onFocus={() => {}}
      onKeyUp={() => {}}
      onMouseLeave={() => setTooltip(undefined)}
      onClick={() => setSelectedValidator(validator.pubkey)}
    >
      {partial}
    </div>
  )
}
