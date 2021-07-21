import * as actionTypes from './actionTypes';

export const initialState = {
  width: 375,
  height: 600,
  isOverlayOpen: false,
  isScrolled: false,
  language: 'en-US',
  pixelRatio: 1,
};

const rehydrate = action => {
  const data = action.payload && action.payload.app ? action.payload.app : {};
  return { ...data, isOverlayOpen: false, isScrolled: false };
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_VIEWPORT_DIMENSIONS:
      return { ...state, ...action.data };
    case actionTypes.ON_SCROLL:
      return { ...state, isScrolled: action.data > 0 };
    case actionTypes.UPDATE_LANGUAGE:
      return { ...state, language: action.data };
    case 'persist/REHYDRATE':
      return { ...state, ...rehydrate(action) };
    default:
      return state;
  }
};

export default appReducer;
