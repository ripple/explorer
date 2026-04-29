import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import Currency from '../../Currency'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { MPTokenIssuanceID } = data.instructions
  const { t } = useTranslation()

  return (
    <SimpleRow label={t('mpt_issuance_id')} data-testid="mpt-issuance-id">
      <Currency currency={MPTokenIssuanceID} isMPT shortenMPTIssuanceID />
    </SimpleRow>
  )
}
