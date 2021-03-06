import {HandlerCreators, addHandlers} from 'ad-hok'

import mapValues from './utils/mapValues'

type AddExtendedHandlersType = <
  TProps,
  Creators extends HandlerCreators<TProps>
>(
  handlerCreators: Creators,
) => (
  props: TProps,
) => TProps & {[K in keyof Creators]: ReturnType<Creators[K]>}

const addExtendedHandlers: AddExtendedHandlersType = (extendedHandlers) =>
  addHandlers(
    mapValues(
      (extendedHandler, handlerName) => (props: any) => (args: any) => {
        const existingHandler = props[handlerName] || (() => {})
        existingHandler(args)
        extendedHandler(props)(args)
      },
      extendedHandlers,
    ),
  )

export default addExtendedHandlers
