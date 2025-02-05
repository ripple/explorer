import { useTranslation } from 'react-i18next'
import { encodeNodePublic } from 'ripple-address-codec'

import { hexToBytes } from '@xrplf/isomorphic/utils'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { UNLModify } from './types'
import { RouteLink } from '../../../routing'
import { VALIDATOR_ROUTE } from '../../../../App/routes'

export const Simple = ({ data }: TransactionSimpleProps<UNLModify>) => {
  const { t } = useTranslation()
  const tx = data.instructions

  const encoded = encodeNodePublic(hexToBytes(tx.UNLModifyValidator))

  return (
    <>
      <SimpleRow label={t('validator')} data-testid="validator">
        <RouteLink to={VALIDATOR_ROUTE} params={{ identifier: encoded }}>
          {encoded}
        </RouteLink>
      </SimpleRow>
      <SimpleRow label={t('action')} data-testid="action">
        {tx.UNLModifyDisabling ? 'DISABLE' : 'ENABLE'}
      </SimpleRow>
    </>
  )
}
