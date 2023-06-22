import { useTranslation } from 'react-i18next'
import { TransactionActionIcon } from '../../TransactionActionIcon/TransactionActionIcon'
import { SimpleGroup } from '../SimpleGroup'
import { SimpleRow } from '../SimpleRow'
import { TransactionAction, TransactionSimpleProps } from '../types'
import { HookData, SetHookInstructions } from './types'

const TxPill = ({ txType: string }) => (
  <TransactionActionIcon action={TransactionAction.MODIFY} />
)

const Hook = (hook: HookData) => {
  const { t } = useTranslation()
  return (
    <SimpleGroup title={t('hook')} key={hook.HookHash}>
      <SimpleRow label={t('hash')} data-test="hook-hash">
        {hook.HookHash ?? 'undefined'}
      </SimpleRow>
      <SimpleRow label={t('on')} data-test="hook-on">
        {hook.HookOn ?? 'undefined'}
        <TxPill txType="AccountSet" />
      </SimpleRow>
    </SimpleGroup>
  )
}

export const Simple = ({
  data,
}: TransactionSimpleProps<SetHookInstructions>) => {
  const { hooks } = data.instructions
  console.log(hooks)

  return <>{hooks.map(Hook)}</>
}
