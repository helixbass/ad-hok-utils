import {useReducer, Reducer, useMemo} from 'react'
import {isFunction} from 'lodash'

type AddReducerOverPropsType = <TProps, TState, TAction>(
  reducer: (props: TProps) => Reducer<TState, TAction>,
  initialState: TState | ((props: TProps) => TState),
) => (props: TProps) => TProps & TState & {dispatch: (action: TAction) => void}

const addReducerOverProps: AddReducerOverPropsType = (
  reducer,
  initialState,
) => (props) => {
  const computedInitialState = useMemo(
    () => (isFunction(initialState) ? initialState(props) : initialState),
    [],
  )
  const [state, dispatch] = useReducer(reducer(props), computedInitialState)
  return {...props, ...state, dispatch}
}

export default addReducerOverProps
