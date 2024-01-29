import classNames from 'classnames'
import { useSelectedValidator } from './useSelectedValidator'
import { useTooltip } from '../shared/components/Tooltip'
import { useVHSValidators } from '../shared/components/VHSValidators/VHSValidatorsContext'

export const LedgerEntryValidation = ({
  validation,
  index,
}: {
  validation: any
  index: number
}) => {
  const { showTooltip, hideTooltip } = useTooltip()
  const { selectedValidator, setSelectedValidator } = useSelectedValidator()
  const { validators } = useVHSValidators()
  const className = classNames(
    'validation',
    validators?.[validation.validation_public_key]?.unl && 'trusted',
    selectedValidator && 'unselected',
    selectedValidator === validation.validation_public_key && 'selected',
  )

  return (
    <div
      role="button"
      tabIndex={index}
      className={className}
      onMouseOver={(e) =>
        showTooltip('validator', e, {
          ...validation,
          v: validators?.[validation.validation_public_key],
        })
      }
      onFocus={() => {}}
      onKeyUp={() => {}}
      onMouseLeave={() => hideTooltip()}
      onClick={() =>
        setSelectedValidator(
          selectedValidator &&
            selectedValidator === validation.validation_public_key
            ? undefined
            : validation.validation_public_key,
        )
      }
    >
      {validation.partial && <div className="partial" />}
    </div>
  )
}
