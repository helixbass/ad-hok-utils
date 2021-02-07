import {ReactElement} from 'react'
import {branch, renderNothing, returns} from 'ad-hok'

import ensureArray from './utils/ensureArray'
import some from './utils/some'

type NonFalse<T> = T extends boolean ? T & true : T
type NonTrue<T> = T extends boolean ? T & false : T

type BranchIfTruthyType = <TProps extends {}, TPropName extends keyof TProps>(
  propNames: Array<TPropName> | TPropName,
  opts?: {
    returns?: (
      props: TProps &
        Required<
          {
            [propName in TPropName]: NonFalse<NonNullable<TProps[propName]>>
          }
        >,
    ) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  {
    [propName in TPropName]: NonTrue<TProps[propName]>
  }

const branchIfTruthy: BranchIfTruthyType = (
  propName,
  {returns: returnsOpt} = {},
) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => !!props[propName], propNames),
    returnsOpt ? returns(returnsOpt) : renderNothing(),
  ) as any
}

export default branchIfTruthy
