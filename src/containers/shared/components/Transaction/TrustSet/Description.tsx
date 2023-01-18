import { Trans } from 'react-i18next'
import { Account } from '../../Account'
import { normalizeAmount } from '../../../transactionUtils'
import { useLanguage } from '../../../hooks'
import { TrustSet } from './types'
import { TransactionDescriptionProps } from '../types'

export const Description = ({
  data,
}: TransactionDescriptionProps<TrustSet>) => {
  const language = useLanguage()
  const { tx } = data
  const amount = normalizeAmount(tx.LimitAmount, language)
  const { currency, issuer } = tx.LimitAmount

  return (
    <div key="trust_set">
      <Trans i18nKey="trust_set_description">
        It establishes <b>{{ amount }}</b>
        as the maximum amount of <b>{{ currency }}</b>
        from <Account account={issuer} />
        that <Account account={tx.Account} />
        is willing to hold
      </Trans>
    </div>
  )
}
