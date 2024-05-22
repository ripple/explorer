import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import parsePayment from 'xrpl-tx-path-parser'
import { Account } from '../../shared/components/Account'
import { Amount } from '../../shared/components/Amount'
import { formatAmount } from '../../../rippled/lib/txSummary/formatAmount'
import Currency from '../../shared/components/Currency'

import './breakDownTab.scss'

// import {
//   createSourceAmount,
//   createPaymentDefaultPaths,
//   amountToBalance,
// } from 'xrpl-tx-path-parser'

export const BreakDownTab: FC<{ data: any }> = ({ data }) => {
  const { t } = useTranslation()
  const [selectedView, setView] = useState('source')

  const hexToString = (hex: string) => {
    let string = ''
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
    const balances = []
    data.forEach((change, index) => {
      change.value *= -1

      let balanceLabel =
        type === 'direct' ? 'recieved' : change.value < 0 ? 'sold' : 'bought'
      if (type === 'direct') {
        change.value *= -1
      }
      if (!label) {
        balanceLabel = ''
      }
      balances.push(
        <li key={index}>
          {balanceLabel} <Amount value={formatAmount(change)} />
        </li>,
      )
    })

    return <ul>{balances}</ul>
  }
  // eslint-disable-next-line react/no-unstable-nested-components
  const Transaction: FC<{ parsed: any; account: Account }> = ({
    parsed,
    account,
  }) => {
    const changes = []
    parsed.accountBalanceChanges.forEach((change, index) => {
      if (account !== change.account) {
        let type: String = ''
        let span_class: String = ''
        if (change.isDirect) {
          type = 'direct'
          span_class = 'badge direct'
        }
        if (change.isAMM) {
          type = 'amm'
          span_class = 'badge amm'
        }
        if (change.isOffer) {
          type = 'dex'
          span_class = 'badge dex'
        }
        if (change.isRippling) {
          type = 'rippling'
          span_class = 'badge rippling'
        }
        changes.push(
          <p key={`${index}-p`}>
            <span className={span_class}>{type}</span>{' '}
            <Account account={change.account} />
          </p>,

          <BalanceChange
            key={`${index}-b`}
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
  const Cylindars: FC<{ parsed: any; account: Account }> = ({
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
          // if (parsed.sourceAmount.currency === balance.currency) {
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
    const XRP = 'XRP'
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
        <p>{t('graph_dependant_currency')}</p>
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
    data.tx.meta = data.meta
    // delete mutate.meta
    try {
      const parsed = parsePayment(data.tx)
      if (
        parsed.sourceAmount.value === '0' &&
        data.tx.TransactionType === 'OfferCreate'
      ) {
        return <h3>{t('The offer has not crossed anything yet.')}</h3>
      }

      return (
        <div className="row">
          <div className="detail-section">
            <div className="title">{data.tx.TransactionType}</div>
            <div>
              Source: <Account account={parsed.sourceAccount} />
            </div>
            <div>
              <Amount value={formatAmount(parsed.sourceAmount)} />
            </div>
            <br />
            <div>
              Destination: <Account account={parsed.destinationAccount} />
            </div>
            <div>
              <Amount value={formatAmount(parsed.destinationAmount)} />
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
