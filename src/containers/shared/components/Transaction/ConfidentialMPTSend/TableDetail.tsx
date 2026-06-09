import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { CredentialIDs } from '../CredentialIDs'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { mptIssuanceID, destination, credentialIDs } = instructions

  return (
    <div className="confidential-mpt-send">
      <span className="label">{t('send')}</span>{' '}
      <Amount
        value={{ currency: mptIssuanceID, amount: 0, isMPT: true }}
        displayOverride={
          <span style={{ opacity: 0.5 }}>&#x1F512; {t('confidential')}</span>
        }
      />{' '}
      <span>{t('to')}</span> <Account account={destination} />
      <CredentialIDs credentialIDs={credentialIDs} inline />
    </div>
  )
}
