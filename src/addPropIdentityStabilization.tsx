import {CurriedUnchangedProps, flowMax, addRef, addProps} from 'ad-hok'
import isEqual from 'lodash.isequal'

import cleanupProps from './cleanupProps'

type AddPropIdentityStabilizationType = <
  TProps,
  TPropName extends keyof TProps
>(
  propName: TPropName,
) => CurriedUnchangedProps<TProps>

const refName = '_addPropIdentityStabilization-ref'
const equalRefName = '_addPropIdentityStabilization-equalRef'

const addPropIdentityStabilization: AddPropIdentityStabilizationType = (
  propName,
) =>
  flowMax(
    addRef(refName, ({[propName]: propValue}) => propValue),
    addRef(equalRefName, ({[propName]: propValue}) => propValue),
    addProps(
      ({[refName]: ref, [propName]: propValue, [equalRefName]: equalRef}) => {
        const previousValue = ref.current
        const previousEqualValue = equalRef.current
        if (previousValue === propValue) return {[propName]: previousValue}
        if (previousEqualValue === propValue) return {[propName]: previousValue}
        if (isEqual(previousValue, propValue)) {
          equalRef.current = propValue
          return {[propName]: previousValue}
        }
        ref.current = propValue
        return {[propName]: propValue}
      },
    ),
    cleanupProps([refName, equalRefName]),
  )

export default addPropIdentityStabilization
