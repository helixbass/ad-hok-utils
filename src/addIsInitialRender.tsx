import {addRef, addProps, flowMax, SimplePropsAdder} from 'ad-hok'

import cleanupProps from './cleanupProps'

type AddIsInitialRenderType = SimplePropsAdder<{
  isInitialRender: boolean
}>

const refName = '_isInitialRender-ref'

const addIsInitialRender: AddIsInitialRenderType = flowMax(
  addRef(refName, 0),
  addProps(({[refName]: ref}) => {
    if (ref.current <= 2) {
      ref.current = ref.current + 1
    }
    return {}
  }),
  addProps(({[refName]: {current: numRenders}}) => ({
    isInitialRender: numRenders < 2,
  })),
  cleanupProps([refName]),
)

export default addIsInitialRender
