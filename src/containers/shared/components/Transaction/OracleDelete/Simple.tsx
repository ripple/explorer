import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { OracleDocumentID } = data.instructions
  return (
    <div className="oracle-delete">
      {OracleDocumentID !== undefined && (
        <SimpleRow
          label={t('oracle_document_id')}
          data-test="oracle-document-id"
        >
          {OracleDocumentID}
        </SimpleRow>
      )}
    </div>
  )
}
