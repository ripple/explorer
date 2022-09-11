import React from 'react'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'

export interface Props {
  data: { instructions: { tokenID: string } }
}

const NFTokenBurn = (props: Props) => {
  const {
    data: {
      instructions: { tokenID },
    },
  } = props

  return (
    <SimpleRow label="Token ID" className="dt" data-test="token-id">
      {tokenID}
    </SimpleRow>
  )
}

export { NFTokenBurn }
