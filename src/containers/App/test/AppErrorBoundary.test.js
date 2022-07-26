import React from 'react';
import { mount } from 'enzyme';
import { ANALYTIC_TYPES, analytics } from '../../shared/utils';
import AppErrorBoundary from '../AppErrorBoundary';

jest.mock('../../shared/utils', () => ({
    __esModule: true,
    ...jest.requireActual('../../shared/utils'),
    analytics: jest.fn(),
  }));

const ProblemChild = () => {
  throw new Error('Error thrown from problem child');
};

describe('<AppErrorBoundary> component', () => {
  it('calls analytics with exception', () => {
    mount(
      <AppErrorBoundary>
        <ProblemChild />
      </AppErrorBoundary>
    );
    expect(analytics).toBeCalledWith(ANALYTIC_TYPES.exception, expect.anything());
  });
});
