import { Trans } from 'react-i18next'
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils'
import { localizeNumber } from '../../shared/utils'
import { Account } from '../../shared/components/Account'

const render = (t, language, action, node, index) => {
  const fields = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const { currency } = fields.Balance
  const numberOption = { ...CURRENCY_OPTIONS, currency }
  let finalBalance = fields.Balance.value
  let previousBalance = prev && prev.Balance ? prev.Balance.value : 0
  let account
  let counterAccount

  if (finalBalance < 0) {
    account = fields.HighLimit.issuer
    counterAccount = fields.LowLimit.issuer
    finalBalance = 0 - finalBalance
    previousBalance = 0 - previousBalance
  } else {
    account = fields.LowLimit.issuer
    counterAccount = fields.HighLimit.issuer
  }

  const change = finalBalance - previousBalance

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
