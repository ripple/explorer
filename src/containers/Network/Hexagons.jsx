import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { hexbin } from 'd3-hexbin'
import Loader from '../shared/components/Loader'
import Tooltip from '../shared/components/Tooltip'
import './css/hexagons.scss'

const MAX_WIDTH = 1200
const getDimensions = (width) => ({
  width,
  height: Math.min(width, MAX_WIDTH) / 2.4,
  radius: Math.min(width, MAX_WIDTH) / 25,
})

const prepareHexagons = (data, list, prev = [], height, radius) => {
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
          ? prev[i].ledger_hash.substr(0, 6)
          : undefined,
    }
  })
}

class Validators extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { width, height, radius } = getDimensions(nextProps.width)
    return {
      selected: nextProps.selected,
      list: nextProps.list,
      hexagons: prepareHexagons(
        nextProps.data,
        nextProps.list,
        prevState.hexagons,
        height,
        radius,
      ),
      width,
      height,
      radius,
      hex: hexbin()
        .extent([
          [0, 0],
          [width, height],
        ])
        .radius(radius),
    }
  }

  showTooltip = (event, data) => {
    const { list } = this.state
    this.setState({
      tooltip: {
        ...data,
        mode: 'validator',
        v: list[data.pubkey],
        x: event.pageX,
        y: event.pageY,
      },
    })
  }

  hideTooltip = () => {
    this.setState({ tooltip: null })
  }

  renderHexagon = (d) => {
    const { selected, hex } = this.state
    const fill = `#${d.ledger_hash.substr(0, 6)}`
    const strokeWidth =
      selected === d.pubkey ? hex.radius() / 8 : hex.radius() / 16
    return (
      <g
        key={`${d.pubkey}${d.ledger_hash}`}
        transform={`translate(${d.x},${d.y})`}
        className={`hexagon updated ${selected === d.pubkey ? 'selected' : ''}`}
        onMouseOver={(e) => this.showTooltip(e, d)}
        onFocus={() => {}}
        onMouseLeave={this.hideTooltip}
      >
        <path
          d={hex.hexagon(hex.radius() * 0.85)}
          fill={fill}
          stroke={fill}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    )
  }

  render() {
    const { height, width, hex, hexagons, tooltip } = this.state
    const { language } = this.props
    return (
      <div className="validators-container">
        <div className="validators">
          <svg width={width} height={height}>
            <g className="mesh">
              <path
                fill="none"
                d={hex.mesh()}
                strokeWidth={hex.radius() / 8}
                strokeLinejoin="round"
              />
            </g>
            <g className="hexagons">{hexagons.map(this.renderHexagon)}</g>
          </svg>
          {hexagons.length === 0 && <Loader />}
        </div>
        <Tooltip language={language} data={tooltip} />
      </div>
    )
  }
}

Validators.propTypes = {
  language: PropTypes.string.isRequired,
  list: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // eslint-disable-line
  width: PropTypes.number.isRequired,
  selected: PropTypes.string,
}

Validators.defaultProps = {
  selected: undefined,
}

export default connect((state) => ({
  language: state.app.language,
  width: state.app.width,
}))(withTranslation()(Validators))
