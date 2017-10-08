// @flow

import { createStore } from 'redux'
import { connect as c } from 'react-redux'

export type Action =
  | { type: 'UPDATE_QUERY', payload: ?string }
  | { type: 'UPDATE_DATA', payload: ?Array<Object> }

export type AppState = {
  data: ?Array<Object>,
  query: ?string,
}

export type Dispatch = (a: Action) => void

const startState: AppState = {
  data: null,
  query: null,
}

function rootReducer(state: AppState = startState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return { ...state, query: action.payload }
    case 'UPDATE_DATA':
      return { ...state, data: action.payload }
    default:
      ;(action.type: empty) // eslint-disable-line
      return state
  }
}

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export function connect<
  Props,
  SP: $Shape<Props>,
  DP: $Shape<Props>,
  OP: $Diff<$Diff<Props, SP>, DP>,
>(
  component: React$ComponentType<Props>,
  mapStateToProps: ?(AppState) => SP,
  mapDispatchToProps: ?(Dispatch) => DP,
): React$ComponentType<OP> {
  return c(mapStateToProps, mapDispatchToProps)(component)
}
