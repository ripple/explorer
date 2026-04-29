import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { CredentialIDs } from '../CredentialIDs'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { mptIssuanceID, destination, credentialIDs } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('destination')} data-testid="destination">
        <Account account={destination} />
      </SimpleRow>
      <SimpleRow label={t('send')} data-testid="send">
        <Amount
          value={{ currency: mptIssuanceID, amount: 0, isMPT: true }}
          displayOverride={
            <span style={{ opacity: 0.5 }}>&#x1F512; {t('confidential')}</span>
          }
        />
      </SimpleRow>
      <CredentialIDs credentialIDs={credentialIDs} />
    </>
  )
}
