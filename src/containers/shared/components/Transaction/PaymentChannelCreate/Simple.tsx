import React from 'react'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { data } = props

  return <>{data}</>
}
export { Simple }
