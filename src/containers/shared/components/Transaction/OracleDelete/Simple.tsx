import { useTranslation } from 'react-i18next'
import type { OracleSet } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<OracleSet>) => {
  const { t } = useTranslation()
  const { OracleDocumentID } = data.instructions
  return (
    <SimpleRow label={t('oracle_document_id')} data-testid="oracle-document-id">
      {OracleDocumentID}
    </SimpleRow>
  )
}
