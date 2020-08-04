import {ReactElement} from 'react'
import {branch, renderNothing, returns} from 'ad-hok'
import {isEmpty} from 'lodash'

import ensureArray from './utils/ensureArray'
import some from './utils/some'

type BranchIfEmptyType = <TProps extends {}, TPropName extends keyof TProps>(
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

const branchIfEmpty: BranchIfEmptyType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => isEmpty(props[propName]), propNames),
    returnsOpt ? returns(returnsOpt) : renderNothing(),
  ) as any
}

export default branchIfEmpty
