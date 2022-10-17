import React from 'react'
import { Trans } from 'react-i18next'
import {
  CURRENCY_ORDER,
  CURRENCY_OPTIONS,
  XRP_BASE,
} from '../../shared/transactionUtils'
import { localizeNumber } from '../../shared/utils'
import { Account } from '../../shared/components/Account'

const normalize = (value, currency) =>
  currency === 'XRP' ? (value / XRP_BASE).toString() : value

const renderChanges = (t, language, node, index) => {
  const meta = []
  const final = node.FinalFields
  const prev = node?.PreviousFields
  const paysCurrency = final.TakerPays.currency || 'XRP'
  const getsCurrency = final.TakerGets.currency || 'XRP'
  const finalPays = final.TakerPays.value || final.TakerPays
  const finalGets = final.TakerGets.value || final.TakerGets
  const prevPays = prev?.TakerPays?.value || prev?.TakerPays
  const prevGets = prev?.TakerGets?.value || prev?.TakerGets
  const changePays = normalize(prevPays - finalPays, paysCurrency)
  const changeGets = normalize(prevGets - finalGets, getsCurrency)

  const renderIssuer = (issuer) =>
    issuer ? (
      <>
        .
        <Account account={issuer} />
      </>
    ) : null

  if (prevPays && finalPays) {
    const options = { ...CURRENCY_OPTIONS, currency: paysCurrency }
    meta.push(
      <li key={`taker_pays_decreased_${index}`} className="meta-line">
        <span className="field">TakerPays </span>
        <b>{paysCurrency}</b>
        {renderIssuer(final.TakerPays.issuer)}{' '}
        <Trans Trans i18nKey="decreased_from_to">
          decreased by
          <b>{{ change: localizeNumber(changePays, language, options) }}</b>
          from
          <b>
            {{
              previous: localizeNumber(
                normalize(prevPays, paysCurrency),
                language,
                options,
              ),
            }}
          </b>
          to
          <b>
            {{
              final: localizeNumber(
                normalize(finalPays, paysCurrency),
                language,
                options,
              ),
            }}
          </b>
        </Trans>
      </li>,
    )
  }
  if (prevGets && finalGets) {
    const options = { ...CURRENCY_OPTIONS, currency: getsCurrency }
    meta.push(
      <li key={`taker_gets_decreased_${index}`} className="meta-line">
        <span className="field">TakerGets </span>
        <b>{getsCurrency}</b>
        {renderIssuer(final.TakerGets.issuer)}{' '}
        <Trans Trans i18nKey="decreased_from_to">
          decreased by
          <b>{{ change: localizeNumber(changeGets, language, options) }}</b>
          from
          <b>
            {{
              previous: localizeNumber(
                normalize(prevGets, getsCurrency),
                language,
                options,
              ),
            }}
          </b>
          to
          <b>
            {{
              final: localizeNumber(
                normalize(finalGets, getsCurrency),
                language,
                options,
              ),
            }}
          </b>
        </Trans>
      </li>,
    )
  }

  return (
    <React.Fragment key={`renderOfferChangesMeta_${index}`}>
      {meta}
    </React.Fragment>
  )
}

const render = (t, language, action, node, index, tx) => {
  const lines = []
  const fields = node.FinalFields || node.NewFields
  const paysCurrency = fields.TakerPays.currency || 'XRP'
  const getsCurrency = fields.TakerGets.currency || 'XRP'
  const takerPaysValue = normalize(
    fields.TakerPays.value || fields.TakerPays,
    paysCurrency,
  )
  const invert =
    CURRENCY_ORDER.indexOf(getsCurrency) > CURRENCY_ORDER.indexOf(paysCurrency)
  const pair = invert
    ? `${getsCurrency}/${paysCurrency}`
    : `${paysCurrency}/${getsCurrency}`

  if (
    action === 'created' &&
    tx.TransactionType === 'OfferCreate' &&
    tx.Account === fields.Account &&
    tx.Sequence === fields.Sequence &&
    tx.OfferSequence
  ) {
    lines.push(
      <li key={`offer_replaces_${index}`} className="meta-line">
        {t('offer_replaces')}
        <b> {tx.OfferSequence}</b>
      </li>,
    )
  } else if (action === 'modified') {
    lines.push(
      <li key={`offer_partially_filled_${index}`} className="meta-line">
        {t('offer_partially_filled')}
      </li>,
    )
    lines.push(renderChanges(t, language, node, index))
  } else if (action === 'deleted' && takerPaysValue === '0') {
    lines.push(
      <li key={`offer_filled_${index}`} className="meta-line">
        {t('offer_filled')}
      </li>,
    )
    lines.push(renderChanges(t, language, node, index))
  } else if (action === 'deleted' && tx.TransactionType === 'OfferCancel') {
    lines.push(
      <li key={`offer_cancelled_${index}`} className="meta-line">
        {t('offer_cancelled')}
      </li>,
    )
  } else if (
    action === 'deleted' &&
    tx.TransactionType === 'OfferCreate' &&
    tx.Account === fields.Account &&
    tx.OfferSequence === fields.Sequence
  ) {
    lines.push(
      <li key={`offer_replaced_${index}`} className="meta-line">
        {t('offer_replaced')}
        <b> {tx.Sequence}</b>
      </li>,
    )
  } else if (action === 'deleted') {
    lines.push(
      <li key={`offer_lack_of_funds_${index}`} className="meta-line">
        {t('offer_lack_of_funds')}
      </li>,
    )
    lines.push(renderChanges(t, language, node, index))
  }

  return (
    <li key={`offer_node_meta_${index}`} className="meta-line">
      <Trans i18nKey="offer_node_meta">
        It {action} a <b>{pair}</b>
        owned by
        <Account account={fields.Account} />
        with sequence # <b>{{ sequence: fields.Sequence }}</b>
      </Trans>
      <ul>{lines}</ul>
    </li>
  )
}

export default render
