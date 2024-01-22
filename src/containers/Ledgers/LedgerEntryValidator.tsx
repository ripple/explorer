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
  const selected =
    selectedValidator &&
    (selectedValidator === validator.master_key ||
      selectedValidator === validator.signing_key)
      ? 'selected'
      : ''
  const className = `validation ${trusted} ${unselected} ${selected} ${validator.master_key}`
  const partial = validator.partial ? <div className="partial" /> : null

  return (
    <div
      key={`${validator.master_key}_${validator.cookie}`}
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
          selectedValidator &&
            (selectedValidator === validator.master_key ||
              selectedValidator === validator.signing_key)
            ? undefined
            : validator.master_key || validator.signing_key,
        )
      }
    >
      {partial}
    </div>
  )
}
