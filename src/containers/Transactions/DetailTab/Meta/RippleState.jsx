import { Trans } from 'react-i18next'
import { Account } from '../../../shared/components/Account'
import {
  localizeNumber,
  computeRippleStateBalanceChange,
} from '../../../shared/utils'

const render = (t, language, action, node, index) => {
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
    <Trans i18nKey="transaction_balance_line_one">
      It {action} a <b>{currency}</b>
      ripplestate node between
      <Account account={account} />
      and
      <Account account={counterAccount} />
    </Trans>
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
