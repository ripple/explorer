import { mount } from 'enzyme'
import { analytics } from '../../shared/analytics'
import AppErrorBoundary from '../AppErrorBoundary'

jest.mock('../../shared/analytics', () => {
  const { analytics: originalAnalytics } = jest.requireActual(
    '../../shared/analytics',
  )
  jest.spyOn(originalAnalytics, 'trackException')
  return {
    __esModule: true,
    analytics: originalAnalytics,
  }
})

const ProblemChild = () => {
  throw new Error('Error thrown from problem child')
}

describe('<AppErrorBoundary> component', () => {
  it('calls analytics with exception', () => {
    mount(
      <AppErrorBoundary>
        <ProblemChild />
      </AppErrorBoundary>,
    )
    expect(analytics.trackException).toBeCalledWith(expect.anything())
  })
})
