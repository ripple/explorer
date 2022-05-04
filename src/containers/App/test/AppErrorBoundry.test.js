import React from 'react';
import { mount } from 'enzyme';
import { ANALYTIC_TYPES, analytics } from '../../shared/utils';
import AppErrorBoundry from '../AppErrorBoundry';

jest.mock('../../shared/utils', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../shared/utils'),
    analytics: jest.fn(),
  };
});

const ProblemChild = () => {
  throw new Error('Error thrown from problem child');
  return <div>Error</div>;
}

describe('<AppErrorBoundary> component',()=> {
  it('calls analytics with exception', () => {
    mount(<AppErrorBoundry><ProblemChild /></AppErrorBoundry>);
    expect(analytics).toBeCalledWith(ANALYTIC_TYPES.exception, expect.anything());
  });
})
