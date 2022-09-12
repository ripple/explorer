import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { SignerListSetInstructions } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<SignerListSetInstructions>) => {
  const { t } = useTranslation()
  const { quorum, maxSigners, signers } = instructions
  return signers?.length ? (
    <>
      <span className="label">{t('signers')}:</span>{' '}
      <span>{signers.length}</span>
      {' - '}
      <span className="label">{t('quorum')}:</span>{' '}
      <span>{`${quorum}/${maxSigners}`}</span>
    </>
  ) : (
    <div className="unset">{t('unset_signer_list')}</div>
  )
}
