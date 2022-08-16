import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { geoPath, geoNaturalEarth1 } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { hexbin } from 'd3-hexbin'
import { feature } from 'topojson-client'
import Loader from '../shared/components/Loader'
import mapJSON from './countries.json'
import './css/map.scss'

const MAX_WIDTH = 1200
const BAR_COUNT = 30
const HEX_RADIUS_FACTOR = 40

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: feature(mapJSON, mapJSON.objects.countries).features,
    }
  }

  static getProjection = (width, height) =>
    geoNaturalEarth1()
      .scale(width / 4.8)
      .translate([width / 2.2, height / 1.7])

  static getHexbin = (offset, width, height) =>
    hexbin()
      .extent([
        [0, 0],
        [offset * 2 + width, height],
      ])
      .radius(Math.sqrt(width / HEX_RADIUS_FACTOR))

  getDimensions() {
    const { width: pageWidth } = this.props
    const width = Math.min(pageWidth, MAX_WIDTH)
    return {
      width,
      height: width / 2,
    }
  }

  renderMap(width, height) {
    const { locations, t, width: propsWidth } = this.props
    const { countries, tooltip } = this.state
    const offset = (propsWidth - width) / 2
    const projection = Map.getProjection(width, height)
    const hex = Map.getHexbin(offset, width, height)
    const bins = hex(locations.map((node) => projection([node.long, node.lat])))
    const counts = bins.map((bin) => bin.length)
    const max = counts.length ? Math.max(...counts) : 0
    const color = scaleLinear().domain([1, max]).range(['#FF6719', '#7919FF'])
    const bars = []
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
          {countries.map((d) => (
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
              onMouseOver={() => {
                this.setState({
                  tooltip: {
                    count: bin.length,
                    x: bin.x,
                    y: bin.y,
                  },
                })
              }}
              onFocus={(e) => {}}
              onKeyUp={(e) => {}}
              onMouseLeave={() => {
                this.setState({ tooltip: null })
              }}
            />
          ))}
        </g>
        {tooltip && (
          <g className="tooltip">
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

  render() {
    const { locations, width: propsWidth } = this.props
    const { width, height } = this.getDimensions()
    return (
      <div className="nodes-map" style={{ height }}>
        {!locations && <Loader />}
        <svg width={propsWidth} height={height}>
          {locations && this.renderMap(width, height)}
        </svg>
      </div>
    )
  }
}

Map.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  width: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
}

Map.defaultProps = {
  locations: null,
}

export default connect((state) => ({ width: state.app.width }))(
  withTranslation()(Map),
)
