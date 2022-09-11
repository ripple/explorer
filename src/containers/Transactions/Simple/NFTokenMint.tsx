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
      <SimpleRow label="Token ID" className="dt" data-test="token-id">
        {tokenID}
      </SimpleRow>
      <SimpleRow label="Token Taxon" className="dt" data-test="token-taxon">
        {tokenTaxon}
      </SimpleRow>
      <SimpleRow label="URI" className="dt" data-test="token-uri">
        {uri}
      </SimpleRow>
    </>
  )
}

export { NFTokenMint }
