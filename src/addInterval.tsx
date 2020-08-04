import {CurriedUnchangedProps} from 'ad-hok'

import useInterval from './useInterval'
import get from './utils/get'

type AddIntervalType = <TProps>(
  callback: (props: TProps) => () => void,
  delay: number | null,
  additionalDependenciesThatShouldTriggerResettingInterval?: string[],
) => CurriedUnchangedProps<TProps>

const addInterval: AddIntervalType = (
  callback,
  delay,
  additionalDependenciesThatShouldTriggerResettingInterval = [],
) => (props) => {
  useInterval(
    callback(props),
    delay,
    additionalDependenciesThatShouldTriggerResettingInterval.map((dependency) =>
      get(dependency, props),
    ),
  )
  return props
}

export default addInterval
