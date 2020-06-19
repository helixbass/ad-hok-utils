import {CurriedPropsAdder, flowMax, addRef, addEffect} from 'ad-hok'
import {MutableRefObject} from 'react'

type AddPropTrackingRefType = <
  TProps,
  TPropName extends keyof TProps,
  TRefPropName extends string
>(
  propName: TPropName,
  refPropName: TRefPropName,
) => CurriedPropsAdder<
  TProps,
  {
    [refPropName in TRefPropName]: MutableRefObject<TProps[TPropName]>
  }
>

const addPropTrackingRef: AddPropTrackingRefType = (propName, refPropName) =>
  flowMax(
    addRef(refPropName, null as any),
    addEffect(
      ({[propName]: propValue, [refPropName]: ref}) => () => {
        ref.current = propValue
      },
      [propName],
    ),
  )

export default addPropTrackingRef
