import { useTranslation } from 'react-i18next'
import InfoIcon from '../../shared/images/info-duotone.svg'
import DomainLink from '../../shared/components/DomainLink'
import './styles.scss'
import { Account } from '../../shared/components/Account'

interface AccountHeaderProps {
  isAccountDeleted: boolean
  accountId: string
  account?: any
}

const AccountHeader = ({
  isAccountDeleted,
  accountId,
  account,
}: AccountHeaderProps) => {
  const { t } = useTranslation()
  const xAddress = account?.xAddress

  return (
    <div className="account-header">
      {isAccountDeleted && (
        <div className="deleted-banner">
          <div className="deleted-label">
            <InfoIcon className="deleted-info-icon" aria-hidden="true" />
            {t('account_page_deleted_account_label')}
          </div>
          <div className="deleted-message">
            {t('account_page_deleted_account_warning')}
          </div>
        </div>
      )}

      <div className="address-panel">
        <div className="address-label">
          {xAddress
            ? t('account_page_extended_address')
            : t('account_page_address')}
        </div>
        <div className="address-value" title={accountId}>
          {accountId}
        </div>
        {xAddress?.classicAddress && (
          <div className="classic-address">
            <div className="classic-address-label">
              {t('account_page_classic_address')}:
            </div>
            <Account account={xAddress.classicAddress} />
          </div>
        )}
        {xAddress?.tag && (
          <div className="address-tag">
            <div className="address-tag-label">
              {t('account_page_address_tag')}:
            </div>
            <div className="address-tag-value">{xAddress.tag}</div>
          </div>
        )}
        {account?.info?.domain && (
          <div className="domain">
            <div className="domain-label">{t('account_page_domain')}:</div>
            <DomainLink domain={account.info.domain} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountHeader
