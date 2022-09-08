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
      {cancelledOffers.map(
        ({
          amount: { amount, issuer, currency },
          offerID,
          tokenID,
          offerer,
        }) => (
          <>
            <SimpleRow label="Offer ID">
              <div className="dt" data-test="offer-id">
                {offerID}
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
                    issuer,
                    currency,
                    amount: amount.toString(),
                  }}
                  displayIssuer
                />
              </div>
            </SimpleRow>
            <SimpleRow label="Offerer">
              <div className="account" data-test="offerer">
                <Account account={offerer} />
              </div>
            </SimpleRow>
          </>
        ),
      )}
    </>
  )
}

export default NFTokenCancelOffer
