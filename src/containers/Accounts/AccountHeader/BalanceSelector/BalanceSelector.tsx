import { useTranslation } from 'react-i18next'
import { Dropdown } from '../../../shared/components/Dropdown'
import { BalanceSelectorItem } from './BalanceSelectorItem'
import './balance-selector.scss'

export interface BalanceSelectorProps {
  balances: { [currency: string]: string }
  onSetCurrencySelected: (currency: string) => void
  currencySelected: string
}

export const BalanceSelector = ({
  balances,
  onSetCurrencySelected,
  currencySelected,
}: BalanceSelectorProps) => {
  const { t } = useTranslation()
  const balanceTuples = Object.entries(balances)
  const title = `${balanceTuples.length - 1} ${t('accounts.other_balances')}`

  return (
    <Dropdown title={title} className="balance-selector">
      {balanceTuples.map(([currency, value]) => {
        if (currency === currencySelected) {
          return <></>
        }

        return (
          <BalanceSelectorItem
            currency={currency}
            handler={() => {
              onSetCurrencySelected(currency)
            }}
            value={value}
          />
        )
      })}
    </Dropdown>
  )
}
