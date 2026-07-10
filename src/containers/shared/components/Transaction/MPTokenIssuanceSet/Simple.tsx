import { useTranslation } from 'react-i18next'
import type { MPTokenIssuanceSet } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { MPTokenLink } from '../../MPTokenLink'
import { shortenEncryptionKey } from '../../../utils'

interface MPTokenIssuanceSetExtended extends MPTokenIssuanceSet {
  IssuerEncryptionKey?: string
  AuditorEncryptionKey?: string
}

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceSetExtended>) => {
  const {
    MPTokenIssuanceID,
    Holder,
    IssuerEncryptionKey,
    AuditorEncryptionKey,
  } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('mpt_issuance_id')} data-testid="mpt-issuance-id">
        <MPTokenLink tokenID={MPTokenIssuanceID} />
      </SimpleRow>
      {Holder && (
        <SimpleRow label={t('mpt_holder')} data-testid="mpt-holder">
          <Account account={Holder} />
        </SimpleRow>
      )}
      {IssuerEncryptionKey && (
        <SimpleRow
          label={t('issuer_encryption_key')}
          className="dt"
          data-testid="issuer-encryption-key"
        >
          {shortenEncryptionKey(IssuerEncryptionKey)}
        </SimpleRow>
      )}
      {AuditorEncryptionKey && (
        <SimpleRow
          label={t('auditor_encryption_key')}
          className="dt"
          data-testid="auditor-encryption-key"
        >
          {shortenEncryptionKey(AuditorEncryptionKey)}
        </SimpleRow>
      )}
    </>
  )
}
