import { useTranslation } from 'react-i18next'
import type { OfferCancel } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<OfferCancel>) => {
  const { t } = useTranslation()
  const { OfferSequence } = instructions

  return (
    <div className="offercancel">
      <span className="label">{t('cancel_offer')}</span>
      {` #`}
      <span className="sequence">{OfferSequence}</span>
    </div>
  )
}
