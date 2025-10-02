import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { XRP_BASE } from '../../shared/transactionUtils'
import UsdIcon from '../../shared/images/usd_icon.svg'
import XrpIcon from '../../shared/images/xrp_balance_icon.svg'
import ReserveIcon from '../../shared/images/xrp_reserve_balance_icon.svg'
import {
  XRP_CURRENCY_OPTIONS,
  USD_CURRENCY_OPTIONS,
} from '../../shared/NumberFormattingOptions'

interface BalancesProps {
  account: any
  xrpToUSDRate: number
}

const Balances = ({ account, xrpToUSDRate }: BalancesProps) => {
  const { t } = useTranslation()
  const lang = useLanguage()
  const { xrpBalance, xrpBalanceInUSD } = useMemo(() => {
    const balance = (account.info?.balance ?? 0) / XRP_BASE
    return {
      xrpBalance: balance,
      xrpBalanceInUSD: balance * xrpToUSDRate,
    }
  }, [account.info?.balance, xrpToUSDRate])

  return (
    <div className="balances">
      <div className="balance-card card xrp">
        <div className="balance-title">
          {typeof XrpIcon === 'string' ? (
            <img src={XrpIcon} alt="XRP" className="balance-icon" />
          ) : (
            <XrpIcon className="balance-icon" />
          )}
          {t('account_page_xrp_balance')}
        </div>
        <div className="balance-value">
          {localizeNumber(xrpBalance, lang, XRP_CURRENCY_OPTIONS)}
        </div>
      </div>
      <div className="balance-card card usd">
        <div className="balance-title">
          <UsdIcon className="balance-icon" />
          {t('account_page_xrp_balance_in_usd')}
        </div>
        <div className="balance-value">
          {localizeNumber(xrpBalanceInUSD, lang, USD_CURRENCY_OPTIONS)}
        </div>
      </div>
      <div className="balance-card card reserve">
        <div className="balance-title">
          {typeof ReserveIcon === 'string' ? (
            <img src={ReserveIcon} alt="Reserve" className="balance-icon" />
          ) : (
            <ReserveIcon className="balance-icon" />
          )}
          {t('account_page_reserve_balance')}
        </div>
        <div className="balance-value">
          {localizeNumber(
            account.info?.reserve ?? 0,
            lang,
            XRP_CURRENCY_OPTIONS,
          )}
        </div>
      </div>
    </div>
  )
}

export default Balances
