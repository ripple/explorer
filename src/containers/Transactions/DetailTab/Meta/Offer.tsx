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
import type { Amount } from '../../../shared/types'
import type { MetaRenderFunctionWithTx, MetaNode } from './types'

const isMPTOrIOUAmount = (
  takerAmount: Amount | undefined,
): takerAmount is Exclude<Amount, string> =>
  typeof takerAmount === 'object' && takerAmount !== null

const getCurrency = (takerAmount: Amount | undefined): string => {
  if (!isMPTOrIOUAmount(takerAmount)) return 'XRP'
  if ('mpt_issuance_id' in takerAmount) return takerAmount.mpt_issuance_id
  return takerAmount.currency || 'XRP'
}

const getIsMPT = (takerAmount: Amount | undefined): boolean =>
  isMPTOrIOUAmount(takerAmount) && 'mpt_issuance_id' in takerAmount

const getIssuer = (takerAmount: Amount | undefined): string | undefined => {
  if (!isMPTOrIOUAmount(takerAmount)) return undefined
  if ('mpt_issuance_id' in takerAmount) return undefined
  return takerAmount.issuer
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

// MPTAmount can be up to 2^63 - 1, beyond Number.MAX_SAFE_INTEGER,
// so subtract with BigInt to preserve precision.
const computeChange = (
  prevValue: number | string | undefined,
  finalValue: number | string | undefined,
  isMPT: boolean,
): number | string => {
  if (isMPT && prevValue != null && finalValue != null) {
    return (BigInt(prevValue) - BigInt(finalValue)).toString()
  }
  return Number(prevValue) - Number(finalValue)
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
  const changePays = normalize(
    computeChange(prevPays, finalPays, paysIsMPT),
    paysCurrency,
    paysIsMPT,
  )
  const changeGets = normalize(
    computeChange(prevGets, finalGets, getsIsMPT),
    getsCurrency,
    getsIsMPT,
  )

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
          />
        </b>{' '}
        <Trans i18nKey="decreased_from_to">
          decreased by
          <b>
            {
              {
                change: localizeNumber(
                  changePays,
                  language,
                  options,
                  paysIsMPT,
                ),
              } as any
            }
          </b>
          from
          <b>
            {
              {
                previous: localizeNumber(
                  normalize(prevPays, paysCurrency, paysIsMPT),
                  language,
                  options,
                  paysIsMPT,
                ),
              } as any
            }
          </b>
          to
          <b>
            {
              {
                final: localizeNumber(
                  normalize(finalPays, paysCurrency, paysIsMPT),
                  language,
                  options,
                  paysIsMPT,
                ),
              } as any
            }
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
          />
        </b>{' '}
        <Trans i18nKey="decreased_from_to">
          decreased by
          <b>
            {
              {
                change: localizeNumber(
                  changeGets,
                  language,
                  options,
                  getsIsMPT,
                ),
              } as any
            }
          </b>
          from
          <b>
            {
              {
                previous: localizeNumber(
                  normalize(prevGets, getsCurrency, getsIsMPT),
                  language,
                  options,
                  getsIsMPT,
                ),
              } as any
            }
          </b>
          to
          <b>
            {
              {
                final: localizeNumber(
                  normalize(finalGets, getsCurrency, getsIsMPT),
                  language,
                  options,
                  getsIsMPT,
                ),
              } as any
            }
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
