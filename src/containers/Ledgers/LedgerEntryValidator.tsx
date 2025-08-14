import classNames from 'classnames'
import { useSelectedValidator } from './useSelectedValidator'
import { useTooltip } from '../shared/components/Tooltip'
import { useVHSValidators } from '../shared/components/VHSValidators/VHSValidatorsContext'
import { LedgerValidation } from '../shared/components/Streams/types'

export const LedgerEntryValidator = ({
  validation,
  index,
}: {
  validation: LedgerValidation
  index: number
}) => {
  const { validators } = useVHSValidators()
  const { showTooltip, hideTooltip } = useTooltip()
  const { selectedValidator, setSelectedValidator } = useSelectedValidator()

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
