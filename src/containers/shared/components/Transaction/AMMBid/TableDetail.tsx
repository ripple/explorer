import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { gets, pays, price, pair, cancel } = instructions

  return pays && gets ? (
    <div className="offercreate">
      <div className="price" data-test="pair">
        <span className="label">{t('price')}:</span>
        <span className="amount">
          {` ${Number(price)} `}
          {pair}
        </span>
      </div>
      <div className="amounts">
        <span className="label">{t('buy')}</span>
        <Amount value={gets} data-test="amount-buy" />
        <span className="label">{`- ${t('sell')}`}</span>
        <Amount value={pays} data-test="amount-sell" />
      </div>
      {cancel && (
        <div className="cancel" data-test="cancel-id">
          <span className="label">{t('cancel_offer')}</span>
          {` #`}
          <span className="sequence">{cancel}</span>
        </div>
      )}
    </div>
  ) : null
}
