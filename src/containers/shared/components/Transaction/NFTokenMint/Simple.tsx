import React from 'react'

import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenMintInstructions } from './types'
import Account from '../../Account'
import { useLanguage } from '../../../hooks'
import { localizeNumber } from '../../../utils'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenMintInstructions>) => {
  const { tokenID, tokenTaxon, uri, transferFee, issuer } = data.instructions
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      style: 'currency',
      currency: 'none',
      minimumFractionDigits: 3,
    })}%`

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
      {transferFee && (
        <SimpleRow
          label={t('transfer_fee')}
          className="dt"
          data-test="token-fee"
        >
          {formattedFee}
        </SimpleRow>
      )}
      {issuer && (
        <SimpleRow label={t('issuer')} className="dt" data-test="token-issuer">
          <Account account={issuer} />
        </SimpleRow>
      )}
    </>
  )
}
