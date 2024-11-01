import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { MPTokenAuthorize } from './types'
import { Account } from '../../Account'
import { MPTokenLink } from '../../MPTokenLink'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenAuthorize>) => {
  const { MPTokenIssuanceID, MPTokenHolder } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('mpt_issuance_id')} data-testid="mpt-issuance-id">
        <MPTokenLink tokenID={MPTokenIssuanceID} />
      </SimpleRow>
      {MPTokenHolder && (
        <SimpleRow label={t('mpt_holder')} data-testid="mpt-holder">
          <Account account={MPTokenHolder} />
        </SimpleRow>
      )}
    </>
  )
}
