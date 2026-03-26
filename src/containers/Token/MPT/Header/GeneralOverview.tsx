import { useTranslation } from 'react-i18next'
import { shortenAccount, shortenMPTID } from '../../../shared/utils'
import { Account } from '../../../shared/components/Account'
import { CopyableText } from '../../../shared/components/CopyableText'
import {
  parseIntegerAmount,
  parsePercent,
} from '../../../shared/NumberFormattingUtils'

interface GeneralOverviewProps {
  issuer: string
  issuerName?: string
  transferFee?: number
  assetScale?: number
  mptIssuanceId: string
  showMptId: boolean
  holdersCount?: number
  holdersLoading?: boolean
}

export const GeneralOverview = ({
  issuer,
  issuerName,
  transferFee,
  assetScale,
  mptIssuanceId,
  showMptId: showMptIssuanceId,
  holdersCount,
  holdersLoading,
}: GeneralOverviewProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="header-box">
      <div className="header-box-title">{t('token_page.general_overview')}</div>
      <div className="header-box-contents">
        <div className="header-box-item">
          <div className="item-name">{t('token_page.issuer')}</div>
          <div className="item-value account-link">
            <Account
              account={issuer}
              displayText={shortenAccount(issuerName) || shortenAccount(issuer)}
            />
          </div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.price')}</div>
          <div className="item-value">--</div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.holders')}</div>
          <div className="item-value">
            {holdersLoading ? (
              <span className="loading-spinner" />
            ) : (
              parseIntegerAmount(holdersCount ?? 0)
            )}
          </div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.transfer_fee')}</div>
          <div className="item-value">
            {(transferFee && parsePercent(transferFee / 1000, 3)) ?? '--'}
          </div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('asset_scale')}</div>
          <div className="item-value">{assetScale ?? 0}</div>
        </div>
        {showMptIssuanceId && (
          <div className="header-box-item">
            <div className="item-name">{t('mpt_issuance_id')}</div>
            <div className="item-value">
              <CopyableText
                text={mptIssuanceId.toUpperCase()}
                displayText={shortenMPTID(mptIssuanceId, 8, 6)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
