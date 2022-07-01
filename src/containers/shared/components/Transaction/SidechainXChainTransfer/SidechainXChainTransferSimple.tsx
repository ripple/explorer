import React from 'react';
import { useTranslation } from 'react-i18next';
import Account from '../../Account';
import { Amount } from '../../Amount';
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types';
import SimpleRow from '../SimpleRow';

const SidechainCreateSimple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const {
    amount,
    sourceDoor,
    sourceIssue,
    destinationDoor,
    destinationIssue,
    xchainSequence,
  } = data.instructions;

  return (
    <>
      <SimpleRow label={t('cross-chain_amount')}>
        <Amount value={amount} />
      </SimpleRow>
      <SimpleRow label={t('cross-chain_sequence')}>{xchainSequence}</SimpleRow>
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
export default SidechainCreateSimple;
