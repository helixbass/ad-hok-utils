import {
  flowMax,
  addState,
  addHandlers,
  addEffect,
  CurriedPropsAdder,
} from 'ad-hok'

import addPropTrackingRef from './addPropTrackingRef'
import addDebouncedHandler from './addDebouncedHandler'
import cleanupProps from './cleanupProps'

type AddDebouncedCopyType = <
  TProps extends {},
  TPropName extends keyof TProps,
  TDebouncedPropName extends string
>(
  waitInterval: number,
  propName: TPropName,
  debouncedPropName: TDebouncedPropName,
) => CurriedPropsAdder<
  TProps,
  {
    [PropName in TDebouncedPropName]: TProps[TPropName]
  }
>

const addDebouncedCopy: AddDebouncedCopyType = (
  waitInterval,
  propName,
  debouncedPropName,
) => {
  const setterName = 'addDebouncedCopySetter'
  const refName = 'addDebouncedCopyRef'

  return flowMax(
    addState(
      debouncedPropName,
      setterName,
      ({[propName]: propValue}) => propValue,
    ),
    addPropTrackingRef(propName, refName),
    addHandlers(
      {
        [setterName]: ({[refName]: ref, [setterName]: setter}) => () => {
          setter(ref.current)
        },
      },
      [],
    ),
    addDebouncedHandler(waitInterval, setterName),
    addEffect(
      ({[setterName]: debouncedSetter}) => () => {
        debouncedSetter()
      },
      [propName],
    ),
    cleanupProps([setterName, refName]),
  )
}

export default addDebouncedCopy
