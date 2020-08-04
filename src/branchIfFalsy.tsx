import {ReactElement} from 'react'
import {branch, renderNothing, returns} from 'ad-hok'

import ensureArray from './utils/ensureArray'
import some from './utils/some'

type NonFalse<T> = T extends boolean ? T & true : T

type BranchIfFalsyType = <TProps extends {}, TPropName extends keyof TProps>(
  propNames: Array<TPropName> | TPropName,
  opts?: {
    returns?: (props: TProps) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  Required<
    {
      [propName in TPropName]: NonFalse<NonNullable<TProps[propName]>>
    }
  >

const branchIfFalsy: BranchIfFalsyType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => !props[propName], propNames),
    returnsOpt ? returns(returnsOpt) : renderNothing(),
  ) as any
}

export default branchIfFalsy
