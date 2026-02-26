import { Trans } from 'react-i18next'
import { Account } from '../../../shared/components/Account'
import {
  localizeNumber,
  computeRippleStateBalanceChange,
} from '../../../shared/utils'
import { RouteLink } from '../../../shared/routing'
import { ENTRY_ROUTE } from '../../../App/routes'
import Currency from '../../../shared/components/Currency'
import type { MetaRenderFunction } from './types'

const render: MetaRenderFunction = (_t, language, action, node, index) => {
  const {
    change,
    numberOption,
    previousBalance,
    finalBalance,
    currency,
    account,
    counterAccount,
  } = computeRippleStateBalanceChange(node)

  const line1 = (
    <Trans
      i18nKey="transaction_balance_line_one"
      values={{ action }}
      components={{
        Currency: <Currency currency={currency} />,
        Link: (
          <RouteLink to={ENTRY_ROUTE} params={{ id: node.LedgerIndex }}>
            {/* Content from i18n */}
          </RouteLink>
        ),
        Account: <Account account={account} />,
        CounterAccount: <Account account={counterAccount} />,
      }}
    />
  )

  const line2 = change ? (
    <ul key={`balance_${index}`} className="meta-line">
      <li>
        <Trans i18nKey="transaction_balance_line_two">
          Balance changed by
          <b>{localizeNumber(change, language, numberOption)}</b>
          from
          <b>{localizeNumber(previousBalance, language, numberOption)}</b>
          to
          <b>{localizeNumber(finalBalance, language, numberOption)}</b>
        </Trans>
      </li>
    </ul>
  ) : null

  return (
    <li key={`ripple_state_${action}_${index}`} className="meta-line">
      {line1}
      {line2}
    </li>
  )
}

export default render
