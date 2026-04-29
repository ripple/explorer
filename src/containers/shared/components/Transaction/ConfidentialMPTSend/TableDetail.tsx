import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'

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
      {credentialIDs?.length > 0 && (
        <div className="credential-ids">
          <span className="label">{t('credential_ids')}: </span>
          {credentialIDs.map((id: string) => (
            <div key={id} className="credential-id">
              {id}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
