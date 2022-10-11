import React from 'react'
import './styles.scss'
import { useTranslation } from 'react-i18next'

interface Props {
  flags: string[]
}

export const Settings = ({ flags }: Props) => {
  const { t } = useTranslation()

  const burnable = flags.includes('lsfBurnable') ? 'enabled' : 'disabled'
  const onlyXRP = flags.includes('lsfOnlyXRP') ? 'enabled' : 'disabled'
  const trustLine = flags.includes('lsfTrustLine') ? 'enabled' : 'disabled'
  const transferable = flags.includes('lsfTransferable')
    ? 'enabled'
    : 'disabled'

  return (
    <table className="token-table">
      <tbody>
        <tr className="row">
          <td className="col1">{t('burnable')}</td>
          <td className="col2">{burnable}</td>
        </tr>
        <tr className="row">
          <td className="col1">{t('only_xrp')}</td>
          <td className="col2">{onlyXRP}</td>
        </tr>
        <tr className="row">
          <td className="col1">{t('trust_line')}</td>
          <td className="col2">{trustLine}</td>
        </tr>
        <tr className="row">
          <td className="col1">{t('transferable')}</td>
          <td className="col2">{transferable}</td>
        </tr>
      </tbody>
    </table>
  )
}
