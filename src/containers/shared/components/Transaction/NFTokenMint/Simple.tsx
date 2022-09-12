import React from 'react'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { NFTokenMintInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenMintInstructions>) => {
  const { tokenID, tokenTaxon, uri } = data?.instructions

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
