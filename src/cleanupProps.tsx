import {omit} from 'lodash'

import ensureArray from './utils/ensureArray'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cleanupProps = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: TPropNames[] | TPropNames,
) => {
  const propNamesArray = ensureArray(propNames)
  return (props: TProps): TProps => omit(props, propNamesArray) as typeof props
}

export default cleanupProps
