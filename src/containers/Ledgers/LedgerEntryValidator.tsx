import classNames from 'classnames'
import { useSelectedValidator } from './useSelectedValidator'
import { useTooltip } from '../shared/components/Tooltip'

export const LedgerEntryValidation = ({
  validation,
  index,
}: {
  validation: any
  index: number
}) => {
  const { showTooltip, hideTooltip } = useTooltip()
  const { selectedValidator, setSelectedValidator } = useSelectedValidator()
  const className = classNames(
    'validation',
    validation.unl && 'trusted',
    selectedValidator && 'unselected',
    selectedValidator === validation.validation_public_key && 'selected',
  )

  return (
    <div
      role="button"
      tabIndex={index}
      className={className}
      onMouseOver={(e) =>
        showTooltip('validation', e, { ...validation, v: validation })
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
