import { FC } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export interface AxisConfig {
  dataKey: string
  label: string
  color: string
  formatter: (value: number) => string
  show: boolean
}

export interface DualAxisAreaChartProps {
  data: any[]
  xAxisKey: string
  xAxisFormatter?: (value: any) => string
  leftAxis: AxisConfig
  rightAxis: AxisConfig
  height?: number
  margin?: { top: number; right: number; left: number; bottom: number }
  tooltipContent?: FC<TooltipProps<any, any>>
  gridStroke?: string
  axisStroke?: string
  tickColor?: string
  tickFontSize?: number
  showGrid?: boolean
  gradientOpacity?: number
}

export const DualAxisAreaChart: FC<DualAxisAreaChartProps> = ({
  data,
  xAxisKey,
  xAxisFormatter,
  leftAxis,
  rightAxis,
  height = 340,
  margin = { top: 10, right: 50, left: 50, bottom: 0 },
  tooltipContent,
  gridStroke = '#333',
  axisStroke = '#555',
  tickColor = '#888',
  tickFontSize = 13,
  showGrid = true,
  gradientOpacity = 0.5,
}) => {
  const tickInterval = data.length > 6 ? Math.floor(data.length / 5) : 0

  const leftGradientId = `gradient-${leftAxis.dataKey}`
  const rightGradientId = `gradient-${rightAxis.dataKey}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={margin}>
        <defs>
          <linearGradient id={leftGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={leftAxis.color}
              stopOpacity={gradientOpacity}
            />
            <stop
              offset="100%"
              stopColor={leftAxis.color}
              stopOpacity={gradientOpacity}
            />
          </linearGradient>
          <linearGradient id={rightGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={rightAxis.color}
              stopOpacity={gradientOpacity}
            />
            <stop
              offset="100%"
              stopColor={rightAxis.color}
              stopOpacity={gradientOpacity}
            />
          </linearGradient>
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="0"
            stroke={gridStroke}
            vertical={false}
            horizontal
          />
        )}

        <XAxis
          dataKey={xAxisKey}
          stroke={axisStroke}
          tick={{ fill: tickColor, fontSize: tickFontSize }}
          interval={tickInterval}
          tickFormatter={xAxisFormatter}
          tickLine={false}
        />

        <YAxis
          yAxisId="left"
          stroke={axisStroke}
          tick={{ fill: tickColor, fontSize: tickFontSize }}
          tickFormatter={leftAxis.formatter}
          tickLine={false}
          label={{
            value: leftAxis.label,
            angle: -90,
            position: 'insideLeft',
            style: {
              fill: '#fff',
              fontSize: tickFontSize,
              textAnchor: 'middle',
            },
            dx: -25,
          }}
        />

        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={axisStroke}
          tick={{ fill: tickColor, fontSize: tickFontSize }}
          tickFormatter={rightAxis.formatter}
          tickLine={false}
          label={{
            value: rightAxis.label,
            angle: 90,
            position: 'insideRight',
            style: {
              fill: '#fff',
              fontSize: tickFontSize,
              textAnchor: 'middle',
            },
            dx: 25,
          }}
        />

        {tooltipContent && <Tooltip content={tooltipContent} />}

        {leftAxis.show && (
          <Area
            yAxisId="left"
            type="monotone"
            dataKey={leftAxis.dataKey}
            stroke="none"
            strokeWidth={0}
            fill={`url(#${leftGradientId})`}
            dot={false}
            name={leftAxis.label}
            isAnimationActive={false}
          />
        )}

        {rightAxis.show && (
          <Area
            yAxisId="right"
            type="monotone"
            dataKey={rightAxis.dataKey}
            stroke="none"
            strokeWidth={0}
            fill={`url(#${rightGradientId})`}
            dot={false}
            name={rightAxis.label}
            isAnimationActive={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
