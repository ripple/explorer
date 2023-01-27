import { mount } from 'enzyme'
import { vi } from 'vitest'
import { ANALYTIC_TYPES, analytics } from '../../shared/utils'
import AppErrorBoundary from '../AppErrorBoundary'

vi.mock('../../shared/utils', async () => ({
  __esModule: true,
  ...(await vi.importActual('../../shared/utils')),
  analytics: vi.fn(),
}))

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
    expect(analytics).toBeCalledWith(
      ANALYTIC_TYPES.exception,
      expect.anything(),
    )
  })
})
