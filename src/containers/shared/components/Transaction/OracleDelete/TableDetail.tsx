import { useTranslation } from 'react-i18next'
import type { OracleDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps<OracleDelete>) => {
  const { t } = useTranslation()
  return (
    <div className="oracle-document-id">
      <span className="label">{t('oracle_document_id')}: </span>
      <span className="case-sensitive">{tx.OracleDocumentID}</span>
    </div>
  )
}
