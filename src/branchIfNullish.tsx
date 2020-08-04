import {ReactElement} from 'react'
import {branch, renderNothing, returns, flowMax} from 'ad-hok'

import ensureArray from './utils/ensureArray'
import some from './utils/some'
import declarePropsNonNullish from './declarePropsNonNullish'

type BranchIfNullishType = <TProps extends {}, TPropName extends keyof TProps>(
  propNames: Array<TPropName> | TPropName,
  opts?: {
    returns?: (props: TProps) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  Required<
    {
      [propName in TPropName]: NonNullable<TProps[propName]>
    }
  >

const branchIfNullish: BranchIfNullishType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return flowMax(
    branch(
      (props: {[propName: string]: any}) =>
        some((propName: string) => props[propName] == null, propNames),
      returnsOpt ? returns(returnsOpt) : renderNothing(),
    ),
    declarePropsNonNullish(propName),
  )
}

export default branchIfNullish
