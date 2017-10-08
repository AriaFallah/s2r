// @flow

import { createStore } from 'redux'
import { connect as c } from 'react-redux'

export type Action =
  | { type: 'UPDATE_SPICES', payload: ?Array<string> }
  | { type: 'UPDATE_DATA', payload: ?Array<Object> }

export type AppState = {
  data: ?Array<Object>,
  spices: ?Array<string>,
}

export type Dispatch = (a: Action) => void

const startState: AppState = {
  data: null,
  spices: null,
  query: null,
}

function rootReducer(state: AppState = startState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SPICES':
      return { ...state, spices: action.payload }
    case 'UPDATE_DATA':
      return { ...state, data: action.payload }
    default:
      ;(action.type: empty) // eslint-disable-line
      return state
  }
}

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export function connect<
  Props,
  SP: $Shape<Props>,
  DP: $Shape<Props>,
  OP: $Diff<$Diff<Props, SP>, DP>
>(
  component: React$ComponentType<Props>,
  mapStateToProps: ?(AppState) => SP,
  mapDispatchToProps: ?(Dispatch) => DP
): React$ComponentType<OP> {
  return c(mapStateToProps, mapDispatchToProps)(component)
}
