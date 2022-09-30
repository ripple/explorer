import React from 'react'
import { useTranslation } from 'react-i18next'

import { TransactionDescriptionProps } from '../types'
import { OfferCancel } from './types'

export const Description = ({
  data,
}: TransactionDescriptionProps<OfferCancel>) => {
  const { t } = useTranslation()

  return (
    <div data-test="cancel-line">
      {t('offer_cancel_description')}
      <b>{data.tx.OfferSequence}</b>
    </div>
  )
}
