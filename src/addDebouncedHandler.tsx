import {addHandlers, UnchangedProps, flowMax} from 'ad-hok'
import {debounce} from 'lodash'

import addPropTrackingRef from './addPropTrackingRef'
import cleanupProps from './cleanupProps'

type AddDebouncedHandlerType = <
  TPropName extends string,
  TProps extends {[handlerName in TPropName]: (...args: any[]) => any}
>(
  waitInterval: number,
  handlerPropName: TPropName,
) => UnchangedProps<TProps>

const addDebouncedHandler: AddDebouncedHandlerType = (
  waitInterval,
  handlerPropName,
) => {
  const refName = 'addDebouncedHandlerRef'
  const invokeRefHandlerName = 'addDebouncedHandlerInvokeRef'

  return flowMax(
    addPropTrackingRef(handlerPropName, refName),
    addHandlers(
      {
        [invokeRefHandlerName]: ({[refName]: handlerRef}) => (...args: any[]) =>
          handlerRef.current(...args),
      },
      [],
    ),
    addHandlers(
      {
        [handlerPropName]: ({[invokeRefHandlerName]: invokeRefHandler}) =>
          debounce(invokeRefHandler, waitInterval),
      },
      [],
    ),
    cleanupProps([refName, invokeRefHandlerName]),
  )
}

export default addDebouncedHandler