import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { localizeNumber } from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { amount, amount2, lpTokens, ammAccountID, ePrice } = data.instructions
  const lpTokenFormatted = lpTokens?.amount
    ? localizeNumber(lpTokens.amount, 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : undefined

  return (
    <>
      {ammAccountID && (
        <SimpleRow label={t('amm_account_id')} data-testid="account_id">
          <Account account={ammAccountID} />
        </SimpleRow>
      )}
      {amount && (
        <SimpleRow label={t('asset1out')} data-testid="asset1">
          <Amount value={amount} />
        </SimpleRow>
      )}
      {amount2 && (
        <SimpleRow label={t('asset2out')} data-testid="asset2">
          <Amount value={amount2} />
        </SimpleRow>
      )}
      {ePrice && (
        <SimpleRow label={t('effective_price')} data-testid="effective_price">
          <Amount value={ePrice} />
        </SimpleRow>
      )}
      {lpTokenFormatted && (
        <SimpleRow label={t('lp_tokens')} data-testid="lp_tokens">
          {lpTokenFormatted}
        </SimpleRow>
      )}
    </>
  )
}
