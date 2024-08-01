import { useTranslation } from 'react-i18next'
import { IssuedCurrency } from '../../types'
import { Account } from '../Account'
import { Amount } from '../Amount'
import Currency from '../Currency'
import { SimpleGroup } from './SimpleGroup'
import { SimpleRow } from './SimpleRow'

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
      <SimpleRow
        label={t('locking_chain_door')}
        data-testid="locking-chain-door"
      >
        <Account account={lockingDoor} link={lockingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('locking_chain_issue')}
        data-testid="locking-chain-issue"
      >
        <Currency
          issuer={lockingIssue.issuer}
          currency={lockingIssue.currency}
          link={lockingDoor === bridgeOwner}
        />
      </SimpleRow>
      <SimpleRow
        label={t('issuing_chain_door')}
        data-testid="issuing-chain-door"
      >
        <Account account={issuingDoor} link={issuingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('issuing_chain_issue')}
        data-testid="issuing-chain-issue"
      >
        <Currency
          issuer={issuingIssue.issuer}
          currency={issuingIssue.currency}
          link={issuingDoor === bridgeOwner}
        />
      </SimpleRow>
      {signatureReward && (
        <SimpleRow label={t('signature_reward')} data-testid="signature-reward">
          <Amount value={signatureReward} />
        </SimpleRow>
      )}
    </SimpleGroup>
  )
}
