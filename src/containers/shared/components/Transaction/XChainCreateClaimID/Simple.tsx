import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
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
        otherChainSource,
        bridgeOwner,
        claimID,
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
      <SimpleRow
        label={t('other_chain_source')}
        data-testid="other-chain-source"
      >
        <Account account={otherChainSource} link={false} />
      </SimpleRow>
      {claimID && (
        <SimpleRow label={t('xchain_claim_id')} data-testid="claim-id">
          {claimID}
        </SimpleRow>
      )}
    </>
  )
}
