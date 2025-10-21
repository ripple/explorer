import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { XChainBridge } from '../XChainBridge'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  const { t } = useTranslation()
  const {
    data: {
      instructions: {
        lockingDoor,
        lockingIssue,
        issuingDoor,
        issuingIssue,
        signatureReward,
        minAccountCreateAmount,
        bridgeOwner,
      },
    },
  } = props

  return (
    <>
      <XChainBridge
        lockingDoor={lockingDoor}
        lockingIssue={lockingIssue}
        issuingDoor={issuingDoor}
        issuingIssue={issuingIssue}
        signatureReward={signatureReward}
        bridgeOwner={bridgeOwner}
      />
      {minAccountCreateAmount && (
        <SimpleRow
          label={t('min_account_create_amount')}
          data-testid="min-account-create-amount"
        >
          <Amount value={minAccountCreateAmount} />
        </SimpleRow>
      )}
    </>
  )
}
