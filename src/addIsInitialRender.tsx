import {addRef, addProps, flowMax, SimplePropsAdder} from 'ad-hok'

import addEffectOnMount from './addEffectOnMount'
import cleanupProps from './cleanupProps'

type AddIsInitialRenderType = SimplePropsAdder<{
  isInitialRender: boolean
}>

const refName = 'isInitialRenderRef'

const addIsInitialRender: AddIsInitialRenderType = flowMax(
  addRef(refName, true),
  addEffectOnMount(({[refName]: ref}) => () => {
    ref.current = false
  }),
  addProps(({[refName]: {current: isInitialRender}}) => ({
    isInitialRender,
  })),
  cleanupProps([refName]),
)

export default addIsInitialRender
