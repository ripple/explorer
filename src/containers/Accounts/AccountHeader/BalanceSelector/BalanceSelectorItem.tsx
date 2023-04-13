import React from 'react'
import { useLanguage } from '../../../shared/hooks'
import { CURRENCY_OPTIONS } from '../../../shared/transactionUtils'
import { localizeNumber } from '../../../shared/utils'
import { DropdownItem } from '../../../shared/components/Dropdown'
import Currency from '../../../shared/components/Currency'

export interface BalanceSelectorItemProps {
  currency: string
  handler: (currency) => void
  value: string
}

export const BalanceSelectorItem = React.memo(
  ({ currency, value, handler }: BalanceSelectorItemProps) => {
    const language = useLanguage()
    const options = {
      ...CURRENCY_OPTIONS,
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
    const formattedValue = localizeNumber(value, language, options) || '0.00'

    return (
      <DropdownItem key={currency} handler={handler}>
        <Currency currency={currency} />
        <span className="total-balance">{formattedValue}</span>
      </DropdownItem>
    )
  },
)
