import * as actionTypes from './actionTypes'

export const updateViewportDimensions = () => {
  let element = window
  let prefix = 'inner'
  if (!('innerWidth' in window)) {
    prefix = 'client'
    element = document.documentElement || document.body
  }

  return {
    type: actionTypes.UPDATE_VIEWPORT_DIMENSIONS,
    data: {
      width: element[`${prefix}Width`],
      height: element[`${prefix}Height`],
      pixelRatio: window.devicePixelRatio || 1,
    },
  }
}

export const onScroll = (event) => (dispatch) => {
  const value = event.target.scrollingElement.scrollTop || 0
  dispatch({ type: actionTypes.ON_SCROLL, data: value })
}

export const updateLanguage = (normalizedLang) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_LANGUAGE, data: normalizedLang })
}
