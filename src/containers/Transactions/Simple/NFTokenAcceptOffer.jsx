import React from 'react'
import PropTypes from 'prop-types'

import Account from '../../shared/components/Account'
import Currency from '../../shared/components/Currency'

const NFTokenAcceptOffer = (props) => {
  const {
    data: {
      instructions: { acceptedOfferIDs, amount, tokenID, seller, buyer },
    },
  } = props

  return (
    <>
      {acceptedOfferIDs.map((offer) => (
        <div className="row">
          <div className="label">Offer ID</div>
          <div className="value" data-test="offer-id">
            <div className="dt">{offer}</div>
          </div>
        </div>
      ))}
      {tokenID && (
        <>
          <div className="row">
            <div className="label">Seller</div>
            <div className="value account" data-test="seller">
              <Account account={seller} />
            </div>
          </div>
          <div className="row">
            <div className="label">Buyer</div>
            <div className="value account" data-test="buyer">
              <Account account={buyer} />
            </div>
          </div>
          <div className="row">
            <div className="label">Token ID</div>
            <div className="value">
              <div className="dt" data-test="token-id">
                {tokenID}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="label">Amount</div>
            <div className="value" data-test="amount">
              {amount.amount}
              <Currency currency={amount.currency} issuer={amount.issuer} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

NFTokenAcceptOffer.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      acceptedOfferIDs: PropTypes.arrayOf(PropTypes.string),
      amount: PropTypes.shape({
        currency: PropTypes.string,
        amount: PropTypes.number,
        issuer: PropTypes.string,
      }),
      tokenID: PropTypes.string,
      seller: PropTypes.string,
      buyer: PropTypes.string,
    }),
  }).isRequired,
}

export default NFTokenAcceptOffer
