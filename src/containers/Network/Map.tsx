import axios from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { geoPath, geoNaturalEarth1 } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { hexbin } from 'd3-hexbin'
import { feature } from 'topojson-client'
import { useWindowSize } from 'usehooks-ts'
import { Loader } from '../shared/components/Loader'
import './css/map.scss'

const MAX_WIDTH = 1200
const BAR_COUNT = 30
const HEX_RADIUS_FACTOR = 40

export interface MapProps {
  locations?: any[]
}

export const Map = ({ locations = undefined }: MapProps) => {
  const [tooltip, setTooltip] = useState<{
    count: number
    x: number
    y: number
  } | null>(null)
  const { t } = useTranslation()
  const { width: propsWidth } = useWindowSize()
  const { data: countries } = useQuery('countries', () =>
    axios
      .get('/countries.json')
      .then(
        (response) =>
          feature(response.data, response.data.objects.countries).features,
      ),
  )

  const getProjection = (width, height) =>
    geoNaturalEarth1()
      .scale(width / 4.8)
      .translate([width / 2.2, height / 1.7])

  const getHexbin = (offset, width, height) =>
    hexbin()
      .extent([
        [0, 0],
        [offset * 2 + width, height],
      ])
      .radius(Math.sqrt(width / HEX_RADIUS_FACTOR))

  const getDimensions = () => {
    const pageWidth = propsWidth
    const width = Math.min(pageWidth, MAX_WIDTH)
    return {
      width,
      height: width / 2,
    }
  }

  const renderMap = (width, height) => {
    const offset = (propsWidth - width) / 2
    const projection = getProjection(width, height)
    const hex = getHexbin(offset, width, height)
    const bins = hex(
      locations?.map((node) => projection([node.long, node.lat])),
    )
    const counts = bins.map((bin) => bin.length)
    const max = counts.length ? Math.max(...counts) : 0
    // @ts-ignore -- d3-color allows strings to be returned
    const color: Function<string> = scaleLinear()
      .domain([1, max])
      // @ts-ignore -- d3-color allows strings to be passed in
      .range(['#FF6719', '#7919FF'])
    const bars: { index: number; color: any }[] = []
    let i = 0
    const BAR_WIDTH = Math.ceil(width / (BAR_COUNT * 8))
    const BAR_HEIGHT = BAR_WIDTH / 1.5
    const LEGEND_OFFSET_X = BAR_WIDTH * 2 + offset
    const LEGEND_OFFSET_Y = BAR_WIDTH * 2
    const tooltipText = tooltip ? `${tooltip.count} ${t('nodes')}` : ''

    while (i < BAR_COUNT) {
      const increment = (max / BAR_COUNT) * i + 1
      bars.push({
        index: i,
        color: color(increment),
      })
      i += 1
    }

    return (
      <>
        <g className="map">
          {countries?.map((d) => (
            <path
              key={`path-${d.id}-${d.geometry.coordinates[0].length}`}
              d={geoPath().projection(projection)(d)}
              transform={`translate(${offset},0)`}
              className="country"
              strokeWidth={2}
            />
          ))}
        </g>
        <g className="mesh">
          <path
            d={hex.mesh()}
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            fillOpacity="0"
          />
        </g>
        {max && (
          <g className="legend">
            {bars.map((bar) => (
              <rect
                key={`bar-${bar.index}`}
                width={BAR_WIDTH}
                x={bar.index * BAR_WIDTH + LEGEND_OFFSET_X}
                y={height - LEGEND_OFFSET_Y}
                height={BAR_HEIGHT}
                fill={bar.color}
              />
            ))}
            <text
              className="min"
              textAnchor="start"
              y={height - LEGEND_OFFSET_Y * 1.2 - 8}
              x={LEGEND_OFFSET_X}
            >
              1
            </text>
            <text
              className="max"
              textAnchor="end"
              y={height - LEGEND_OFFSET_Y * 1.2 - 8}
              x={BAR_WIDTH * BAR_COUNT + LEGEND_OFFSET_X}
            >
              {max}
            </text>
          </g>
        )}
        <g className="hexagons">
          {bins.map((bin) => (
            <path
              key={`hex-${bin.x}${bin.y}`}
              d={hex.hexagon(hex.radius() * 0.9)}
              transform={`translate(${bin.x + offset},${bin.y})`}
              fill={color(bin.length)}
              fillOpacity="1"
              className="node"
              data-testid="node"
              onMouseOver={() => {
                setTooltip({
                  count: bin.length,
                  x: bin.x,
                  y: bin.y,
                })
              }}
              onFocus={() => {}}
              onKeyUp={() => {}}
              onMouseLeave={() => {
                setTooltip(null)
              }}
            />
          ))}
        </g>
        {tooltip && (
          <g className="tooltip" data-testid="tooltip">
            <rect
              rx="2"
              ry="2"
              x={tooltip.x + offset + 10}
              y={tooltip.y - 6}
              width={tooltipText.length * 8 + 4}
              height="15"
            />
            <text x={tooltip.x + offset + 12} y={tooltip.y + 6}>
              {tooltipText}
            </text>
          </g>
        )}
      </>
    )
  }

  const { width, height } = getDimensions()
  return (
    <div className="nodes-map" style={{ height }} data-testid="nodes-map">
      {!locations && <Loader />}
      <svg width={propsWidth} height={height}>
        {locations && renderMap(width, height)}
      </svg>
    </div>
  )
}
