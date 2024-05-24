import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import pathParser from 'xrpl-tx-path-parser'
import { Account } from '../../shared/components/Account'
import { Amount } from '../../shared/components/Amount'
import { formatAmount } from '../../../rippled/lib/txSummary/formatAmount'
import './breakDownTab.scss'

export const BreakDownTab: FC<{ data: any }> = ({ data }) => {
  const { t } = useTranslation()
  const [selectedView, setView] = useState('source')

  const hexToString = (hex: string) => {
    let string: string = ''
    for (let i = 0; i < hex.length; i += 2) {
      const part = hex.substring(i, i + 2)
      const code = parseInt(part, 16)
      if (!isNaN(code) && code !== 0) {
        string += String.fromCharCode(code)
      }
    }
    return string
  }
  const BalanceChange: FC<{
    data: any
    label: Boolean
    type: String
  }> = ({ data, label, type }) => {
    const balances: string[] = []
    data.forEach((change: any, index: any) => {
      const amount = change
      amount.value *= -1

      let balanceLabel: string =
        type === 'direct'
          ? 'recieved'
          : amount.value < 0
          ? t('sold')
          : t('bought')
      if (type === 'direct') {
        amount.value *= -1
      }
      if (!label) {
        balanceLabel = ''
      }
      balances.push(
        <li key={String(index)}>
          {balanceLabel} <Amount value={formatAmount(amount)} />
        </li>,
      )
    })

    return <ul>{balances}</ul>
  }
  // eslint-disable-next-line react/no-unstable-nested-components
  const Transaction: FC<{ parsed: any; account: any }> = ({
    parsed,
    account,
  }) => {
    const changes: string[] = []
    parsed.accountBalanceChanges.forEach((change, index) => {
      if (account !== change.account) {
        let type: string = ''
        let spanClass: string = ''
        if (change.isDirect) {
          type = 'direct'
          spanClass = 'badge direct'
        }
        if (change.isAMM) {
          type = 'amm'
          spanClass = 'badge amm'
        }
        if (change.isOffer) {
          type = 'dex'
          spanClass = 'badge dex'
        }
        if (change.isRippling) {
          type = 'rippling'
          spanClass = 'badge rippling'
        }
        changes.push(
          <p key={`${String(index)}-p`}>
            <span className={spanClass}>{type}</span>{' '}
            <Account account={change.account} />
          </p>,

          <BalanceChange
            key={`${String(index)}-b`}
            data={change.balances}
            label={!change.isRippling}
            type={type}
          />,
        )
      }
    })

    return <div>{changes}</div>
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const Cylindars: FC<{ parsed: any; account: any }> = ({
    parsed,
    account,
  }) => {
    const sum = {
      amm: 0,
      rippling: 0,
      dex: 0,
      direct: 0,
      total: 0,
    }
    parsed.accountBalanceChanges.forEach((change) => {
      if (account !== change.account) {
        change.balances.forEach((balance) => {
          if (
            (selectedView === 'source' &&
              parsed.destinationAmount.currency === balance.currency) ||
            (selectedView === 'destination' &&
              parsed.sourceAmount.currency === balance.currency)
          ) {
            if (change.isAMM) {
              sum.amm += balance.value * -1
              sum.total += balance.value * -1
            }
            if (change.isOffer) {
              sum.dex += balance.value * -1
              sum.total += balance.value * -1
            }
            if (change.isDirect) {
              sum.direct += balance.value * 1
              sum.total += balance.value * 1
            }
            if (change.isRippling && balance.value * 1 > 0) {
              sum.rippling +=
                selectedView === 'destination'
                  ? balance.value * -1
                  : balance.value * 1
            }
          }
        })
      }
    })

    const NON_STANDARD_CODE_LENGTH = 40
    const LP_TOKEN_IDENTIFIER = '03'
    const destinationCurrencyCode =
      parsed.destinationAmount.currency?.length === NON_STANDARD_CODE_LENGTH &&
      parsed.destinationAmount.currency?.substring(0, 2) !== LP_TOKEN_IDENTIFIER
        ? hexToString(parsed.destinationAmount.currency)
        : parsed.destinationAmount.currency
    const sourceCurrencyCode =
      parsed.sourceAmount.currency?.length === NON_STANDARD_CODE_LENGTH &&
      parsed.sourceAmount.currency?.substring(0, 2) !== LP_TOKEN_IDENTIFIER
        ? hexToString(parsed.sourceAmount.currency)
        : parsed.sourceAmount.currency

    return (
      <div>
        {/* <h5>
          AMM: {sum.amm} {(sum.amm / sum.total) * 100}
        </h5>
        <h5>
          RIPPLING: {sum.rippling} {(sum.rippling / sum.total) * 100}
        </h5>
        <h5>
          DEX: {sum.dex} {(sum.dex / sum.total) * 100}
        </h5>
        <h5>
          DIRECT: {sum.direct} {(sum.direct / sum.total) * 100}
        </h5>
        <h5>TOTAL: {sum.total}</h5> */}

        <select
          value={selectedView} // ...force the select's value to match the state variable...
          onChange={(e) => setView(e.target.value)}
        >
          <option value="source">
            {sourceCurrencyCode} {t('source')}
          </option>
          <option value="destination">
            {destinationCurrencyCode} {t('destination')}
          </option>
        </select>
        <p>{t('graph_dependent_currency')}</p>
        <div className="rectangle-row">
          <div
            className="rectangle"
            style={{
              ['--percent-value' as any]: sum.amm / sum.total,
              ['--cylinder-color' as any]: '#ff198b',
            }}
          />
          <span className="margin-text">
            {t('amm')} ({Math.round((sum.amm / sum.total) * 100)}%)
          </span>
        </div>
        <div className="rectangle-row">
          <div
            className="rectangle"
            style={{
              ['--percent-value' as any]: sum.rippling / sum.total,
              ['--cylinder-color' as any]: '#32e685',
            }}
          />
          <span className="margin-text">
            {t('rippling')} ({Math.round((sum.rippling / sum.total) * 100)}%)
          </span>
        </div>
        <div className="rectangle-row">
          <div
            className="rectangle"
            style={{
              ['--percent-value' as any]: sum.dex / sum.total,
              ['--cylinder-color' as any]: '#19a3ff',
            }}
          />
          <span className="margin-text">
            {t('dex')} ({Math.round((sum.dex / sum.total) * 100)}%)
          </span>
        </div>
        <div className="rectangle-row">
          <div
            className="rectangle"
            style={{
              ['--percent-value' as any]: sum.direct / sum.total,
              ['--cylinder-color' as any]: '#9a52ff',
            }}
          />
          <span className="margin-text">
            {t('direct')} ({Math.round((sum.direct / sum.total) * 100)}%)
          </span>
        </div>
        <div className="rectangle-row">
          <div
            className="rectangle"
            style={{
              ['--percent-value' as any]: 1,
              ['--cylinder-color' as any]: '#faff19',
            }}
          />
          <span className="margin-text">
            {t('total')}{' '}
            <Amount
              value={formatAmount(
                selectedView === 'destination'
                  ? parsed.sourceAmount
                  : parsed.destinationAmount,
              )}
            />
          </span>
        </div>
      </div>
    )
  }

  const renderData = () => {
    if (data === undefined || data.tx === undefined) {
      return null
    }

    const mutated = data
    mutated.tx.meta = data.meta
    try {
      const parsed = pathParser(mutated.tx)
      if (
        parsed.sourceAmount.value === '0' &&
        mutated.tx.TransactionType === 'OfferCreate'
      ) {
        return <h3>{t('no_cross')}</h3>
      }
      return (
        <div className="row">
          <div className="detail-section">
            <div className="title">{mutated.tx.TransactionType}</div>
            <div className="source-account">
              Source: <Account account={parsed.sourceAccount} />
            </div>
            <div className="source-amount">
              <Amount value={formatAmount(parsed.sourceAmount as any)} />
            </div>
            <br />
            <div className="destination-account">
              Destination: <Account account={parsed.destinationAccount} />
            </div>
            <div className="destination-amount">
              <Amount value={formatAmount(parsed.destinationAmount as any)} />
            </div>
          </div>
          <div className="detail-section no-border">
            <div className="title">{t('liquidity_source')}</div>
            <Cylindars parsed={parsed} account={parsed.sourceAccount} />
          </div>
          <div className="detail-section">
            <div className="title">{t('balance_changes')}</div>
            <Transaction parsed={parsed} account={parsed.sourceAccount} />
          </div>
          {/* <
          // debug....
          div className="detail-section">
            <pre>{JSON.stringify(parsed, null, 2)}</pre>
          </div> */}
        </div>
      )
    } catch (e) {
      return <h3>{t('incomplete_transaction')}</h3>
    }
  }

  return <div className="breakdown-body">{renderData()}</div>
}
