import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { shortenAccount } from '../../shared/utils'
import './styles.scss'

interface Props {
  account: any
}

export const SponsoredFeesReserves = ({ account }: Props) => {
  const { t } = useTranslation()

  const transactionFeesSponsor = account.sponsorship?.owner
  const baseReserveSponsor = account.info?.sponsor

  if (!transactionFeesSponsor && !baseReserveSponsor) {
    return null
  }

  return (
    <div className="sponsored-fees-reserves-section">
      <h2 className="sponsored-fees-reserves-title">
        {t('account_page_sponsored_fees_reserves_title')}
      </h2>
      <div className="sponsored-fees-reserves-table-wrapper">
        <table className="sponsored-fees-reserves-table">
          <thead>
            <tr>
              <th>{t('account_page_sponsored_scope')}</th>
              <th>{t('account_page_sponsored_by')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {transactionFeesSponsor && (
              <tr>
                <td>{t('account_page_sponsored_scope_transaction_fees')}</td>
                <td>
                  <Account
                    account={transactionFeesSponsor}
                    displayText={shortenAccount(transactionFeesSponsor)}
                  />
                </td>
                <td>{t('account_page_sponsored_status_active')}</td>
              </tr>
            )}
            {baseReserveSponsor && (
              <tr>
                <td>{t('account_page_sponsored_scope_base_reserve')}</td>
                <td>
                  <Account
                    account={baseReserveSponsor}
                    displayText={shortenAccount(baseReserveSponsor)}
                  />
                </td>
                <td>{t('account_page_sponsored_status_active')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
