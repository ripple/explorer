import { Trans, useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { batchTransactions } = tx

  return (
    <Trans
      i18nKey="batch_table_detail"
      components={{
        BatchLabel: <span className="label">{t('batch')}</span>,
      }}
      values={{
        batch_count: batchTransactions.length,
      }}
    />
  )
}
