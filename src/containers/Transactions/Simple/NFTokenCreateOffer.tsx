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
      <SimpleRow label="Offer ID">
        <div className="dt" data-test="offer-id">
          {offerID}
        </div>
      </SimpleRow>
      <div data-test="buyer-or-seller">
        <SimpleRow label={isSellOffer ? 'Seller' : 'Buyer'}>
          <div className="account" data-test="buyer-or-seller-account">
            <Account account={account} />
          </div>
        </SimpleRow>
      </div>
      {!isSellOffer && (
        <SimpleRow label="Owner">
          <div className="account" data-test="owner">
            <Account account={owner} />
          </div>
        </SimpleRow>
      )}
      <SimpleRow label="Token ID">
        <div data-test="token-id">
          <div className="dt">{tokenID}</div>
        </div>
      </SimpleRow>
      <SimpleRow label="Amount">
        <div data-test="amount">
          <Amount value={amount} displayIssuer />
        </div>
      </SimpleRow>
    </>
  )
}

export { NFTokenCreateOffer }
