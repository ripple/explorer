import React from 'react'
import { TransactionAction } from '../Transaction/types'
import { transactionTypes } from '../Transaction'

export const TransactionActionIcon = ({ type }: { type: string }) => {
  const icons: any = {
    [TransactionAction.CREATE]: (
      <rect
        x="1"
        y="1.26489"
        width="8.47044"
        height="8.47044"
        rx="4.23522"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    ),
    [TransactionAction.MODIFY]: (
      <path
        d="M0.88208 5.42367C0.88208 2.5662 3.19852 0.249756 6.05599 0.249756V10.7498C3.19852 10.7498 0.88208 8.43332 0.88208 5.57584V5.42367Z"
        fill="currentColor"
      />
    ),
    [TransactionAction.FINISH]: (
      <rect
        x="1"
        y="1.26489"
        width="8.47044"
        height="8.47044"
        rx="4.23522"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    ),
    [TransactionAction.SEND]: (
      <path
        d="M8.90014 6.3666C9.56681 5.9817 9.56681 5.01945 8.90015 4.63455L1.68739 0.470264C1.02072 0.0853638 0.187388 0.566489 0.187388 1.33629L0.187388 9.66486C0.187388 10.4347 1.02072 10.9158 1.68739 10.5309L8.90014 6.3666Z"
        fill="currentColor"
      />
    ),
    [TransactionAction.CANCEL]: (
      <>
        <g clipPath="url(#clip0_812_30956)">
          <rect
            x="1.94043"
            y="1.26465"
            width="8.47044"
            height="8.47044"
            rx="4.23522"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M3.66895 2.99268L8.68262 8.00732"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        <defs>
          <clipPath id="clip0_812_30956">
            <rect
              width="10.47"
              height="10.47"
              fill="currentColor"
              transform="translate(0.94043 0.264648)"
            />
          </clipPath>
        </defs>
      </>
    ),
  }

  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[transactionTypes[type].action]}
    </svg>
  )
}
