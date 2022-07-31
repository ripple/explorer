import * as actionTypes from '../actionTypes'
import reducer, { initialState } from '../reducer'

describe.only('app reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle UPDATE_VIEWPORT_DIMENSIONS', () => {
    const nextState = { ...initialState, height: 768, width: 1024 }
    expect(
      reducer(initialState, {
        data: { height: 768, width: 1024 },
        type: actionTypes.UPDATE_VIEWPORT_DIMENSIONS,
      }),
    ).toEqual(nextState)
  })

  it('should handle ON_SCROLL', () => {
    const nextState = { ...initialState, isScrolled: true }
    expect(
      reducer(initialState, { type: actionTypes.ON_SCROLL, data: 25 }),
    ).toEqual(nextState)
  })

  it('should handle UPDATE_LANGUAGE', () => {
    const nextState = { ...initialState, language: 'ja-JP' }
    expect(
      reducer(initialState, {
        type: actionTypes.UPDATE_LANGUAGE,
        data: 'ja-JP',
      }),
    ).toEqual(nextState)
  })

  it('should handle persist/REHYDRATE', () => {
    const presist = { ...initialState, isOverlayOpen: true, isScrolled: true }
    expect(
      reducer(initialState, {
        type: 'persist/REHYDRATE',
        payload: { app: presist },
      }),
    ).toEqual(initialState)
  })
})
