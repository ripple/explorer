import React from 'react'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'

export interface Props {
  data: {
    instructions: {
      tokenID: string
      tokenTaxon: number
      uri: string
    }
  }
}

const NFTokenMint = (props: Props) => {
  const {
    data: {
      instructions: { tokenID, tokenTaxon, uri },
    },
  } = props

  return (
    <>
      <SimpleRow label="Token ID">
        <div className="dt" data-test="token-id">
          {tokenID}
        </div>
      </SimpleRow>
      <SimpleRow label="Token Taxon">
        <div className="dt" data-test="token-taxon">
          {tokenTaxon}
        </div>
      </SimpleRow>
      <SimpleRow label="URI">
        <div className="dt" data-test="token-uri">
          {uri}
        </div>
      </SimpleRow>
    </>
  )
}

export { NFTokenMint }
