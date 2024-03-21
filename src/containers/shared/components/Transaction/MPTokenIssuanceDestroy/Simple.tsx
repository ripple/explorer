import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { MPTokenIssuanceDestroy } from './types'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceDestroy>) => {
  const { MPTokenIssuanceID } = data.instructions
  const { t } = useTranslation()

  return (
    <SimpleRow label={t('mpt_issuance_id')} data-test="mpt-issuance-id">
      {MPTokenIssuanceID}
    </SimpleRow>
  )
}
