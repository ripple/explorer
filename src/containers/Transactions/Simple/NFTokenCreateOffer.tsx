import React from 'react'

import Account from '../../shared/components/Account'
import { Amount } from '../../shared/components/Amount'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'

export interface Props {
  data: {
    instructions: {
      account: string
      amount: { currency: string; amount: number; issuer: string }
      tokenID: string
      isSellOffer: boolean
      owner: string
      offerID: string
    }
  }
}

const NFTokenCreateOffer = (props: Props) => {
  const {
    data: {
      instructions: { offerID, account, amount, tokenID, isSellOffer, owner },
    },
  } = props

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

export { NFTokenCreateOffer }
