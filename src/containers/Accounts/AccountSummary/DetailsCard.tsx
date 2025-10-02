import { useTranslation } from 'react-i18next'
import { localizeNumber } from '../../shared/utils'
import { XRP_SMALL_BALANCE_CURRENCY_OPTIONS } from '../../shared/NumberFormattingOptions'
import { Account } from '../../shared/components/Account'

interface DetailsCardProps {
  account: any
  lang: string
}

const DetailsCard = ({ account, lang }: DetailsCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="details-card card">
      <div className="card-header">
        <div className="header-title">{t('account_page_details')}</div>
      </div>
      <div className="details-list">
        <div className="details-box">
          <div className="details-label">
            {t('account_page_current_sequence')}
          </div>
          <div className="details-value">
            {localizeNumber(account.info?.sequence, lang)}
          </div>
        </div>
        <div className="details-box">
          <div className="details-label">{t('account_page_ticket_count')}</div>
          <div className="details-value">
            {localizeNumber(account.info?.ticketCount, lang)}
          </div>
        </div>
        {account.info?.emailHash && (
          <div className="details-box email">
            <div className="details-label">{t('account_page_email_hash')}</div>
            <div className="details-value">{account.info.emailHash}</div>
          </div>
        )}
        {account.paychannels?.total_available && (
          <div className="details-box channels">
            <div className="details-label">
              {t('account_page_payment_channels')}
            </div>
            <div className="details-value">
              {t('account_page_payment_channels_text', {
                currency: localizeNumber(
                  account.paychannels.total_available,
                  lang,
                  XRP_SMALL_BALANCE_CURRENCY_OPTIONS,
                ),
                number: account.paychannels.channels.length,
              })}
            </div>
          </div>
        )}
        {account.info?.nftMinter && (
          <div className="details-box nft-minter">
            <div className="details-label">{t('account_page_nft_minter')}</div>
            <div className="details-value">
              <Account account={account.info.nftMinter} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailsCard
