import { useTranslation } from 'react-i18next'
import type { MPTokenAuthorize } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { MPTokenLink } from '../../MPTokenLink'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenAuthorize>) => {
  const { MPTokenIssuanceID, Holder } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('mpt_issuance_id')} data-test="mpt-issuance-id">
        <MPTokenLink tokenID={MPTokenIssuanceID} />
      </SimpleRow>
      {Holder && (
        <SimpleRow label={t('mpt_holder')} data-test="mpt-holder">
          <Account account={Holder} />
        </SimpleRow>
      )}
    </>
  )
}
