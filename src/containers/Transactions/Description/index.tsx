import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import Sequence from '../../shared/components/Sequence'
import { transactionTypes } from '../../shared/components/Transaction'

export const TransactionDescription: FC<{ data: any }> = ({ data }) => {
  const { t } = useTranslation()

  if (!data || !data.tx) {
    return null
  }

  // Locate the component description section of the detail tab that is unique per TransactionType.
  const DescriptionComponent =
    transactionTypes[data.tx.TransactionType]?.Description

  return (
    <div className="detail-section">
      <div className="title">{t('description')}</div>
      <div>
        {t('transaction_sequence')}{' '}
        <b>
          <Sequence
            sequence={data.tx.Sequence}
            ticketSequence={data.tx.TicketSequence}
            account={data.tx.Account}
            addContextHelp
          />
        </b>
      </div>
      {DescriptionComponent && <DescriptionComponent data={data} />}
    </div>
  )
}
