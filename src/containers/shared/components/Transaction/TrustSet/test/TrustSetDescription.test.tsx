import i18n from '../../../../../../i18n/testConfigEnglish'

import mockTrustSet from './mock_data/TrustSet.json'

import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('TrustSet: Description', () => {
  it('renders description for authorize', () => {
    const wrapper = createWrapper(mockTrustSet)
    expect(wrapper.html()).toBe(
      `<div>It establishes <b>CN¥1,000,000,000.00</b> as the maximum amount of <b>CNY</b> from <a data-testid="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" class="account" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a> that <a data-testid="account" title="rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc" class="account" href="/accounts/rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc">rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc</a> is willing to hold</div>`,
    )
    wrapper.unmount()
  })
})
