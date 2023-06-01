import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { ammAccountID, bidMin, bidMax, authAccounts } = data.instructions

  return (
    <>
      {ammAccountID && (
        <SimpleRow label={t('amm_account_id')} data-test="account_id">
          <Account account={ammAccountID} />
        </SimpleRow>
      )}
      {bidMin && (
        <SimpleRow label={t('min_slot_price')} data-test="min_slot_price">
          <Amount value={bidMin} />
        </SimpleRow>
      )}
      {bidMax && (
        <SimpleRow label={t('max_slot_price')} data-test="max_slot_price">
          <Amount value={bidMax} />
        </SimpleRow>
      )}
      {authAccounts && (
        <SimpleRow label={t('auth_accounts')} data-test="auth_accounts">
          {authAccounts.map((accID: string) => (
            <Account account={accID} />
          ))}
        </SimpleRow>
      )}
    </>
  )
}
