import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useWindowSize } from 'usehooks-ts'

import { hexbin } from 'd3-hexbin'
import { Loader } from '../shared/components/Loader'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import './css/hexagons.scss'

const MAX_WIDTH = 1200
const getDimensions = (width) => ({
  width,
  height: Math.min(width, MAX_WIDTH) / 2.4,
  radius: Math.min(width, MAX_WIDTH) / 25,
})

const prepareHexagons = (data, list, height, radius, prev = []) => {
  const maxRows = Math.ceil(height / ((radius * 3) / 2))
  const hexWidth = radius * Math.sqrt(3)
  let row = 0
  let column = 0
  let max = 0

  return data.map((d, i) => {
    const pos = {
      x: column * hexWidth + (row % 2 ? hexWidth / 2 : 0),
      y: (row * radius * 3) / 2,
    }

    if (row === maxRows || (column === 0 && row === max)) {
      max += 1
      row = 0
      column = max
    } else {
      column -= 1
      row += 1
    }

    return {
      ...d,
      ...pos,
      ...list[d.pubkey],
      prev:
        prev[i] && prev[i].ledger_hash !== d.ledger_hash
          ? prev[i].ledger_hash.substring(0, 6)
          : undefined,
    }
  })
}

export const Hexagons = ({ list, data }) => {
  const { width } = useWindowSize()
  const [hexagons, setHexagons] = useState([])
  const { width: gridWidth, height: gridHeight, radius } = getDimensions(width)
  const { tooltip, showTooltip, hideTooltip } = useTooltip()
  const bin = hexbin()
    .extent([
      [0, 0],
      [gridWidth, gridHeight],
    ])
    .radius(radius)

  useEffect(() => {
    if (width > 0) {
      setHexagons((prevHexagons) =>
        prepareHexagons(data, list, gridHeight, radius, prevHexagons),
      )
    }
  }, [data, list, width, gridHeight, radius])

  const renderHexagon = (d, theHex) => {
    const { cookie, pubkey, ledger_hash: ledgerHash } = d
    const fill = `#${ledgerHash.substring(0, 6)}`
    const strokeWidth = theHex.radius() / 16
    return (
      <g
        key={`${pubkey}${cookie}${ledgerHash}`}
        transform={`translate(${d.x},${d.y})`}
        data-testid="hexagon"
        className="hexagon updated"
        onMouseOver={(e) =>
          showTooltip('validator', e, { ...d, v: list[d.pubkey] })
        }
        onFocus={() => {}}
        onMouseLeave={hideTooltip}
      >
        <path
          d={theHex.hexagon(theHex.radius() * 0.85)}
          fill={fill}
          stroke={fill}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    )
  }

  return (
    <div className="validators-container">
      <div className="validators">
        <svg width={gridWidth} height={gridHeight}>
          <g className="mesh">
            <path
              fill="none"
              d={bin.mesh()}
              strokeWidth={bin.radius() / 8}
              strokeLinejoin="round"
            />
          </g>
          <g className="hexagons" data-testid="hexagons">
            {hexagons.map((hexagon) => renderHexagon(hexagon, bin))}
          </g>
        </svg>
        {hexagons?.length === 0 && <Loader />}
      </div>
      <Tooltip tooltip={tooltip} />
    </div>
  )
}

Hexagons.propTypes = {
  list: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // eslint-disable-line
}
