import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenCancelOfferInstructions } from './types'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenLink } from '../../NFTokenLink'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenCancelOfferInstructions>) => {
  const { cancelledOffers } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      {cancelledOffers.map(({ amount, offerID, tokenID, offerer }) => (
        <>
          <SimpleRow
            label={t('offer_index')}
            className="dt"
            data-testid="offer-id"
          >
            {offerID}
          </SimpleRow>
          <SimpleRow
            label={t('token_id')}
            className="dt"
            data-testid="token-id"
          >
            <NFTokenLink tokenID={tokenID} />
          </SimpleRow>
          <SimpleRow label={t('amount')} data-testid="offer-amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
          <SimpleRow label={t('offerer')} data-testid="offerer">
            <Account account={offerer} />
          </SimpleRow>
        </>
      ))}
    </>
  )
}
