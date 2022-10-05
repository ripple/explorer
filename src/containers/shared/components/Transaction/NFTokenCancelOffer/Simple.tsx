import React from 'react'

import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenCancelOfferInstructions } from './types'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenCancelOfferInstructions>) => {
  const { cancelledOffers } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      {cancelledOffers.map(({ amount, offerID, tokenID, offerer }) => (
        <>
          <SimpleRow
            label={t('offer_index')}
            className="dt"
            data-test="offer-id"
          >
            {offerID}
          </SimpleRow>
          <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
            {tokenID}
          </SimpleRow>
          <SimpleRow label={t('amount')} data-test="amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
          <SimpleRow label={t('offerer')} data-test="offerer">
            <Account account={offerer} />
          </SimpleRow>
        </>
      ))}
    </>
  )
}
