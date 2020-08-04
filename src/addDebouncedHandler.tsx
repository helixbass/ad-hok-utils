import {addHandlers, CurriedUnchangedProps, flowMax} from 'ad-hok'
import debounce from 'lodash.debounce'

import addPropTrackingRef from './addPropTrackingRef'
import cleanupProps from './cleanupProps'

type AddDebouncedHandlerType = <
  TPropName extends string,
  TProps extends {[handlerName in TPropName]: (...args: any[]) => any}
>(
  waitInterval: number,
  handlerPropName: TPropName,
) => CurriedUnchangedProps<TProps>

const addDebouncedHandler: AddDebouncedHandlerType = (
  waitInterval,
  handlerPropName,
) => {
  const refName = '_addDebouncedHandler-ref'
  const invokeRefHandlerName = '_addDebouncedHandler-invokeRef'

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
