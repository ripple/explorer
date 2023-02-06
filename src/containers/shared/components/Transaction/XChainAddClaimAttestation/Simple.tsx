import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { XChainBridge } from '../XChainBridge'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'

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
        amount,
        otherChainSource,
        destination,
        claimId,
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
        bridgeOwner=""
      />
      <SimpleRow label={t('send')} data-test="send">
        <Amount value={amount} />
      </SimpleRow>
      <SimpleRow label={t('other_chain_source')} data-test="other_chain_source">
        <Account account={otherChainSource} link={false} />
      </SimpleRow>
      {destination && (
        <SimpleRow label={t('destination')} data-test="destination">
          <Account account={destination} />
        </SimpleRow>
      )}
      <SimpleRow label={t('xchain_claim_id')} data-test="claim-id">
        {claimId}
      </SimpleRow>
    </>
  )
}
