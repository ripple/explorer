import { useTranslation, Trans } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { durationToAccurateHuman } from '../../../utils'
import SocketContext from '../../../SocketContext'
import { getVaultAssetFromLoanBroker } from '../utils/vaultUtils'
import { formatAmountWithAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const {
    loanBrokerID,
    principalRequestedRaw,
    counterparty,
    paymentTotal,
    paymentInterval,
    gracePeriod,
    loanOriginationFeeRaw,
    loanServiceFeeRaw,
    interestRatePercent,
    lateInterestRatePercent,
    overpaymentFeePercent,
  } = instructions

  // Fetch Vault asset information from LoanBroker
  const { data: vaultAsset } = useQuery(
    ['vaultAssetFromLoanBroker', loanBrokerID],
    () => getVaultAssetFromLoanBroker(rippledSocket, loanBrokerID),
    { enabled: !!loanBrokerID && !!rippledSocket },
  )

  // Format amounts with correct currency
  const principalRequested =
    vaultAsset && principalRequestedRaw !== undefined
      ? formatAmountWithAsset(principalRequestedRaw, vaultAsset)
      : undefined

  const loanOriginationFee =
    vaultAsset && loanOriginationFeeRaw !== undefined
      ? formatAmountWithAsset(loanOriginationFeeRaw, vaultAsset)
      : undefined

  const loanServiceFee =
    vaultAsset && loanServiceFeeRaw !== undefined
      ? formatAmountWithAsset(loanServiceFeeRaw, vaultAsset)
      : undefined

  return (
    <div className="loan-set">
      <div className="loan-broker">
        <span className="label">{t('loan_broker_id')}: </span>
        <span className="case-sensitive">
          <b>{loanBrokerID}</b>
        </span>
      </div>

      {principalRequested && (
        <div className="loan-request">
          <span className="label">{t('request')}: </span>
          <Amount value={principalRequested} />
          {counterparty && (
            <>
              <span> {t('from')} </span>
              <Account account={counterparty} />
            </>
          )}
        </div>
      )}

      {(interestRatePercent ||
        lateInterestRatePercent ||
        overpaymentFeePercent) && (
        <div className="rates-section">
          <span className="label">Rates: </span>
          <Trans
            i18nKey="loan_rates_detail"
            components={{
              InterestRate: interestRatePercent ? (
                <span>
                  {t('interest_rate')} {interestRatePercent}
                  {(lateInterestRatePercent || overpaymentFeePercent) && ', '}
                </span>
              ) : (
                <span />
              ),
              LateInterestRate: lateInterestRatePercent ? (
                <span>
                  {t('late_interest_rate')} {lateInterestRatePercent}
                  {overpaymentFeePercent && ', '}
                </span>
              ) : (
                <span />
              ),
              OverpaymentFee: overpaymentFeePercent ? (
                <span>
                  {t('overpayment_fee')} {overpaymentFeePercent}
                </span>
              ) : (
                <span />
              ),
            }}
          />
        </div>
      )}

      {(loanOriginationFee || loanServiceFee) && (
        <div className="fees-section">
          <span className="label">Fees: </span>
          <Trans
            i18nKey="loan_fees_detail"
            components={{
              LoanOriginationFee: loanOriginationFee ? (
                <span>
                  {t('loan_origination_fee')}{' '}
                  <Amount value={loanOriginationFee} />
                  {loanServiceFee && ', '}
                </span>
              ) : (
                <span />
              ),
              LoanServiceFee: loanServiceFee ? (
                <span>
                  {t('loan_service_fee')} <Amount value={loanServiceFee} />
                </span>
              ) : (
                <span />
              ),
            }}
          />
        </div>
      )}

      {(paymentTotal !== undefined ||
        paymentInterval !== undefined ||
        gracePeriod !== undefined) && (
        <div className="terms-section">
          <span className="label">{t('terms')}: </span>
          <Trans
            i18nKey="loan_terms_detail"
            components={{
              PaymentTotal:
                paymentTotal !== undefined ? (
                  <span>
                    {paymentTotal} {t('payment_total')}
                    {(paymentInterval !== undefined ||
                      gracePeriod !== undefined) &&
                      ', '}
                  </span>
                ) : (
                  <span />
                ),
              PaymentInterval:
                paymentInterval !== undefined ? (
                  <span>
                    {t('payment_interval')}{' '}
                    {durationToAccurateHuman(paymentInterval)}
                    {gracePeriod !== undefined && ', '}
                  </span>
                ) : (
                  <span />
                ),
              GracePeriod:
                gracePeriod !== undefined ? (
                  <span>
                    {t('grace_period')} {durationToAccurateHuman(gracePeriod)}
                  </span>
                ) : (
                  <span />
                ),
            }}
          />
        </div>
      )}
    </div>
  )
}
