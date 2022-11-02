import React from 'react'

import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenMintInstructions } from './types'
import { NFTokenLink } from '../../NFTokenLink'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenMintInstructions>) => {
  const { tokenID, tokenTaxon, uri } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      {tokenID && (
        <SimpleRow label={t('token_id')} data-test="token-id">
          <NFTokenLink tokenID={tokenID} />
        </SimpleRow>
      )}
      <SimpleRow
        label={t('token_taxon')}
        className="dt"
        data-test="token-taxon"
      >
        {tokenTaxon}
      </SimpleRow>
      {uri && (
        <SimpleRow label={t('uri')} className="dt" data-test="token-uri">
          {uri}
        </SimpleRow>
      )}
    </>
  )
}
