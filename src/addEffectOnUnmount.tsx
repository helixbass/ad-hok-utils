import {addEffect, UnchangedProps, flowMax, addHandlers} from 'ad-hok'

import addPropTrackingRef from './addPropTrackingRef'
import cleanupProps from './cleanupProps'

type AddEffectOnUnmountType = <TProps>(
  callback: (props: TProps) => () => void,
) => UnchangedProps<TProps>

const addEffectOnUnmount: AddEffectOnUnmountType = (callback) => {
  const handlerName = 'addEffectOnUnmountHandler'
  const handlerRefName = 'addEffectOnUnmountHandlerRef'
  return flowMax(
    addHandlers({
      [handlerName]: (props) => () => {
        callback(props)()
      },
    }),
    addPropTrackingRef(handlerName, handlerRefName),
    addEffect(
      ({[handlerRefName]: handlerRef}) => () => {
        return () => {
          handlerRef.current()
        }
      },
      [],
    ),
    cleanupProps([handlerName, handlerRefName]),
  )
}

export default addEffectOnUnmount
