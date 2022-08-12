import React from 'react'
import { mount } from 'enzyme'
import { CopyToClipboard } from '../CopyToClipboard'

describe('CopyToClipboard', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => {},
    },
  })
  jest.spyOn(navigator.clipboard, 'writeText')

  it('should trigger click event ', () => {
    const wrapper = mount(<CopyToClipboard className="copy" text="123456" />)

    wrapper.find('input').simulate('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123456')
    wrapper.unmount()
  })
})
