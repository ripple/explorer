import React from 'react'

import Account from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenAcceptOfferInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenAcceptOfferInstructions>) => {
  const { acceptedOfferIDs, amount, tokenID, seller, buyer } =
    data?.instructions

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
