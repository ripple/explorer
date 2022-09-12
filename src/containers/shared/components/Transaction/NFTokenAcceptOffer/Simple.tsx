import React from 'react'

import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenAcceptOfferInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<NFTokenAcceptOfferInstructions>) => {
  const { acceptedOfferIDs, amount, tokenID, seller, buyer } =
    data?.instructions
  const { t } = useTranslation()

  return (
    <>
      {acceptedOfferIDs.map((offer) => (
        <SimpleRow label={t('offer_index')} className="dt" data-test="offer-id">
          {offer}
        </SimpleRow>
      ))}
      {tokenID && (
        <>
          <SimpleRow label={t('seller')} className="account" data-test="seller">
            <Account account={seller} />
          </SimpleRow>
          <SimpleRow label={t('buyer')} className="account" data-test="buyer">
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
