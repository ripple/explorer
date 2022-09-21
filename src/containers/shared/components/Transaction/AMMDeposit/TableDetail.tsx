import React from 'react'

export const TableDetail = (props: any) => {
  // const { t } = useTranslation()
  const { instructions } = props
  let desc = ''
  if (instructions.amount) {
    desc += instructions.amount.amount
    desc += instructions.amount.currency

    if (instructions.amount2) {
      desc += ' for '
      desc += instructions.amount2.amount
      desc += instructions.amount2.currency
    }
  }

  return <div>{desc}</div>
}
