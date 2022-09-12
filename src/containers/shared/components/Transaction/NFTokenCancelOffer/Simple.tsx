import React from 'react'

import Account from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenCancelOfferInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenCancelOfferInstructions>) => {
  const { cancelledOffers } = data?.instructions

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
