import { Fragment } from 'react'
import { Trans } from 'react-i18next'
import {
  CURRENCY_ORDER,
  CURRENCY_OPTIONS,
  XRP_BASE,
} from '../../../shared/transactionUtils'
import { localizeNumber } from '../../../shared/utils'
import { Account } from '../../../shared/components/Account'
import Currency from '../../../shared/components/Currency'
import type { MetaRenderFunctionWithTx, MetaNode } from './types'

const getCurrency = (takerAmount: any): string => {
  if (takerAmount?.mpt_issuance_id) return takerAmount.mpt_issuance_id
  return takerAmount?.currency || 'XRP'
}

const getIsMPT = (takerAmount: any): boolean => !!takerAmount?.mpt_issuance_id

const getIssuer = (takerAmount: any): string | undefined => {
  if (takerAmount?.mpt_issuance_id) return undefined
  return takerAmount?.issuer
}

const normalize = (
  value: number | string,
  currency: string,
  isMPT: boolean = false,
): string => {
  if (isMPT) return String(value)
  return currency === 'XRP'
    ? (Number(value) / XRP_BASE).toString()
    : String(value)
}

const renderChanges = (
  _t: any,
  language: string,
  node: MetaNode,
  index: number,
) => {
  const meta: JSX.Element[] = []
  const final = node.FinalFields
  const prev = node?.PreviousFields
  const paysCurrency = getCurrency(final.TakerPays)
  const getsCurrency = getCurrency(final.TakerGets)
  const paysIsMPT = getIsMPT(final.TakerPays)
  const getsIsMPT = getIsMPT(final.TakerGets)
  const finalPays = final.TakerPays.value || final.TakerPays
  const finalGets = final.TakerGets.value || final.TakerGets
  const prevPays = prev?.TakerPays?.value || prev?.TakerPays
  const prevGets = prev?.TakerGets?.value || prev?.TakerGets
  const changePays = normalize(prevPays - finalPays, paysCurrency, paysIsMPT)
  const changeGets = normalize(prevGets - finalGets, getsCurrency, getsIsMPT)

  if (prevPays && finalPays) {
    const options = { ...CURRENCY_OPTIONS, currency: paysCurrency }
    meta.push(
      <li key={`taker_pays_decreased_${index}`} className="meta-line">
        <span className="field">TakerPays </span>
        <b>
          <Currency
            currency={paysCurrency}
            issuer={getIssuer(final.TakerPays)}
            isMPT={paysIsMPT}
            displaySymbol={false}
            shortenMPTIssuanceID
          />
        </b>{' '}
        <Trans i18nKey="decreased_from_to">
          decreased by
          <b>{{ change: localizeNumber(changePays, language, options) }}</b>
          from
          <b>
            {{
              previous: localizeNumber(
                normalize(prevPays, paysCurrency, paysIsMPT),
                language,
                options,
              ),
            }}
          </b>
          to
          <b>
            {{
              final: localizeNumber(
                normalize(finalPays, paysCurrency, paysIsMPT),
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
        <b>
          <Currency
            currency={getsCurrency}
            issuer={getIssuer(final.TakerGets)}
            isMPT={getsIsMPT}
            displaySymbol={false}
            shortenMPTIssuanceID
          />
        </b>{' '}
        <Trans i18nKey="decreased_from_to">
          decreased by
          <b>{{ change: localizeNumber(changeGets, language, options) }}</b>
          from
          <b>
            {{
              previous: localizeNumber(
                normalize(prevGets, getsCurrency, getsIsMPT),
                language,
                options,
              ),
            }}
          </b>
          to
          <b>
            {{
              final: localizeNumber(
                normalize(finalGets, getsCurrency, getsIsMPT),
                language,
                options,
              ),
            }}
          </b>
        </Trans>
      </li>,
    )
  }

  return <Fragment key={`renderOfferChangesMeta_${index}`}>{meta}</Fragment>
}

const render: MetaRenderFunctionWithTx = (
  t,
  language,
  action,
  node,
  index,
  tx,
) => {
  const lines: JSX.Element[] = []
  const fields = node.FinalFields || node.NewFields
  const paysCurrency = getCurrency(fields.TakerPays)
  const getsCurrency = getCurrency(fields.TakerGets)
  const paysIsMPT = getIsMPT(fields.TakerPays)
  const getsIsMPT = getIsMPT(fields.TakerGets)
  const takerPaysValue = normalize(
    fields.TakerPays.value || fields.TakerPays,
    paysCurrency,
    paysIsMPT,
  )
  const invert =
    CURRENCY_ORDER.indexOf(getsCurrency) > CURRENCY_ORDER.indexOf(paysCurrency)

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
      <Trans
        i18nKey="offer_node_meta"
        values={{ action, sequence: fields.Sequence }}
        components={{
          Currency: (
            <Currency
              currency={invert ? getsCurrency : paysCurrency}
              issuer={
                invert ? getIssuer(tx.TakerGets) : getIssuer(tx.TakerPays)
              }
              isMPT={invert ? getsIsMPT : paysIsMPT}
              displaySymbol={false}
              shortenIssuer
              shortenMPTIssuanceID
            />
          ),
          Currency2: (
            <Currency
              currency={invert ? paysCurrency : getsCurrency}
              issuer={
                invert ? getIssuer(tx.TakerPays) : getIssuer(tx.TakerGets)
              }
              isMPT={invert ? paysIsMPT : getsIsMPT}
              displaySymbol={false}
              shortenIssuer
              shortenMPTIssuanceID
            />
          ),
          Account: <Account account={fields.Account} />,
        }}
      />
      <ul>{lines}</ul>
    </li>
  )
}

export default render
