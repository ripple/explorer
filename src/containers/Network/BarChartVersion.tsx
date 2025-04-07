import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Label,
  ResponsiveContainer,
  Text,
  Cell,
} from 'recharts'
import { Loader } from '../shared/components/Loader'
import {
  PURPLE,
  GREY_600,
  GREY_800,
  GREEN_500,
  PURPLE_500,
  GREEN_800,
  PURPLE_700,
  GREY_0,
  GREY_400,
} from '../shared/utils'
import './css/barchart.scss'

interface Props {
  data: any[]
  stableVersion: string | null
}

interface LegendProps {
  stableVersion: string | null
}

// TODO: figure out a better way to import this from recharts
// copied from https://github.com/recharts/recharts/blob/master/src/component/DefaultTooltipContent.tsx
type ValueType = number | string | Array<number | string>
type NameType = number | string

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const { t } = useTranslation()
  if (active) {
    const valCount = payload?.[0]?.payload?.validatorCount ?? 0
    const valPercent = payload?.[0]?.payload?.validatorPercent.toFixed(2) ?? 0
    const nodeCount = payload?.[0]?.payload?.nodeCount ?? 0
    const nodePercent = payload?.[0]?.payload?.nodePercent.toFixed(2) ?? 0
    return (
      <div className="custom-tooltip">
        <p className="label">{t('version_display', { version: label })}</p>
        <p className="value">
          {t('validator_count', {
            val_count: `${valCount} (${valPercent}%)`,
          })}
        </p>
        <p className="value">
          {t('node_count', {
            node_count: `${nodeCount} (${nodePercent}%)`,
          })}
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = (props: LegendProps) => {
  const { stableVersion } = props
  const { t } = useTranslation()
  return (
    <div className="custom-legend">
      <div className="legend-color">
        <div className="segment">
          <span className="icon vals" />
          <span className="text">{t('validators')}</span>
        </div>
        <div className="segment">
          <span className="icon nodes" />
          <span className="text">{t('nodes')}</span>
        </div>
      </div>
      <div className="legend-stable">
        <div className="stable-text">
          <span>{t('current_stable_version')}:</span>
          <strong className="stable">
            {' '}
            {t('stable_version', { stableVersion })}{' '}
          </strong>
        </div>
      </div>
    </div>
  )
}

const stableColorCode = (
  type: string,
  dataLabel: string,
  stableVersion: string,
) => {
  if (dataLabel === stableVersion) {
    if (type === 'validators') return GREEN_500
    return PURPLE_500
  }
  if (type === 'validators') return GREEN_800
  return PURPLE_700
}

const BarChartVersion = (props: Props) => {
  const { data, stableVersion } = props
  const { t } = useTranslation()
  const [showTooltips, setShowTooltips] = useState(false)
  const customTick = (e) => {
    const {
      payload: { value },
    } = e
    const color = value === stableVersion ? GREY_0 : GREY_400
    e.fill = color
    if (value === stableVersion)
      /* eslint-disable react/jsx-props-no-spreading */
      return (
        <Text {...e} style={{ fontWeight: 700 }}>
          {value}
        </Text>
      )
    return <Text {...e}>{value}</Text>
  }
  return (
    <div className="barchart">
      <CustomLegend stableVersion={stableVersion} />
      <ResponsiveContainer height={532} width="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis
            dataKey="label"
            angle={-65}
            dy={30}
            dx={-7}
            height={90}
            tickLine={false}
            minTickGap={-1}
            stroke={GREY_400}
            tick={customTick}
            interval={0}
          />
          <YAxis
            className="yAxis"
            tickLine={false}
            tickFormatter={(tick) => `${tick}%`}
            stroke={GREY_400}
          >
            <Label
              className="y-label"
              value={t('%_of_total_nodes_validators')}
              angle={-90}
              position="insideTop"
              dx={45}
              dy={110}
            />
          </YAxis>
          <Bar
            dataKey="validatorPercent"
            barSize={30}
            fill={PURPLE}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            onMouseOver={() => setShowTooltips(true)}
            onMouseLeave={() => setShowTooltips(false)}
          >
            {stableVersion &&
              data.map((_entry, index) => (
                <Cell
                  key={data[index].label}
                  fill={stableColorCode(
                    'validators',
                    data[index].label,
                    stableVersion,
                  )}
                />
              ))}
          </Bar>
          <Bar
            dataKey="nodePercent"
            barSize={30}
            fill={PURPLE}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            onMouseOver={() => setShowTooltips(true)}
            onMouseLeave={() => setShowTooltips(false)}
          >
            {stableVersion &&
              data.map((_entry, index) => (
                <Cell
                  key={data[index].label}
                  fill={stableColorCode(
                    'nodes',
                    data[index].label,
                    stableVersion,
                  )}
                />
              ))}
          </Bar>
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            offset={-10}
            wrapperStyle={{
              backgroundColor: GREY_600,
              borderRadius: 8,
              border: `1px solid ${GREY_800}`,
              opacity: showTooltips ? '100%' : '0',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      {!(data !== null && data.length > 0 && stableVersion) && <Loader />}
    </div>
  )
}

export default BarChartVersion
