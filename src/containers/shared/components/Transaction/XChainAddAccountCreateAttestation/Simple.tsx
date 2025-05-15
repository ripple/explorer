import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { XChainBridge } from '../XChainBridge'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { Account } from '../../Account'

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
      <SimpleRow label={t('send')} data-testid="send">
        <Amount value={amount} />
      </SimpleRow>
      <SimpleRow
        label={t('other_chain_source')}
        data-testid="other_chain_source"
      >
        <Account account={otherChainSource} link={false} />
      </SimpleRow>
      <SimpleRow label={t('destination')} data-testid="destination">
        <Account account={destination} />
      </SimpleRow>
    </>
  )
}
