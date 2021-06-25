import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';

describe('App actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  beforeEach(() => {
    store = mockStore({ app: initialState });
  });

  afterEach(() => {
    store = null;
  });

  it('should return correct data format for view update', () => {
    const expectedActions = [
      {
        data: { height: 768, width: 1024, pixelRatio: 1 },
        type: actionTypes.UPDATE_VIEWPORT_DIMENSIONS
      }
    ];
    store.dispatch(actions.updateViewportDimensions());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on onScroll', () => {
    const expectedActions = [{ type: actionTypes.ON_SCROLL, data: 25 }];
    const event = {
      target: {
        scrollingElement: {
          scrollTop: 25
        }
      }
    };
    store.dispatch(actions.onScroll(event));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
