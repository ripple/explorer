import { localizeNumber } from '../../shared/utils'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import Currency from '../../shared/components/Currency'
import { useLanguage } from '../../shared/hooks'
import './balance-selector.scss'
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils'

export interface BalanceSelectorProps {
  text: string
  balances: any
  onSetCurrencySelected: (currency: string) => void
  currencySelected: string
}

export const BalanceSelector = ({
  text,
  balances,
  onSetCurrencySelected,
  currencySelected,
}: BalanceSelectorProps) => {
  const language = useLanguage()
  const balanceMenuItems = Object.entries(balances).map(([currency, value]) => {
    if (currency === currencySelected) {
      return null
    }
    const options = {
      ...CURRENCY_OPTIONS,
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
    const formattedValue = localizeNumber(value, language, options) || '0.00'

    return (
      <DropdownItem
        key={currency}
        handler={() => {
          onSetCurrencySelected(currency)
        }}
      >
        <Currency currency={currency} />
        <span className="total-balance">{formattedValue}</span>
      </DropdownItem>
    )
  })
  return (
    <Dropdown title={text} className="balance-selector">
      {balanceMenuItems}
    </Dropdown>
  )
}
