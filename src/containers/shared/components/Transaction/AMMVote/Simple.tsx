import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { formatTradingFee } from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { amount, amount2, tradingFee, ammAccountID } = data.instructions
  const tf = formatTradingFee(tradingFee)

  return (
    <>
      {ammAccountID && (
        <SimpleRow label={t('amm_account_id')} data-testid="account_id">
          <Account account={ammAccountID} />
        </SimpleRow>
      )}
      {amount && (
        <SimpleRow label={t('asset1')} data-testid="asset1">
          <Amount value={amount} />
        </SimpleRow>
      )}
      {amount2 && (
        <SimpleRow label={t('asset2')} data-testid="asset2">
          <Amount value={amount2} />
        </SimpleRow>
      )}
      {tf && (
        <SimpleRow label={t('trading_fee')} data-testid="trading_fee">
          {tf}%
        </SimpleRow>
      )}
    </>
  )
}
