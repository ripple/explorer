import React from 'react'

import Account from '../../shared/components/Account'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'
import { Amount } from '../../shared/components/Amount'

export interface Props {
  data: {
    instructions: {
      acceptedOfferIDs: string[]
      amount: { currency: string; amount: number; issuer: string }
      tokenID: string
      seller: string
      buyer: string
    }
  }
}

const NFTokenAcceptOffer = (props: Props) => {
  const {
    data: {
      instructions: { acceptedOfferIDs, amount, tokenID, seller, buyer },
    },
  } = props

  return (
    <>
      {acceptedOfferIDs.map((offer) => (
        <SimpleRow label="Offer ID">
          <div className="dt" data-test="offer-id">
            {offer}
          </div>
        </SimpleRow>
      ))}
      {tokenID && (
        <>
          <SimpleRow label="Seller">
            <div className="account" data-test="seller">
              <Account account={seller} />
            </div>
          </SimpleRow>
          <SimpleRow label="Buyer">
            <div className="account" data-test="buyer">
              <Account account={buyer} />
            </div>
          </SimpleRow>
          <SimpleRow label="Token ID">
            <div className="dt" data-test="token-id">
              {tokenID}
            </div>
          </SimpleRow>
          <SimpleRow label="Amount">
            <div data-test="amount">
              <Amount
                value={{
                  issuer: amount.issuer,
                  currency: amount.currency,
                  amount: amount.amount.toString(),
                }}
                displayIssuer
              />
            </div>
          </SimpleRow>
        </>
      )}
    </>
  )
}

export { NFTokenAcceptOffer }
