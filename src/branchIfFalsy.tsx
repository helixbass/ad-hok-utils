import {ReactElement} from 'react'
import {branch, renderNothing, returns} from 'ad-hok'
import {some} from 'lodash/fp'

import {ensureArray} from './utils'

type NonFalse<T> = T extends boolean ? T & true : T

type BranchIfFalsyType = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: Array<TPropNames> | TPropNames,
  opts?: {
    returns?: (props: TProps) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  Required<{[PropName in TPropNames]: NonFalse<NonNullable<TProps[PropName]>>}>

const branchIfFalsy: BranchIfFalsyType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => !props[propName])(propNames),
    returnsOpt ? returns(returnsOpt) : renderNothing(),
  ) as any
}

export default branchIfFalsy
