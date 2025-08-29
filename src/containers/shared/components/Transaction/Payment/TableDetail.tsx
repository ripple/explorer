import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { PaymentInstructions } from './types'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PaymentInstructions>) => {
  const { t } = useTranslation()
  const {
    convert,
    amount,
    destination,
    partial,
    sourceTag,
    domainID,
    credentialIDs,
  } = instructions

  const renderPartial = () => (
    <div className="partial-payment">{t('partial_payment_allowed')}</div>
  )

  const renderCredentialIDs = () => {
    if (!credentialIDs || credentialIDs.length === 0) {
      return null
    }
    return (
      <div className="credential-ids">
        <span className="label">{t('credential_ids')}: </span>
        {credentialIDs.map((id) => (
          <div key={id} className="credential-id">
            {id}
          </div>
        ))}
      </div>
    )
  }

  if (convert) {
    return (
      <div className="payment conversion">
        <span className="label">{t('convert_maximum')}</span>
        <Amount value={convert} />
        <span>{t('to')}</span>
        <Amount value={amount} />
        {partial && renderPartial()}
        {renderCredentialIDs()}
      </div>
    )
  }

  return (
    <div className="payment">
      <span className="label">{t('send')}</span>
      <Amount value={amount} />
      <span>{t('to')}</span>
      <Account account={destination} />
      {sourceTag !== undefined && (
        <div className="st">
          {t('source_tag')}
          {': '}
          <span>{sourceTag}</span>
        </div>
      )}
      {domainID !== undefined && (
        <div className="domain-id">
          {t('domain_id')}
          {': '}
          <span>{domainID}</span>
        </div>
      )}
      {renderCredentialIDs()}
      {partial && renderPartial()}
    </div>
  )
}
