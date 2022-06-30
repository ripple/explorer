import React from 'react';
import { useTranslation } from 'react-i18next';
import Account from '../../Account';
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types';

export const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const { account, sourceDoor, sourceIssue, destinationDoor, destinationIssue } = data.instructions;

  return (
    <>
      <div className="row">
        <div className="label">{t('from account')}</div>
        <div className="value">
          <Account account={account} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('source chain door')}</div>
        <div className="value">
          <Account account={sourceDoor} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('source chain issue')}</div>
        <div className="value">{sourceIssue}</div>
      </div>
      <div className="row">
        <div className="label">{t('destination chain door')}</div>
        <div className="value">
          <Account account={destinationDoor} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('destination chain issue')}</div>
        <div className="value">{destinationIssue}</div>
      </div>
    </>
  );
};
