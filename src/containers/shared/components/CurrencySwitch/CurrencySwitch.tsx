import { FC } from 'react'
import './styles.scss'

/** A two-option switch for toggling between currency display modes. */
interface CurrencySwitchProps {
  /** Label shown on the left side of the switch */
  leftLabel: string
  /** Label shown on the right side of the switch */
  rightLabel: string
  /** The currently selected value (must match leftLabel or rightLabel) */
  selected: string
  /** Called with the other value when the switch is toggled */
  onChange: (value: string) => void
}

export const CurrencySwitch: FC<CurrencySwitchProps> = ({
  leftLabel,
  rightLabel,
  selected,
  onChange,
}) => {
  const isRight = selected === rightLabel

  return (
    <div className="currency-switch">
      <span className={`currency-label ${!isRight ? 'active' : ''}`}>
        {leftLabel}
      </span>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="toggle-switch" aria-label="Toggle currency">
        <input
          type="checkbox"
          checked={isRight}
          onChange={() => onChange(isRight ? leftLabel : rightLabel)}
        />
        <span className="toggle-slider" />
      </label>
      <span className={`currency-label ${isRight ? 'active' : ''}`}>
        {rightLabel}
      </span>
    </div>
  )
}
