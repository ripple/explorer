import React from 'react'
import PropTypes from 'prop-types'

const NFTokenMint = (props) => {
  const {
    data: {
      instructions: { tokenID, tokenTaxon, uri },
    },
  } = props

  return (
    <>
      <div className="row">
        <div className="label">Token ID</div>
        <div className="value">
          <div className="dt" data-test="token-id">
            {tokenID}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="label">Token Taxon</div>
        <div className="value" data-test="token-taxon">
          {tokenTaxon}
        </div>
      </div>
      <div className="row">
        <div className="label">URI</div>
        <div className="value" data-test="token-uri">
          {uri}
        </div>
      </div>
    </>
  )
}

NFTokenMint.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      tokenID: PropTypes.string,
      tokenTaxon: PropTypes.number,
      uri: PropTypes.string,
    }),
  }).isRequired,
}

export default NFTokenMint
