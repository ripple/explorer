import { useTranslation } from 'react-i18next'
import type { MPTokenIssuanceSet } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { MPTokenLink } from '../../MPTokenLink'
import {
  isValidJsonString,
  localizeNumber,
  shortenEncryptionKey,
} from '../../../utils'
import { useLanguage } from '../../../hooks'
import { JsonView } from '../../JsonView'
import {
  buildFlags,
  convertHexToString,
} from '../../../../../rippled/lib/utils'
import { MPT_SET_MUTABLE_FLAGS } from '../../../transactionUtils'

interface MPTokenIssuanceSetExtended extends MPTokenIssuanceSet {
  MPTokenMetadata?: string
  TransferFee?: number
  MutableFlags?: number
  IssuerEncryptionKey?: string
  AuditorEncryptionKey?: string
}

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceSetExtended>) => {
  const {
    MPTokenIssuanceID,
    Holder,
    MPTokenMetadata,
    TransferFee,
    MutableFlags,
    IssuerEncryptionKey,
    AuditorEncryptionKey,
  } = data.instructions
  const { t } = useTranslation()
  const language = useLanguage()

  const metadata = MPTokenMetadata
    ? convertHexToString(MPTokenMetadata)
    : undefined
  const formattedFee =
    TransferFee != null
      ? `${localizeNumber((TransferFee / 1000).toPrecision(5), language, {
          minimumFractionDigits: 3,
        })}%`
      : undefined
  const flagChanges = buildFlags(MutableFlags, MPT_SET_MUTABLE_FLAGS)

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
      {TransferFee != null && (
        <SimpleRow label={t('transfer_fee')} data-testid="mpt-fee">
          {formattedFee}
        </SimpleRow>
      )}
      {metadata && (
        <SimpleRow
          label={t('metadata')}
          className="dt"
          data-testid="mpt-metadata"
        >
          {isValidJsonString(metadata) ? (
            <JsonView data={JSON.parse(metadata)} />
          ) : (
            metadata
          )}
        </SimpleRow>
      )}
      {flagChanges.length > 0 && (
        <SimpleRow label={t('mutable_flags')} data-testid="mpt-mutable-flags">
          {flagChanges.join(', ')}
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
