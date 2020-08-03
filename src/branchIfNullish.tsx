import {ReactElement} from 'react'
import {branch, renderNothing, returns, flowMax} from 'ad-hok'
import {some} from 'lodash/fp'

import {ensureArray} from './utils'
import declarePropsNonNullish from './declarePropsNonNullish'

type BranchIfNullishType = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: Array<TPropNames> | TPropNames,
  opts?: {
    returns?: (props: TProps) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  Required<{[PropName in TPropNames]: NonNullable<TProps[PropName]>}>

const branchIfNullish: BranchIfNullishType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return flowMax(
    branch(
      (props: {[propName: string]: any}) =>
        some((propName: string) => props[propName] == null)(propNames),
      returnsOpt ? returns(returnsOpt) : renderNothing(),
    ),
    declarePropsNonNullish(propName),
  )
}

export default branchIfNullish
