import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenCreateOfferInstructions } from './types'
import { NFTokenLink } from '../../NFTokenLink'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenCreateOfferInstructions>) => {
  const { offerID, account, amount, tokenID, isSellOffer, owner, destination } =
    data.instructions
  const { t } = useTranslation()

  return (
    <>
      {offerID && (
        <SimpleRow label={t('offer_index')} data-test="offer-id">
          {offerID}
        </SimpleRow>
      )}
      <SimpleRow
        label={isSellOffer ? t('seller') : t('buyer')}
        data-test="buyer-or-seller"
      >
        <Account account={account} />
      </SimpleRow>
      {destination && (
        <SimpleRow label={t('destination')} data-test="destination">
          <Account account={destination} />
        </SimpleRow>
      )}
      {!isSellOffer && owner && (
        <SimpleRow label={t('owner')} data-test="owner">
          <Account account={owner} />
        </SimpleRow>
      )}
      <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
        <NFTokenLink tokenID={tokenID} />
      </SimpleRow>
      <SimpleRow label={t('amount')} data-test="amount">
        <Amount value={amount} displayIssuer />
      </SimpleRow>
    </>
  )
}
