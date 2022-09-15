import React from 'react'

import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { NFTokenCreateOfferInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenCreateOfferInstructions>) => {
  const { offerID, account, amount, tokenID, isSellOffer, owner } =
    data?.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('offer_index')} className="dt" data-test="offer-id">
        {offerID}
      </SimpleRow>
      <div data-test="buyer-or-seller">
        <SimpleRow
          label={isSellOffer ? t('seller') : t('buyer')}
          className="account"
          data-test="buyer-or-seller-account"
        >
          <Account account={account} />
        </SimpleRow>
      </div>
      {!isSellOffer && (
        <SimpleRow
          label={t('owner_label')}
          className="account"
          data-test="owner"
        >
          <Account account={owner} />
        </SimpleRow>
      )}
      <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
        {tokenID}
      </SimpleRow>
      <SimpleRow label={t('amount')} data-test="amount">
        <Amount value={amount} displayIssuer />
      </SimpleRow>
    </>
  )
}
