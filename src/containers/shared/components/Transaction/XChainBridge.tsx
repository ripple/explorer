import { useTranslation } from 'react-i18next'
import { IssuedCurrency } from '../../types'
import { Account } from '../Account'
import { Amount } from '../Amount'
import Currency from '../Currency'
import { SimpleGroup } from './SimpleGroup'
import { SimpleRow } from './SimpleRow'

interface XChainIssueProps {
  issue: IssuedCurrency
  isThisChain: boolean
}

const XChainIssue = (props: XChainIssueProps) => {
  const { issue, isThisChain } = props

  return (
    <Currency
      issuer={issue.issuer}
      currency={issue.currency}
      link={isThisChain}
    />
  )
}

export interface XChainBridgeProps {
  lockingDoor: string
  lockingIssue: IssuedCurrency
  issuingDoor: string
  issuingIssue: IssuedCurrency
  signatureReward?: string
  bridgeOwner: string
}

export const XChainBridge = (props: XChainBridgeProps) => {
  const { t } = useTranslation()
  const {
    lockingDoor,
    lockingIssue,
    issuingDoor,
    issuingIssue,
    signatureReward,
    bridgeOwner,
  } = props

  return (
    <SimpleGroup title={t('xchainbridge')}>
      <SimpleRow label={t('locking_chain_door')} data-test="locking-chain-door">
        <Account account={lockingDoor} link={lockingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('locking_chain_issue')}
        data-test="locking-chain-issue"
      >
        <XChainIssue
          issue={lockingIssue}
          isThisChain={lockingDoor === bridgeOwner}
        />
      </SimpleRow>
      <SimpleRow label={t('issuing_chain_door')} data-test="issuing-chain-door">
        <Account account={issuingDoor} link={issuingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('issuing_chain_issue')}
        data-test="issuing-chain-issue"
      >
        <XChainIssue
          issue={issuingIssue}
          isThisChain={issuingDoor === bridgeOwner}
        />
      </SimpleRow>
      {signatureReward && (
        <SimpleRow label={t('signature_reward')} data-test="signature-reward">
          <Amount value={signatureReward} />
        </SimpleRow>
      )}
    </SimpleGroup>
  )
}
