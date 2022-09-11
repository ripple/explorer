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
        <SimpleRow label="Offer ID" className="dt" data-test="offer-id">
          {offer}
        </SimpleRow>
      ))}
      {tokenID && (
        <>
          <SimpleRow label="Seller" className="account" data-test="seller">
            <Account account={seller} />
          </SimpleRow>
          <SimpleRow label="Buyer" className="account" data-test="buyer">
            <Account account={buyer} />
          </SimpleRow>
          <SimpleRow label="Token ID" className="dt" data-test="token-id">
            {tokenID}
          </SimpleRow>
          <SimpleRow label="Amount" data-test="amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
        </>
      )}
    </>
  )
}

export { NFTokenAcceptOffer }
