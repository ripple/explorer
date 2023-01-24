import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { OfferCancelInstructions } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<OfferCancelInstructions>) => {
  const { t } = useTranslation()
  const { cancel } = instructions

  return (
    <div className="offercancel">
      <span className="label">{t('cancel_offer')}</span>
      {` #`}
      <span className="sequence">{cancel}</span>
    </div>
  )
}
