import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TransactionMeta } from './Meta'
import { TransactionDescription } from './Description'
import { Account } from '../../shared/components/Account'
import { localizeDate, localizeNumber } from '../../shared/utils'
import {
  DATE_OPTIONS,
  CURRENCY_OPTIONS,
  SUCCESSFUL_TRANSACTION,
  XRP_BASE,
  buildFlags,
  buildMemos,
  getSponsorScopes,
  SPONSOR_SCOPE_LABEL_KEYS,
} from '../../shared/transactionUtils'
import './detailTab.scss'
import { useLanguage } from '../../shared/hooks'
import { HookDetails } from './HookDetails'
import { RouteLink } from '../../shared/routing'
import { LEDGER_ROUTE } from '../../App/routes'

export const DetailTab: FC<{ data: any }> = ({ data }) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderStatus = () => {
    const { TransactionResult } = data.meta
    const time = localizeDate(new Date(data.date), language, DATE_OPTIONS)
    let line1

    if (TransactionResult === SUCCESSFUL_TRANSACTION) {
      line1 = t('successful_transaction')
    } else {
      line1 = (
        <Trans i18nKey="fail_transaction" values={{ code: TransactionResult }}>
          <span className="tx-result fail" />
        </Trans>
      )
    }

    return (
      <div className="detail-section" data-testid="status">
        <div className="title">{t('status')}</div>
        {line1}
        {t('transaction_validated')}
        <RouteLink
          className="ledger"
          to={LEDGER_ROUTE}
          params={{ identifier: data.ledger_index }}
        >
          {data.ledger_index}
        </RouteLink>
        {t('on')}
        <span className="time">{`${time} ${DATE_OPTIONS.timeZone}`}</span>
      </div>
    )
  }

  const renderMemos = () => {
    const memos = buildMemos(data)
    return memos.length ? (
      <div className="detail-section">
        <div className="title">
          {t('memos')}
          <span>({t('decoded_hex')})</span>
        </div>
        {memos.map((memo) => (
          <div key={memo}>{memo}</div>
        ))}
      </div>
    ) : null
  }

  const renderFee = () => {
    const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const totalCost = data.tx.Fee
      ? localizeNumber(
          Number.parseFloat(data.tx.Fee) / XRP_BASE,
          language,
          numberOptions,
        )
      : null
    return (
      totalCost && (
        <div className="detail-section">
          <div className="title transaction-cost">{t('transaction_cost')}</div>
          <div>
            {t('transaction_consumed_fee')}
            <b>
              <span> {totalCost}</span>
              <small>XRP</small>
            </b>
          </div>
        </div>
      )
    )
  }

  const renderFlags = () => {
    const flags = buildFlags(data)
    return flags.length ? (
      <div className="detail-section">
        <div className="title">{t('flags')}</div>
        <div className="flags">
          {flags.map((flag) => (
            <div key={flag}>{flag}</div>
          ))}
        </div>
      </div>
    ) : null
  }

  const renderSponsor = () => {
    if (!data.tx.Sponsor) return null
    const scopes = getSponsorScopes(data.tx.SponsorFlags)
    return (
      <div className="detail-section" data-testid="sponsor-section">
        <div className="title">{t('sponsor')}</div>
        <div>
          <Trans
            i18nKey="sponsor_detail"
            components={{ Account: <Account account={data.tx.Sponsor} /> }}
          />
        </div>
        {scopes.length > 0 && (
          <div className="sponsor-scopes">
            {scopes
              .map((scope) => t(SPONSOR_SCOPE_LABEL_KEYS[scope]))
              .join(', ')}
          </div>
        )}
        {data.tx.SponsorSignature && (
          <div className="sponsor-co-signed">{t('sponsor_co_signed')}</div>
        )}
      </div>
    )
  }

  const renderSigners = () =>
    data.tx.Signers ? (
      <div className="detail-section">
        <div className="title">{t('signers')}</div>
        <ul className="signers">
          {data.tx.Signers.map((d) => (
            <li key={d.Signer.Account}>
              <Account account={d.Signer.Account} />
            </li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <div className="detail-body">
      {renderStatus()}
      <TransactionDescription data={data} />
      {renderSigners()}
      {renderSponsor()}
      <HookDetails data={data} />
      {renderFlags()}
      {renderFee()}
      {renderMemos()}
      <TransactionMeta data={data} />
    </div>
  )
}
