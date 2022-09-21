import React from 'react'

import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenMintInstructions } from './types'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenMintInstructions>) => {
  const { tokenID, tokenTaxon, uri } = data?.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
        {tokenID}
      </SimpleRow>
      <SimpleRow
        label={t('token_taxon')}
        className="dt"
        data-test="token-taxon"
      >
        {tokenTaxon}
      </SimpleRow>
      <SimpleRow label={t('uri')} className="dt" data-test="token-uri">
        {uri}
      </SimpleRow>
    </>
  )
}
