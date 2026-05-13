import { render, screen, cleanup } from '@testing-library/react'
import { act } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfigEnglish'
import { MaintenanceBanner } from '../MaintenanceBanner'

const START = '2030-01-01T10:00:00Z'
const END = '2030-01-01T10:30:00Z'

const renderBanner = (props?: { start?: string | null; end?: string | null }) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MaintenanceBanner
        start={props && 'start' in props ? props.start : START}
        end={props && 'end' in props ? props.end : END}
      />
    </I18nextProvider>,
  )

describe('MaintenanceBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  it('renders banner with countdown when current time is before the window', () => {
    jest.setSystemTime(new Date('2030-01-01T09:50:00Z'))
    renderBanner()

    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.getByText(/Scheduled maintenance:/)).toBeDefined()
    // The window label includes the formatted date/time range.
    expect(screen.getByText(/10:00.+10:30 UTC/)).toBeDefined()
    expect(screen.getByText(/~30 min downtime/)).toBeDefined()
    // 10 minutes until start
    expect(screen.getByText(/00h 10m 00s/)).toBeDefined()
    expect(screen.getByText(/Starts in/)).toBeDefined()
  })

  it('updates the countdown every second', async () => {
    jest.setSystemTime(new Date('2030-01-01T09:50:00Z'))
    renderBanner()
    expect(screen.getByText(/00h 10m 00s/)).toBeDefined()

    await act(async () => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.getByText(/00h 09m 55s/)).toBeDefined()
  })

  it('hides the countdown line once the window has started', () => {
    jest.setSystemTime(new Date('2030-01-01T10:15:00Z'))
    renderBanner()

    expect(screen.getByText(/Scheduled maintenance:/)).toBeDefined()
    expect(screen.queryByText(/Starts in/)).toBeNull()
  })

  it('does not render once the window has ended', () => {
    jest.setSystemTime(new Date('2030-01-01T11:00:00Z'))
    renderBanner()

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('does not render when start or end is null', () => {
    jest.setSystemTime(new Date('2030-01-01T09:50:00Z'))
    renderBanner({ start: null, end: null })
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('does not render when start or end is not a valid ISO timestamp', () => {
    jest.setSystemTime(new Date('2030-01-01T09:50:00Z'))
    renderBanner({ start: 'not-a-date', end: 'also-not-a-date' })
    expect(screen.queryByRole('status')).toBeNull()
  })
})
