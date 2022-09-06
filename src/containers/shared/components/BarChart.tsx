import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
import '../css/barchart.css'

interface Data {
  label: string
  value: number
}

interface BarChartProps {
  data: Data[]
}

interface AxisBottomProps {
  scale: d3.ScaleBand<string>
  transform: string
}

function AxisBottom({ scale, transform }: AxisBottomProps) {
  const ref = useRef<SVGGElement>(null)

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).attr('class', 'yAxis').call(d3.axisBottom(scale))
    }
  }, [scale])

  return <g ref={ref} transform={transform} />
}

interface AxisLeftProps {
  scale: d3.ScaleLinear<number, number, never>
}

function AxisLeft({ scale }: AxisLeftProps) {
  const ref = useRef<SVGGElement>(null)

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current)
        .attr('class', 'xAxis')
        .call(d3.axisLeft(scale))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('padding-right', '70px')
        .text('Y Axis Label')
    }
  }, [scale])

  return <g ref={ref} />
}

interface BarsProps {
  data: BarChartProps['data']
  height: number
  scaleX: AxisBottomProps['scale']
  scaleY: AxisLeftProps['scale']
}

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
  return (
    <>
      {data.map(({ value, label }) => (
        <rect
          key={`bar-${label}`}
          x={scaleX(label)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill="teal"
        />
      ))}
    </>
  )
}

function BarChart({ data }: BarChartProps) {
  const margin = { top: 10, right: 0, bottom: 20, left: 30 }
  const width = 1075 - margin.left - margin.right
  const height = 532 - margin.top - margin.bottom

  const scaleX = d3
    .scaleBand()
    .domain(data.map(({ label }) => label))
    .range([0, width])
    .padding(0.5)
  const scaleY = d3
    .scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0])

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
        <AxisLeft scale={scaleY} />
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
      </g>
    </svg>
  )
}

export default BarChart
