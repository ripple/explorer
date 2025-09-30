import { useTranslation } from 'react-i18next'
import type { MPTokenIssuanceSet } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { MPTokenLink } from '../../MPTokenLink'
import { useLanguage } from '../../../hooks'
import { localizeNumber, isValidJsonString } from '../../../utils'
import { JsonView } from '../../JsonView'
import {
  MPTOKEN_ISSUANCE_SET_MUTABLE_FLAGS,
  buildMPTMutateFlags,
} from '../../../transactionUtils'

type MPTokenIssuanceSetWithDynamic = MPTokenIssuanceSet & {
  TransferFee?: number
  MPTokenMetadata?: string
  MutableFlags?: number
}

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceSetWithDynamic>) => {
  const {
    MPTokenIssuanceID,
    Holder,
    TransferFee,
    MPTokenMetadata,
    MutableFlags,
  } = data.instructions
  const { t } = useTranslation()
  const language = useLanguage()

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
      {TransferFee && (
        <SimpleRow label={t('transfer_fee')} data-testid="token-fee">
          `$
          {localizeNumber((TransferFee / 1000).toPrecision(5), language, {
            minimumFractionDigits: 3,
          })}
          %`
        </SimpleRow>
      )}
      {MutableFlags && (
        <SimpleRow
          label={t('mutable_flags')}
          className="dt"
          data-test-id="mpt-mutable-flags"
        >
          <em>
            {buildMPTMutateFlags(
              MutableFlags,
              MPTOKEN_ISSUANCE_SET_MUTABLE_FLAGS,
            ).join(', ')}
          </em>
        </SimpleRow>
      )}
      {MPTokenMetadata && (
        <SimpleRow
          label={t('metadata')}
          className="dt"
          data-testid="mpt-metadata"
        >
          {isValidJsonString(MPTokenMetadata) ? (
            <JsonView data={JSON.parse(MPTokenMetadata)} />
          ) : (
            MPTokenMetadata
          )}
        </SimpleRow>
      )}
    </>
  )
}
