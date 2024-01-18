import { useSelectedValidator } from './useSelectedValidator'
import { useTooltip } from '../shared/components/Tooltip'

export const LedgerEntryValidator = ({
  validator,
  index,
}: {
  validator: any
  index: number
}) => {
  const { showTooltip, hideTooltip } = useTooltip()
  const { selectedValidator, setSelectedValidator } = useSelectedValidator()

  const trusted = validator.unl ? 'trusted' : ''
  const unselected = selectedValidator ? 'unselected' : ''
  const selected = selectedValidator === validator.pubkey ? 'selected' : ''
  const className = `validation ${trusted} ${unselected} ${selected} ${validator.pubkey}`
  const partial = validator.partial ? <div className="partial" /> : null

  return (
    <div
      key={`${validator.pubkey}_${validator.cookie}`}
      role="button"
      tabIndex={index}
      className={className}
      onMouseOver={(e) =>
        showTooltip('validator', e, { ...validator, v: validator })
      }
      onFocus={() => {}}
      onKeyUp={() => {}}
      onMouseLeave={() => hideTooltip()}
      onClick={() =>
        setSelectedValidator(
          selectedValidator === validator.pubkey ? undefined : validator.pubkey,
        )
      }
    >
      {partial}
    </div>
  )
}
