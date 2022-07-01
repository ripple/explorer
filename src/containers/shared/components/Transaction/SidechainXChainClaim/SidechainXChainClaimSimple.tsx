import React from 'react';
import { useTranslation } from 'react-i18next';
import Account from '../../Account';
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types';
import SimpleRow from '../SimpleRow';

const SidechainXChainClaimSimple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const { account, sourceDoor, sourceIssue, destinationDoor, destinationIssue } = data.instructions;

  return (
    <>
      <SimpleRow label={t('from_account')}>
        <Account account={account} />
      </SimpleRow>
      <SimpleRow label={t('source_chain_door')}>
        <Account account={sourceDoor} />
      </SimpleRow>
      <SimpleRow label={t('source_chain_issue')}>{sourceIssue}</SimpleRow>
      <SimpleRow label={t('destination_chain_door')}>
        <Account account={destinationDoor} />
      </SimpleRow>
      <SimpleRow label={t('destination_chain_issue')}>{destinationIssue}</SimpleRow>
    </>
  );
};
export default SidechainXChainClaimSimple;
