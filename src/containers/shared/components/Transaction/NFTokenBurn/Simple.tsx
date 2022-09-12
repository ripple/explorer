import React from 'react'
import { SimpleRow } from '../SimpleRow'
import { NFTokenBurnInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenBurnInstructions>) => {
  const { tokenID } = data?.instructions

  return (
    <SimpleRow label="Token ID" className="dt" data-test="token-id">
      {tokenID}
    </SimpleRow>
  )
}
