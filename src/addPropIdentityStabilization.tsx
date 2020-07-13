import {CurriedUnchangedProps, flowMax, addRef, addProps} from 'ad-hok'
import {isEqual} from 'lodash/fp'

import cleanupProps from './cleanupProps'

type AddPropIdentityStabilizationType = <
  TProps,
  TPropName extends keyof TProps
>(
  propName: TPropName,
) => CurriedUnchangedProps<TProps>

const addPropIdentityStabilization: AddPropIdentityStabilizationType = (
  propName,
) =>
  flowMax(
    addRef(
      'propIdentityStabilizationRef',
      ({[propName]: propValue}) => propValue,
    ),
    addRef(
      'propIdentityStabilizationEqualRef',
      ({[propName]: propValue}) => propValue,
    ),
    addProps(
      ({
        propIdentityStabilizationRef,
        [propName]: propValue,
        propIdentityStabilizationEqualRef,
      }) => {
        const previousValue = propIdentityStabilizationRef.current
        const previousEqualValue = propIdentityStabilizationEqualRef.current
        if (previousValue === propValue) return {[propName]: previousValue}
        if (previousEqualValue === propValue) return {[propName]: previousValue}
        if (isEqual(previousValue, propValue)) {
          propIdentityStabilizationEqualRef.current = propValue
          return {[propName]: previousValue}
        }
        propIdentityStabilizationRef.current = propValue
        return {[propName]: propValue}
      },
    ),
    cleanupProps([
      'propIdentityStabilizationRef',
      'propIdentityStabilizationEqualRef',
    ]),
  )

export default addPropIdentityStabilization
