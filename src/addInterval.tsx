import {CurriedUnchangedProps} from 'ad-hok'

import useInterval from './useInterval'
import get from './utils/get'
import isFunction from './utils/isFunction'

type AddIntervalType = <TProps>(
  callback: (props: TProps) => () => void,
  delay: number | null | ((props: TProps) => number | null),
  additionalDependenciesThatShouldTriggerResettingInterval?: string[],
) => CurriedUnchangedProps<TProps>

const addInterval: AddIntervalType = (
  callback,
  delay,
  additionalDependenciesThatShouldTriggerResettingInterval = [],
) => (props) => {
  useInterval(
    callback(props),
    isFunction(delay) ? delay(props) : delay,
    additionalDependenciesThatShouldTriggerResettingInterval.map((dependency) =>
      get(dependency, props),
    ),
  )
  return props
}

export default addInterval
