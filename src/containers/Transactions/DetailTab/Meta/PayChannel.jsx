import { Trans } from 'react-i18next'
import { CURRENCY_OPTIONS } from '../../../shared/transactionUtils'
import { localizeNumber } from '../../../shared/utils'
import { Account } from '../../../shared/components/Account'

const MILLION = 1000000

const render = (t, language, action, node, index) => {
  const fields = node.FinalFields || node.NewFields
  const prev = node.PreviousFields
  const numberOption = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  const prevBalance = prev && prev.Balance ? prev.Balance : null
  const prevAmount = prev && prev.Amount ? prev.Amount : null

  const line1 = (
    <Trans i18nKey="paychannel_node_line1">
      It {action} a PayChannel node from
      <Account account={fields.Account} />
      to
      <Account account={fields.Destination} />
    </Trans>
  )

  const line2 = prevBalance ? (
    <li>
      <Trans i18nKey="paychannel_balance_changed">
        Balance changed by
        <b>
          {localizeNumber(
            (fields.Balance - prevBalance) / MILLION,
            language,
            numberOption,
          )}
          <small>XRP</small>
        </b>
        from
        <b>
          {localizeNumber(prevBalance / MILLION, language, numberOption)}
          <small>XRP</small>
        </b>
        to
        <b>
          {localizeNumber(fields.Balance / MILLION, language, numberOption)}
          <small>XRP</small>
        </b>
      </Trans>
    </li>
  ) : null

  const line3 = prevAmount ? (
    <li>
      <Trans i18nKey="paychannel_amount_changed">
        Amount changed by
        <b>
          {localizeNumber(
            (fields.Amount - prevAmount) / MILLION,
            language,
            numberOption,
          )}
          <small>XRP</small>
        </b>
        from
        <b>
          {localizeNumber(prevAmount / MILLION, language, numberOption)}
          <small>XRP</small>
        </b>
        to
        <b>
          {localizeNumber(fields.Amount / MILLION, language, numberOption)}
          <small>XRP</small>
        </b>
      </Trans>
    </li>
  ) : null

  return (
    <li key={`paychannel_${action}_${index}`} className="meta-line">
      {line1}
      {line2 || line3 ? (
        <ul>
          {line2}
          {line3}
        </ul>
      ) : null}
    </li>
  )
}

export default render
