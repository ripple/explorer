import React from 'react'

import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenAcceptOfferInstructions } from './types'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenAcceptOfferInstructions>) => {
  const { acceptedOfferIDs, amount, tokenID, seller, buyer } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      {acceptedOfferIDs.map((offer) => (
        <SimpleRow label={t('offer_index')} className="dt" data-test="offer-id">
          {offer}
        </SimpleRow>
      ))}
      {amount && seller && buyer && tokenID && (
        <>
          <SimpleRow label={t('seller')} data-test="seller">
            <Account account={seller} />
          </SimpleRow>
          <SimpleRow label={t('buyer')} data-test="buyer">
            <Account account={buyer} />
          </SimpleRow>
          <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
            {tokenID}
          </SimpleRow>
          <SimpleRow label={t('amount')} data-test="amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
        </>
      )}
    </>
  )
}
