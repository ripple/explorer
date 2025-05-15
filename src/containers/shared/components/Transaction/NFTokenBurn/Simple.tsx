import { useTranslation } from 'react-i18next'
import type { NFTokenBurn } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenLink } from '../../NFTokenLink'
import { Account } from '../../Account'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenBurn>) => {
  const { NFTokenID, Owner } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('token_id')} className="dt" data-testid="token-id">
        <NFTokenLink tokenID={NFTokenID} />
      </SimpleRow>
      {Owner && (
        <SimpleRow label={t('owner')} data-testid="owner">
          <Account account={Owner} />
        </SimpleRow>
      )}
    </>
  )
}
