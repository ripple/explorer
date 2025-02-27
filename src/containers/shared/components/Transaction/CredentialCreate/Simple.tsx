import { useTranslation } from 'react-i18next'
import { type CredentialCreate } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { localizeDate } from '../../../utils'
import { useLanguage } from '../../../hooks'
import {
  convertRippleDate,
  MILLIS_PER_SECOND,
} from '../../../../../rippled/lib/convertRippleDate'
import { DATE_OPTIONS } from '../../../transactionUtils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialCreate>,
) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { data } = props
  const {
    Subject: subject,
    CredentialType: credentialType,
    Expiration: expiration,
    URI: uri,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('subject')} data-test="subject">
        {subject}
      </SimpleRow>

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(credentialType)}
      </SimpleRow>

      {expiration && (
        <SimpleRow label={t('expiration')} data-test="expiration">
          {localizeDate(
            new Date(convertRippleDate(expiration) * MILLIS_PER_SECOND),
            language,
            DATE_OPTIONS,
          )}
        </SimpleRow>
      )}
      {uri && (
        <SimpleRow label={t('uri')} data-test="uri">
          {convertHexToString(uri)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
