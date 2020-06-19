import {omit} from 'lodash/fp'

import {ensureArray} from './utils'

type RemovePropsType = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: TPropNames[] | TPropNames,
) => (props: TProps) => Omit<TProps, TPropNames>

const removeProps: RemovePropsType = (propNames) =>
  omit(ensureArray(propNames)) as any

export default removeProps
