import React from 'react'

import Account from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { NFTokenCreateOfferInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenCreateOfferInstructions>) => {
  const { offerID, account, amount, tokenID, isSellOffer, owner } =
    data?.instructions

  return (
    <>
      <SimpleRow label="Offer ID" className="dt" data-test="offer-id">
        {offerID}
      </SimpleRow>
      <div data-test="buyer-or-seller">
        <SimpleRow
          label={isSellOffer ? 'Seller' : 'Buyer'}
          className="account"
          data-test="buyer-or-seller-account"
        >
          <Account account={account} />
        </SimpleRow>
      </div>
      {!isSellOffer && (
        <SimpleRow label="Owner" className="account" data-test="owner">
          <Account account={owner} />
        </SimpleRow>
      )}
      <SimpleRow label="Token ID" className="dt" data-test="token-id">
        {tokenID}
      </SimpleRow>
      <SimpleRow label="Amount" data-test="amount">
        <Amount value={amount} displayIssuer />
      </SimpleRow>
    </>
  )
}
