import { useTranslation, Trans } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import SocketContext from '../../../SocketContext'
import { getVaultAsset } from '../utils/vaultUtils'
import { formatAmountWithAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const {
    vaultID,
    debtMaximumRaw,
    managementFeeRatePercent,
    coverRateMinimumPercent,
    coverRateLiquidationPercent,
  } = instructions

  // Fetch Vault asset information to format DebtMaximum correctly
  const { data: vaultAsset } = useQuery(
    ['vaultAsset', vaultID],
    () => getVaultAsset(rippledSocket, vaultID),
    {
      enabled: !!vaultID && !!rippledSocket,
    },
  )

  // Format DebtMaximum with correct currency
  const debtMaximum =
    vaultAsset && debtMaximumRaw !== undefined
      ? formatAmountWithAsset(debtMaximumRaw, vaultAsset)
      : undefined

  return (
    <div className="loan-broker-set">
      <div className="vault-id">
        <span className="label">{t('vault_id')}: </span>
        <span className="case-sensitive">
          <b>{vaultID}</b>
        </span>
      </div>

      {(coverRateMinimumPercent ||
        coverRateLiquidationPercent ||
        managementFeeRatePercent) && (
        <div className="rates-section">
          <span className="label">{t('rates')}: </span>
          <Trans
            i18nKey="loan_broker_rates_detail"
            components={{
              ManagementFeeRate: managementFeeRatePercent ? (
                <span>
                  {t('management_fee_rate')} {managementFeeRatePercent}
                  {(coverRateMinimumPercent || coverRateLiquidationPercent) &&
                    ', '}
                </span>
              ) : (
                <span />
              ),
              CoverRateMinimum: coverRateMinimumPercent ? (
                <span>
                  {t('cover_rate_minimum')} {coverRateMinimumPercent}
                  {coverRateLiquidationPercent && ', '}
                </span>
              ) : (
                <span />
              ),
              CoverRateLiquidation: coverRateLiquidationPercent ? (
                <span>
                  {t('cover_rate_liquidation')} {coverRateLiquidationPercent}
                </span>
              ) : (
                <span />
              ),
            }}
          />
        </div>
      )}

      <div className="debt-maximum">
        <span className="label">{t('debt_maximum')}: </span>
        {debtMaximum && debtMaximum.amount !== 0 ? (
          <Amount value={debtMaximum} />
        ) : (
          <span>{t('no_limit')}</span>
        )}
      </div>
    </div>
  )
}
