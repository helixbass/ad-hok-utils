import {addEffect, CurriedUnchangedProps, flowMax, addHandlers} from 'ad-hok'

import addPropTrackingRef from './addPropTrackingRef'
import cleanupProps from './cleanupProps'

type AddEffectOnUnmountType = <TProps>(
  callback: (props: TProps) => () => void,
) => CurriedUnchangedProps<TProps>

const addEffectOnUnmount: AddEffectOnUnmountType = (callback) => {
  const handlerName = '_addEffectOnUnmount-handler'
  const handlerRefName = '_addEffectOnUnmount-handlerRef'
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
