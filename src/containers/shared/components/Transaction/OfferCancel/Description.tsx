import { useTranslation } from 'react-i18next'
import type { OfferCancel } from 'xrpl'

import { TransactionDescriptionProps } from '../types'

export const Description = ({
  data,
}: TransactionDescriptionProps<OfferCancel>) => {
  const { t } = useTranslation()

  return (
    <div data-testid="cancel-line">
      {t('offer_cancel_description')}
      <b>{data.tx.OfferSequence}</b>
    </div>
  )
}
