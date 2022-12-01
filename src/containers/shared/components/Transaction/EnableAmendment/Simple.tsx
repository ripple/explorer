import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../hooks'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { EnableAmendment } from './types'
import {
  getExpectedDate,
  getRippledVersion,
  nameOfAmendmentID,
} from '../../../amendmentUtils'

const states = {
  loading: 'Loading',
  unknown: 'Unknown',
}

export const Simple = ({ data }: TransactionSimpleProps<EnableAmendment>) => {
  const language = useLanguage()
  const [amendmentDetails, setAmendmentDetails] = useState({
    name: states.loading,
    minRippledVersion: states.loading,
  })

  useEffect(() => {
    nameOfAmendmentID(data.instructions.Amendment).then((name: string) => {
      if (name) {
        getRippledVersion(name).then((rippledVersion) => {
          if (rippledVersion) {
            setAmendmentDetails({
              name,
              minRippledVersion: rippledVersion,
            })
          } else {
            setAmendmentDetails({
              name,
              minRippledVersion: states.unknown,
            })
          }
        })
      } else {
        setAmendmentDetails({
          name: states.unknown,
          minRippledVersion: states.unknown,
        })
      }
    })
  }, [data.instructions.Amendment])

  let amendmentStatus
  let expectedDate: string | null = states.unknown

  switch (data.instructions.Flags) {
    case undefined:
      amendmentStatus = 'Enabled'
      break
    case 65536:
      amendmentStatus = 'Got Majority'
      expectedDate = getExpectedDate(data.instructions.date, language)
      break
    case 131072:
      amendmentStatus = 'Lost Majority'
      break
    default:
      amendmentStatus = states.unknown
  }

  return (
    <>
      <SimpleRow label="Amendment Name" data-test="name">
        {amendmentDetails.name}
      </SimpleRow>
      <SimpleRow label="Amendment Status" data-test="status">
        <a href="https://xrpl.org/enableamendment.html#enableamendment-flags">
          {amendmentStatus}
        </a>
      </SimpleRow>
      <SimpleRow label="Introduced In" data-test="version">
        {amendmentDetails.minRippledVersion}
      </SimpleRow>
      {amendmentStatus === 'Got Majority' && (
        <SimpleRow label="Expected Date" data-test="date">
          {expectedDate}
        </SimpleRow>
      )}
    </>
  )
}
