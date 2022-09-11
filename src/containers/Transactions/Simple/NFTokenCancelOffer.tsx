import React from 'react'

import Account from '../../shared/components/Account'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'
import { Amount } from '../../shared/components/Amount'

export interface Props {
  data: {
    instructions: {
      cancelledOffers: {
        amount: { currency: string; amount: number; issuer: string }
        offerID: string
        tokenID: string
        offerer: string
      }[]
    }
  }
}

const NFTokenCancelOffer = (props: Props) => {
  const {
    data: {
      instructions: { cancelledOffers },
    },
  } = props

  return (
    <>
      {cancelledOffers.map(({ amount, offerID, tokenID, offerer }) => (
        <>
          <SimpleRow label="Offer ID" className="dt" data-test="offer-id">
            {offerID}
          </SimpleRow>
          <SimpleRow label="Token ID" className="dt" data-test="token-id">
            {tokenID}
          </SimpleRow>
          <SimpleRow label="Amount" data-test="amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
          <SimpleRow label="Offerer" className="account" data-test="offerer">
            <Account account={offerer} />
          </SimpleRow>
        </>
      ))}
    </>
  )
}

export { NFTokenCancelOffer }
