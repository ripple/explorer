import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenBurnInstructions } from './types'
import { NFTokenLink } from '../../NFTokenLink'
import { Account } from '../../Account'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenBurnInstructions>) => {
  const { tokenID, owner } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
        <NFTokenLink tokenID={tokenID} />
      </SimpleRow>
      {owner && (
        <SimpleRow label={t('owner')} data-test="owner">
          <Account account={owner} />
        </SimpleRow>
      )}
    </>
  )
}
