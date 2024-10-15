import { Trans } from 'react-i18next'
import { Account } from '../../../shared/components/Account'
import { computeMPTIssuanceBalanceChange } from '../../../shared/utils'

const render = (t, language, action, node, index) => {
  const { previousBalance, finalBalance, account, change } =
    computeMPTIssuanceBalanceChange(node)
  const previousBalanceStr = previousBalance.toString(10)
  const finalBalanceStr = finalBalance.toString(10)
  const changeStr = change.toString(10)

  const line1 = (
    <Trans i18nKey="transaction_mpt_issuance_line_one">
      It {action} an MPTokenIssuance node of
      <Account account={account} />
    </Trans>
  )

  const line2 =
    change !== BigInt(0) ? (
      <ul key={`balance_${index}`} className="meta-line">
        <li>
          <Trans i18nKey="transaction_outstanding_balance_line_two">
            Outstanding balance changed by
            <b>{changeStr}</b>
            from
            <b>{previousBalanceStr}</b>
            to
            <b>{finalBalanceStr}</b>
          </Trans>
        </li>
      </ul>
    ) : null

  return (
    <li key={`mpt_issuance_${action}_${index}`} className="meta-line">
      {line1}
      {line2}
    </li>
  )
}

export default render
