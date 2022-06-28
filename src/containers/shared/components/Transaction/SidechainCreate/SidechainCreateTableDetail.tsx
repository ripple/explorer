import React from 'react';
import { useTranslation } from 'react-i18next';
import { Amount } from '../../Amount';

const SidechainCreateTableDetail = (props: any) => {
  const { t } = useTranslation();
  const { instructions } = props;
  const { gets, pays, price, pair, cancel } = instructions;

  return pays && gets ? (
    <div className="offercreate">
      <div className="price">
        <span className="label"> {t('price')}:</span>
        <span className="amount">
          {` ${Number(price)} `}
          {pair}
        </span>
      </div>
      <div className="amounts">
        <span className="label">{t('buy')}</span>
        <Amount value={gets} />
        <span className="label">{`- ${t('sell')}`}</span>
        <Amount value={pays} />
      </div>
      {cancel && (
        <div className="cancel">
          <span className="label">{t('cancel_offer')}</span>
          {` #`}
          <span className="sequence">{cancel}</span>
        </div>
      )}
    </div>
  ) : null;
};

export default SidechainCreateTableDetail;
